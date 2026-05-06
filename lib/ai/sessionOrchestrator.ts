import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { buildSystemPrompt } from "./contextBuilder";
import {
  generateSceneImage,
  generateSceneImageTool,
} from "./imageTool";
import { getReferenceBuffersForScene } from "./referenceImages";
import {
  aiDebug,
  isAiDebug,
  isAiDebugFull,
  summarizeMessagesForDebug,
} from "./aiDebug";
import type {
  LearnerProfileData,
  MemoryItemData,
  StorySpineContext,
  StoryStateData,
  StreamChunk,
  MessageData,
} from "../types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = "gpt-5.4-mini";

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    const e = new Error("The operation was aborted");
    e.name = "AbortError";
    throw e;
  }
}

function toOpenAIMessages(messages: MessageData[]): ChatCompletionMessageParam[] {
  return messages
    .filter((m) => m.content && m.content !== "__start__")
    .map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));
}

export async function* streamSessionResponse(
  profile: LearnerProfileData,
  memoryItems: MemoryItemData[],
  storyState: StoryStateData | null,
  recentSummaries: string[],
  sessionMessages: MessageData[],
  userMessage: string,
  opts?: {
    abortSignal?: AbortSignal;
    spine?: StorySpineContext | null;
    previouslyOn?: string | null;
  }
): AsyncGenerator<StreamChunk> {
  const abortSignal = opts?.abortSignal;
  const systemPrompt = buildSystemPrompt(profile, memoryItems, storyState, recentSummaries, {
    spine: opts?.spine ?? null,
    previouslyOn: opts?.previouslyOn ?? null,
  });

  const priorMessages = toOpenAIMessages(sessionMessages);
  const isStart = userMessage === "__start__";

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...priorMessages,
    ...(isStart ? [] : [{ role: "user" as const, content: userMessage }]),
    ...(isStart ? [{ role: "user" as const, content: "__start__" }] : []),
  ];

  if (isAiDebug()) {
    aiDebug("orchestrator", "turn_start", {
      model: MODEL,
      turn: isStart ? "session_start" : "user_message",
      systemPromptChars: systemPrompt.length,
      priorTurns: priorMessages.length,
      messagesOutline: summarizeMessagesForDebug(
        messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string" ? m.content : "[multipart]",
        })),
        120
      ),
    });
    if (isAiDebugFull()) {
      console.log(
        "[Primer AI:orchestrator] system_prompt (full — PRIMER_AI_DEBUG_FULL)\n---\n" +
          systemPrompt +
          "\n---"
      );
    }
  }

  let fullText = "";
  let toolCall: { id: string; name: string; args: string } | null = null;
  let imageUrl: string | null = null;

  const stream = await openai.chat.completions.create(
    {
      model: MODEL,
      messages,
      tools: [generateSceneImageTool],
      tool_choice: "auto",
      stream: true,
      //4/7/2026: Experiment with max_completion_tokens to see if it helps with the length of the responses.
      //This is temporary; a more sophisticated solution will calculate max_completion_tokens or 
      //verbosity based on user's age, language level, demonstrated interest, assessment type, etc.
      //I am worried about limiting effective tool calling if I implement low verbosity or max_completion_tokens.
      verbosity: "low",
      //max_completion_tokens: 150,
    },
    { signal: abortSignal }
  );

  for await (const chunk of stream) {
    throwIfAborted(abortSignal);
    const choice = chunk.choices[0];
    if (!choice) continue;

    const delta = choice.delta;

    if (delta.content) {
      fullText += delta.content;
      yield { type: "text", content: delta.content };
    }

    if (delta.tool_calls) {
      for (const tc of delta.tool_calls) {
        if (!toolCall) {
          toolCall = { id: tc.id || "", name: tc.function?.name || "", args: "" };
        }
        if (tc.function?.arguments) {
          toolCall.args += tc.function.arguments;
        }
      }
    }

    if (choice.finish_reason === "tool_calls" && toolCall) {
      aiDebug("orchestrator", "tool_calls_finish", {
        toolName: toolCall.name,
        toolCallId: toolCall.id,
        argsChars: toolCall.args.length,
      });
      if (isAiDebug()) {
        console.log(
          `[Primer AI:orchestrator] tool_arguments (truncated)`,
          toolCall.args.length > 800
            ? `${toolCall.args.slice(0, 800)}…`
            : toolCall.args
        );
      }

      let args: { prompt: string; alt_text: string; characters_in_scene?: string[] };
      try {
        args = JSON.parse(toolCall.args);
      } catch (e) {
        aiDebug("orchestrator", "tool_args_parse_error", {
          error: e instanceof Error ? e.message : String(e),
        });
        continue;
      }

      const charactersInScene = args.characters_in_scene ?? [];

      throwIfAborted(abortSignal);
      yield { type: "image_start" };

      try {
        const referenceBuffers = await getReferenceBuffersForScene(
          profile.id,
          charactersInScene,
          sessionMessages
        );
        throwIfAborted(abortSignal);
        imageUrl = await generateSceneImage(args.prompt, {
          referenceBuffers,
          abortSignal,
        });
        aiDebug("orchestrator", "image_done", {
          ok: true,
          imageChars: imageUrl.length,
          refCount: referenceBuffers.length,
        });
        yield {
          type: "image_done",
          url: imageUrl,
          prompt: args.prompt,
          charactersInScene,
        };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") throw err;
        console.error("Image generation failed:", err);
        aiDebug("orchestrator", "image_done", {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
        imageUrl = null;
        // Client must receive a terminal event after image_start, or loading never clears.
        yield {
          type: "image_done",
          url: "",
          prompt: args.prompt,
          charactersInScene,
        };
      }

      throwIfAborted(abortSignal);

      // Continue conversation after tool execution
      const continuationMessages: ChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "assistant",
          content: fullText || null,
          tool_calls: [
            {
              id: toolCall.id,
              type: "function",
              function: { name: toolCall.name, arguments: toolCall.args },
            },
          ],
        },
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            success: !!imageUrl,
            description: "Scene image generated and displayed to learner.",
          }),
        },
      ];

      aiDebug("orchestrator", "continuation_request", {
        model: MODEL,
        messagesInRequest: continuationMessages.length,
      });

      const stream2 = await openai.chat.completions.create(
        {
          model: MODEL,
          messages: continuationMessages,
          stream: true,
        },
        { signal: abortSignal }
      );

      for await (const chunk2 of stream2) {
        throwIfAborted(abortSignal);
        const c2 = chunk2.choices[0];
        const delta2 = c2?.delta;
        if (delta2?.content) {
          fullText += delta2.content;
          yield { type: "text", content: delta2.content };
        }
        const fr2 = c2?.finish_reason;
        if (fr2 && isAiDebug()) {
          aiDebug("orchestrator", "continuation_chunk_finish", {
            finish_reason: fr2,
          });
        }
      }
    } else if (choice.finish_reason && choice.finish_reason !== "tool_calls") {
      aiDebug("orchestrator", "first_stream_finish", {
        finish_reason: choice.finish_reason,
        assistantTextChars: fullText.length,
      });
    }
  }

  if (isAiDebug()) {
    aiDebug("orchestrator", "turn_end", {
      totalAssistantChars: fullText.length,
    });
  }
}

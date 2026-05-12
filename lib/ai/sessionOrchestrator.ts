import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { buildSystemPrompt } from "./contextBuilder";
import {
  generateSceneImage,
  generateSceneImageTool,
} from "./imageTool";
import {
  generateLearningActivityTool,
  recordStandardObservationTool,
} from "./standardsTool";
import { getReferenceBuffersForScene } from "./referenceImages";
import { recordStandardObservation } from "../services/standardsProgress";
import { createGeneratedMiniQuiz } from "../services/learningActivities";
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
    sessionId?: string;
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
  const toolCalls = new Map<number, { id: string; name: string; args: string }>();
  let imageUrl: string | null = null;

  const stream = await openai.chat.completions.create(
    {
      model: MODEL,
      messages,
      tools: [generateSceneImageTool, recordStandardObservationTool, generateLearningActivityTool],
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
        const index = tc.index ?? 0;
        const existing = toolCalls.get(index);
        if (!existing) {
          toolCalls.set(index, { id: tc.id || "", name: tc.function?.name || "", args: "" });
        }
        const row = toolCalls.get(index)!;
        if (tc.id) row.id = tc.id;
        if (tc.function?.name) row.name = tc.function.name;
        if (tc.function?.arguments) {
          row.args += tc.function.arguments;
        }
      }
    }

    if (choice.finish_reason === "tool_calls" && toolCalls.size > 0) {
      const orderedCalls = [...toolCalls.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([, v]) => v);
      const toolResults: Array<{ tool_call_id: string; content: string }> = [];

      yield { type: "assistant_thinking", phase: "tools" };

      for (const call of orderedCalls) {
        aiDebug("orchestrator", "tool_calls_finish", {
          toolName: call.name,
          toolCallId: call.id,
          argsChars: call.args.length,
        });
        if (isAiDebug()) {
          console.log(
            `[Primer AI:orchestrator] tool_arguments (truncated)`,
            call.args.length > 800 ? `${call.args.slice(0, 800)}…` : call.args
          );
        }

        let args: Record<string, unknown>;
        try {
          args = JSON.parse(call.args);
        } catch (e) {
          aiDebug("orchestrator", "tool_args_parse_error", {
            error: e instanceof Error ? e.message : String(e),
          });
          toolResults.push({
            tool_call_id: call.id,
            content: JSON.stringify({ success: false, error: "Invalid JSON arguments" }),
          });
          continue;
        }

        if (call.name === "generate_scene_image") {
          const prompt = typeof args.prompt === "string" ? args.prompt : "";
          const charactersInScene = Array.isArray(args.characters_in_scene)
            ? args.characters_in_scene.filter((v): v is string => typeof v === "string")
            : [];
          if (!prompt) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing prompt" }),
            });
            continue;
          }

          throwIfAborted(abortSignal);
          yield { type: "image_start" };

          try {
            const referenceBuffers = await getReferenceBuffersForScene(
              profile.id,
              charactersInScene,
              sessionMessages
            );
            throwIfAborted(abortSignal);
            imageUrl = await generateSceneImage(prompt, {
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
              prompt,
              charactersInScene,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                description: "Scene image generated and displayed to learner.",
              }),
            });
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") throw err;
            console.error("Image generation failed:", err);
            aiDebug("orchestrator", "image_done", {
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            });
            imageUrl = null;
            yield {
              type: "image_done",
              url: "",
              prompt,
              charactersInScene,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Image generation failed" }),
            });
          }
        } else if (call.name === "record_standard_observation") {
          const sessionId = opts?.sessionId;
          const standardCode =
            typeof args.standard_code === "string" ? args.standard_code.trim() : "";
          const evidenceTier =
            args.evidence_tier === "CONVERSATIONAL" ||
            args.evidence_tier === "GUIDED" ||
            args.evidence_tier === "CHECKPOINT"
              ? args.evidence_tier
              : "CONVERSATIONAL";
          if (!sessionId || !standardCode) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing session or standard_code" }),
            });
            continue;
          }

          try {
            const result = await recordStandardObservation({
              sessionId,
              standardCode,
              evidenceTier,
              correctness: typeof args.correctness === "number" ? args.correctness : undefined,
              notes: typeof args.notes === "string" ? args.notes : undefined,
            });
            yield {
              type: "standard_observation",
              standardCode: result.standardCode,
              mastery: result.mastery,
            };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: true, ...result }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else if (call.name === "generate_learning_activity") {
          const sessionId = opts?.sessionId;
          const standardCode =
            typeof args.standard_code === "string" ? args.standard_code.trim() : "";
          if (!sessionId || !standardCode) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({ success: false, error: "Missing session or standard_code" }),
            });
            continue;
          }

          try {
            const activity = await createGeneratedMiniQuiz({
              sessionId,
              standardCode,
              title:
                typeof args.title === "string" ? args.title : `Mini quiz: ${standardCode}`,
              instructions:
                typeof args.instructions === "string"
                  ? args.instructions
                  : "Pick the best answer for each question.",
              items: args.items,
            });
            yield { type: "activity_generated", activity };
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: true,
                activityId: activity.id,
                standardCode: activity.standardCode,
                itemCount: activity.items.length,
              }),
            });
          } catch (err) {
            toolResults.push({
              tool_call_id: call.id,
              content: JSON.stringify({
                success: false,
                error: err instanceof Error ? err.message : String(err),
              }),
            });
          }
        } else {
          toolResults.push({
            tool_call_id: call.id,
            content: JSON.stringify({ success: false, error: `Unknown tool: ${call.name}` }),
          });
        }
      }

      throwIfAborted(abortSignal);

      // Continue conversation after tool execution
      const continuationMessages: ChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "assistant",
          content: fullText || null,
          tool_calls: orderedCalls.map((call) => ({
            id: call.id,
            type: "function",
            function: { name: call.name, arguments: call.args },
          })),
        },
        ...toolResults.map((row) => ({
          role: "tool" as const,
          tool_call_id: row.tool_call_id,
          content: row.content,
        })),
      ];

      aiDebug("orchestrator", "continuation_request", {
        model: MODEL,
        messagesInRequest: continuationMessages.length,
      });

      yield { type: "assistant_thinking", phase: "continuation" };

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
      toolCalls.clear();
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

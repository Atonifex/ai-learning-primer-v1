import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { buildSystemPrompt } from "./contextBuilder";
import { generateSceneImage, generateSceneImageTool } from "./imageTool";
import type {
  LearnerProfileData,
  MemoryItemData,
  StoryStateData,
  StreamChunk,
  MessageData,
} from "../types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = "gpt-5.4-mini";

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
  userMessage: string
): AsyncGenerator<StreamChunk> {
  const systemPrompt = buildSystemPrompt(profile, memoryItems, storyState, recentSummaries);

  const priorMessages = toOpenAIMessages(sessionMessages);
  const isStart = userMessage === "__start__";

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...priorMessages,
    ...(isStart ? [] : [{ role: "user" as const, content: userMessage }]),
    ...(isStart ? [{ role: "user" as const, content: "__start__" }] : []),
  ];

  let fullText = "";
  let toolCall: { id: string; name: string; args: string } | null = null;
  let imageUrl: string | null = null;

  const stream = await openai.chat.completions.create({
    model: MODEL,
    messages,
    tools: [generateSceneImageTool],
    tool_choice: "auto",
    stream: true,
  });

  for await (const chunk of stream) {
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
      let args: { prompt: string; alt_text: string };
      try {
        args = JSON.parse(toolCall.args);
      } catch {
        continue;
      }

      yield { type: "image_start" };

      try {
        imageUrl = await generateSceneImage(args.prompt);
        yield { type: "image_done", url: imageUrl, prompt: args.prompt };
      } catch (err) {
        console.error("Image generation failed:", err);
        imageUrl = null;
        // Client must receive a terminal event after image_start, or loading never clears.
        yield { type: "image_done", url: "", prompt: args.prompt };
      }

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

      const stream2 = await openai.chat.completions.create({
        model: MODEL,
        messages: continuationMessages,
        stream: true,
      });

      for await (const chunk2 of stream2) {
        const delta2 = chunk2.choices[0]?.delta;
        if (delta2?.content) {
          fullText += delta2.content;
          yield { type: "text", content: delta2.content };
        }
      }
    }
  }
}

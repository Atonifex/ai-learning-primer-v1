import { NextRequest } from "next/server";
import OpenAI from "openai";
import { defineDebug } from "../../../lib/ai/aiDebug";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { word, sentence } = await req.json();
  defineDebug("request", { word, sentence: sentence?.slice(0, 80) });

  if (!word) return new Response("Missing word", { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        defineDebug("openai call start", { model: "gpt-5.4-nano", word });
        const completion = await openai.chat.completions.create({
          model: "gpt-5.4-nano",
          messages: [
            {
              role: "system",
              content:
                "You are a concise tutor. Define the given word or phrase in one sentence. Then use it in one natural example sentence. Two sentences total — no more. Be clear and direct.",
            },
            {
              role: "user",
              content: sentence
                ? `Define "${word}" as used in this context: "${sentence}"`
                : `Define "${word}"`,
            },
          ],
          stream: true,
          max_completion_tokens: 80,
        });

        let totalChunks = 0;
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            totalChunks++;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
        defineDebug("openai call done", { chunks: totalChunks });
      } catch (err) {
        defineDebug("openai call error", { error: String(err) });
        console.error("Define stream error:", err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: true })}\n\n`)
        );
      } finally {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { word, sentence } = await req.json();
  if (!word) return new Response("Missing word", { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
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
          verbosity: "low",
          reasoning: {
            effort: "low",
          }
          //max_tokens: 80,
        });

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
      } catch (err) {
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

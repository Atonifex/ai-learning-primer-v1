import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getCurrentUser } from "../../../lib/auth/session";
import { RHO_TTS_MODEL, RHO_TTS_VOICE } from "../../../lib/ai/models";
import { RHO_TTS_INSTRUCTIONS } from "../../../lib/play/rhoVoice";
import { prepareTtsText } from "../../../lib/play/ttsText";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Rho speaks → mp3 in memory → client plays → discard.
 * We never write the audio blob (COPPA hygiene; this is Rho, not the child).
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "CHILD") {
    return NextResponse.json({ error: "Sign in as a captain to play." }, { status: 403 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("TTS failed: OPENAI_API_KEY missing");
    return NextResponse.json({ error: "Voice is quiet right now." }, { status: 502 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const raw =
    typeof body === "object" && body !== null && "text" in body
      ? (body as { text: unknown }).text
      : null;
  if (typeof raw !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const text = prepareTtsText(raw);
  if (!text) {
    return NextResponse.json({ error: "Nothing to say" }, { status: 400 });
  }

  try {
    const speech = await openai.audio.speech.create({
      model: RHO_TTS_MODEL,
      voice: RHO_TTS_VOICE,
      input: text,
      instructions: RHO_TTS_INSTRUCTIONS,
      response_format: "mp3",
      speed: 0.95,
    });
    const bytes = new Uint8Array(await speech.arrayBuffer());
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "Content-Length": String(bytes.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("TTS failed:", message);
    return NextResponse.json({ error: "Voice is quiet right now." }, { status: 502 });
  }
}

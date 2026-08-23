import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai";
import { getCurrentUser } from "../../../lib/auth/session";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Speak → transcript → discard audio (COPPA). Never persist the blob.
 * Model: OpenAI STT (whisper-1). Live chat remains gpt-5.6-luna.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const blob = form.get("audio");
  if (!(blob instanceof Blob)) {
    return NextResponse.json({ error: "Missing audio" }, { status: 400 });
  }
  if (blob.size > MAX_BYTES) {
    return NextResponse.json({ error: "Clip too long" }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const file = await toFile(buffer, "speech.webm", { type: blob.type || "audio/webm" });
    const result = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });
    const text = result.text?.trim() ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("STT failed:", err);
    return NextResponse.json(
      { error: "Could not hear that. You can type a little instead." },
      { status: 502 }
    );
  }
}

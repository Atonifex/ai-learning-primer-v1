import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai";
import { getCurrentUser } from "../../../lib/auth/session";
import { speechFilenameForMime } from "../../../lib/play/sttAudio";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_BYTES = 4 * 1024 * 1024;

function asUploadBlob(value: FormDataEntryValue | null): Blob | null {
  if (!value || typeof value === "string") return null;
  // Prefer duck-typing: undici File may not pass `instanceof Blob` across realms.
  if (typeof value.arrayBuffer !== "function" || typeof value.size !== "number") {
    return null;
  }
  return value;
}

/**
 * Speak → transcript → discard audio (COPPA). Never persist the blob.
 * Model: OpenAI STT (whisper-1). Live chat remains gpt-5.6-luna.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "CHILD") {
    return NextResponse.json({ error: "Sign in as a captain to play." }, { status: 403 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("STT failed: OPENAI_API_KEY missing");
    return NextResponse.json(
      { error: "Could not hear that. You can type a little instead." },
      { status: 502 },
    );
  }

  const form = await req.formData();
  const blob = asUploadBlob(form.get("audio"));
  if (!blob) {
    return NextResponse.json({ error: "Missing audio" }, { status: 400 });
  }
  if (blob.size > MAX_BYTES) {
    return NextResponse.json({ error: "Clip too long" }, { status: 413 });
  }
  if (blob.size < 200) {
    return NextResponse.json(
      { error: "I didn’t catch that — try again, or type a little." },
      { status: 400 },
    );
  }

  const mime = blob.type || "audio/webm";
  const uploadedName =
    typeof File !== "undefined" && blob instanceof File && blob.name
      ? blob.name
      : speechFilenameForMime(mime);
  // Prefer extension derived from MIME so a wrong client name cannot poison Whisper.
  const filename = speechFilenameForMime(mime);

  try {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const file = await toFile(buffer, filename, { type: mime });
    const result = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
    });
    const text = result.text?.trim() ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("STT failed:", {
      mime,
      uploadedName,
      filename,
      size: blob.size,
      message,
    });
    return NextResponse.json(
      { error: "Could not hear that. You can type a little instead." },
      { status: 502 },
    );
  }
}

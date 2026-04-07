import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STYLE_PREFIX =
  "Photo realistic, detailed, high resolution, realistic lighting, realistic colors, realistic atmosphere. Adjust the scene to follow the recent scene description or hints from the user's messages about where they want to go, what they are looking at, or where the storyline is progressing to.";

export const IMAGE_MODEL = "gpt-image-1.5" as const;
const QUALITY = "low" as const;
const SIZE = "1536x1024" as const;

export interface GenerateSceneImageOptions {
  /**
   * When non-empty, uses images.edit with reference images (base64-decoded buffers).
   * As of `referenceImages.ts`, typically **one** buffer (latest portrait or prior scene).
   */
  referenceBuffers?: Buffer[];
  /** Cancels the in-flight OpenAI image request when the client aborts the session stream. */
  abortSignal?: AbortSignal;
}

function b64JsonToDataUrl(b64: string, outputFormat: string | undefined): string {
  const fmt = outputFormat ?? "png";
  const mime =
    fmt === "jpeg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : "image/png";
  return `data:${mime};base64,${b64}`;
}

/**
 * GPT Image models return `b64_json` only — not hosted URLs.
 */
function requestOpts(signal: AbortSignal | undefined) {
  return signal ? { signal } : undefined;
}

function dataUrlFromImageResponse(
  rows: { url?: string; b64_json?: string }[],
  outputFormat: string | undefined,
  emptyLabel: string
): string {
  const first = rows[0];
  if (first?.url) return first.url;
  const b64 = first?.b64_json;
  if (b64) return b64JsonToDataUrl(b64, outputFormat);
  throw new Error(`${emptyLabel} (data.length=${rows.length})`);
}

export async function generateSceneImage(
  prompt: string,
  options?: GenerateSceneImageOptions
): Promise<string> {
  const signal = options?.abortSignal;
  const refs = options?.referenceBuffers?.filter((b) => b.length > 0) ?? [];

  if (refs.length > 0) {
    const imageFiles = await Promise.all(
      refs.map((b, i) => toFile(b, `ref-${i}.png`, { type: "image/png" }))
    );
    const response = await openai.images.edit(
      {
        model: IMAGE_MODEL,
        image: imageFiles,
        prompt: STYLE_PREFIX + prompt,
        quality: QUALITY,
        size: SIZE,
        output_format: "png",
        input_fidelity: "medium",
      },
      requestOpts(signal)
    );
    return dataUrlFromImageResponse(
      response.data ?? [],
      response.output_format ?? undefined,
      "OpenAI edit returned no image"
    );
  }

  const response = await openai.images.generate(
    {
      model: IMAGE_MODEL,
      prompt: STYLE_PREFIX + prompt,
      quality: QUALITY,
      n: 1,
      size: SIZE,
      output_format: "png",
    },
    requestOpts(signal)
  );
  return dataUrlFromImageResponse(
    response.data ?? [],
    response.output_format ?? undefined,
    "OpenAI returned no image. GPT Image uses base64"
  );
}


//, or sooner if a new scene begins, the setting changes significantly, or a visually important moment occurs. 
export const generateSceneImageTool = {
  type: "function" as const,
  function: {
    name: "generate_scene_image",
    description:
      "Generate a scene image on every assistant message. For visual consistency, list named characters visible in the scene in characters_in_scene using the same names as in CURRENT STORY STATE.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description:
            "Detailed visual description of the scene. Include setting, mood, characters, lighting. Style is photo-realistic.",
        },
        alt_text: {
          type: "string",
          description: "Brief accessible description of the image.",
        },
        characters_in_scene: {
          type: "array",
          items: { type: "string" },
          description:
            "Names of recurring characters visible in this shot (must match story characters when applicable). Used for portrait consistency.",
        },
      },
      required: ["prompt", "alt_text"],
    },
  },
};

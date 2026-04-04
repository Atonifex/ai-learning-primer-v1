import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STYLE_PREFIX =
  "Photo realistic, detailed, high resolution, realistic lighting, realistic colors, realistic atmosphere. ";

export const IMAGE_MODEL = "gpt-image-1.5" as const;
const QUALITY = "medium" as const;
const SIZE = "1536x1024" as const;

export interface GenerateSceneImageOptions {
  /** When non-empty, uses images.edit with reference images (base64-decoded buffers). */
  referenceBuffers?: Buffer[];
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
export async function generateSceneImage(
  prompt: string,
  options?: GenerateSceneImageOptions
): Promise<string> {
  const refs = options?.referenceBuffers?.filter((b) => b.length > 0) ?? [];

  if (refs.length > 0) {
    const imageFiles = await Promise.all(
      refs.map((b, i) => toFile(b, `ref-${i}.png`, { type: "image/png" }))
    );
    const response = await openai.images.edit({
      model: IMAGE_MODEL,
      image: imageFiles,
      prompt: STYLE_PREFIX + prompt,
      quality: QUALITY,
      size: SIZE,
      output_format: "png",
      input_fidelity: "high",
    });

    const rows = response.data ?? [];
    const first = rows[0];
    if (first?.url) return first.url;
    const b64 = first?.b64_json;
    if (b64) return b64JsonToDataUrl(b64, response.output_format ?? undefined);
    throw new Error(`OpenAI edit returned no image (data.length=${rows.length})`);
  }

  const response = await openai.images.generate({
    model: IMAGE_MODEL,
    prompt: STYLE_PREFIX + prompt,
    quality: QUALITY,
    n: 1,
    size: SIZE,
    output_format: "png",
  });

  const rows = response.data ?? [];
  const first = rows[0];
  if (first?.url) return first.url;
  const b64 = first?.b64_json;
  if (b64) return b64JsonToDataUrl(b64, response.output_format ?? undefined);

  throw new Error(
    `OpenAI returned no image (data.length=${rows.length}). GPT Image uses base64.`
  );
}

export const generateSceneImageTool = {
  type: "function" as const,
  function: {
    name: "generate_scene_image",
    description:
      "Generate a scene image on every 2nd assistant message, or sooner if a new scene begins, the setting changes significantly, or a visually important moment occurs. For visual consistency, list named characters visible in the scene in characters_in_scene using the same names as in CURRENT STORY STATE.",
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

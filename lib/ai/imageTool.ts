import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STYLE_PREFIX =
  "Graphic novel illustration, painterly, warm cinematic lighting, rich colors, detailed, atmospheric. ";

/**
 * GPT image models (`gpt-image-1-mini`, etc.) return base64 by default — not URLs.
 * `response_format` / URLs apply to DALL·E; see OpenAI Images API docs.
 */
export async function generateSceneImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "gpt-image-1-mini",
    prompt: STYLE_PREFIX + prompt,
    n: 1,
    size: "1536x1024",
    output_format: "png",
  });

  const rows = response.data ?? [];
  const first = rows[0];

  if (first?.url) return first.url;

  const b64 = first?.b64_json;
  if (b64) {
    const fmt = response.output_format ?? "png";
    const mime =
      fmt === "jpeg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : "image/png";
    return `data:${mime};base64,${b64}`;
  }

  throw new Error(
    `OpenAI returned no image (data.length=${rows.length}). ` +
      `If you still see "No image URL returned", rebuild: stale .next bundle from before base64 support.`
  );
}

export const generateSceneImageTool = {
  type: "function" as const,
  function: {
    name: "generate_scene_image",
    description:
      "Generate a scene image when a new scene begins, the setting changes significantly, or a visually important moment occurs. Do NOT call this for every message — only for meaningful scene transitions.",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description:
            "Detailed visual description of the scene. Include setting, mood, characters, lighting. The style will automatically be graphic novel / painterly.",
        },
        alt_text: {
          type: "string",
          description: "Brief accessible description of the image.",
        },
      },
      required: ["prompt", "alt_text"],
    },
  },
};

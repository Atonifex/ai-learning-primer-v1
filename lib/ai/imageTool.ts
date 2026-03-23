import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STYLE_PREFIX =
  "Graphic novel illustration, painterly, warm cinematic lighting, rich colors, detailed, atmospheric. ";

export async function generateSceneImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "gpt-image-1-mini",
    prompt: STYLE_PREFIX + prompt,
    n: 1,
    size: "1536x1024",
  } as Parameters<typeof openai.images.generate>[0]) as { data: { url?: string; b64_json?: string }[] };

  const url = response.data[0]?.url;
  if (!url) throw new Error("No image URL returned from OpenAI");
  return url;
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

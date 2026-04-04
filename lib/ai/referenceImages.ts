import {
  getPortraitReferenceBuffers,
  loadImageBytesForMessage,
} from "../services/characterPortraits";
import type { MessageData } from "../types";

/**
 * Buffers for images.edit (GPT Image): prefer established character portraits,
 * else last scene image in the current session.
 */
export async function getReferenceBuffersForScene(
  profileId: string,
  charactersInScene: string[] | undefined,
  sessionMessages: MessageData[]
): Promise<Buffer[]> {
  const keys = charactersInScene?.length ? charactersInScene : [];
  const fromPortraits = await getPortraitReferenceBuffers(profileId, keys);
  if (fromPortraits.length > 0) {
    return fromPortraits.slice(0, 5);
  }

  const prior = [...sessionMessages]
    .reverse()
    .find(
      (m) => m.role === "ASSISTANT" && (m.imageUrl || m.imageStoragePath)
    );
  if (!prior) return [];

  const buf = await loadImageBytesForMessage({
    imageUrl: prior.imageUrl ?? null,
    imageStoragePath: prior.imageStoragePath ?? null,
  });
  return buf ? [buf] : [];
}

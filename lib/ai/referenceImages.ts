import {
  getPortraitReferenceBuffers,
  loadImageBytesForMessage,
} from "../services/characterPortraits";
import type { MessageData } from "../types";

/**
 * Buffers for images.edit (GPT Image): prefer established character portraits,
 * else last scene image in the current session.
 *
 * Reference count:
 * - Portrait path: **1** buffer — the **most recent** portrait frame only (`latestMessageId` image).
 * - Fallback (no portraits): **1** buffer — previous assistant message with a scene image in this session.
 * - `getPortraitReferenceBuffers` still loads up to 2 frames internally (establishing + latest) for the
 *   primary character; we intentionally pass only the last one here so the edit is not anchored to the
 *   first scene. The old `slice(0, 5)` never reached 5 with current code (max 2 per character × one
 *   primary character); it was a cap for a future multi-character expansion.
 *
 * REVERSIBLE — to pass **establishing + latest** again (up to 5 once multi-character refs exist):
 * Replace the `mostRecentOnly` block with:
 *   `return fromPortraits.slice(0, 5);`
 * (same file, portrait branch below)
 */
export async function getReferenceBuffersForScene(
  profileId: string,
  charactersInScene: string[] | undefined,
  sessionMessages: MessageData[]
): Promise<Buffer[]> {
  const keys = charactersInScene?.length ? charactersInScene : [];
  const fromPortraits = await getPortraitReferenceBuffers(profileId, keys);
  if (fromPortraits.length > 0) {
    const mostRecentOnly = fromPortraits[fromPortraits.length - 1];
    return mostRecentOnly ? [mostRecentOnly] : [];
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

import { prisma } from "../db/prisma";
import {
  deleteSceneObject,
  getSignedSceneUrl,
  isSceneStorageConfigured,
  sessionMessageObjectPath,
  uploadScenePng,
} from "../storage/sceneImages";
import type { MessageData, SessionData } from "../types";

export function normalizeCharacterKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Decode data URL or fetch signed URL bytes — for OpenAI edit input. */
export async function loadImageBytesForMessage(msg: {
  imageUrl: string | null;
  imageStoragePath: string | null;
}): Promise<Buffer | null> {
  if (msg.imageUrl?.startsWith("data:")) {
    const m = /^data:image\/\w+;base64,(.+)$/.exec(msg.imageUrl);
    if (m?.[1]) return Buffer.from(m[1], "base64");
  }
  if (msg.imageStoragePath && isSceneStorageConfigured()) {
    const url = await getSignedSceneUrl(msg.imageStoragePath, 120);
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }
  return null;
}

export async function getPortraitReferenceBuffers(
  profileId: string,
  characterKeys: string[]
): Promise<Buffer[]> {
  const primary = characterKeys.map(normalizeCharacterKey).filter(Boolean)[0];
  if (!primary) return [];

  const row = await prisma.characterPortrait.findUnique({
    where: {
      learnerProfileId_characterKey: { learnerProfileId: profileId, characterKey: primary },
    },
  });
  if (!row) return [];

  const buffers: Buffer[] = [];
  const seen = new Set<string>();

  for (const mid of [row.firstMessageId, row.latestMessageId]) {
    if (!mid || seen.has(mid)) continue;
    seen.add(mid);
    const m = await prisma.message.findUnique({ where: { id: mid } });
    if (!m) continue;
    const buf = await loadImageBytesForMessage({
      imageUrl: m.imageUrl,
      imageStoragePath: m.imageStoragePath,
    });
    if (buf) buffers.push(buf);
  }

  return buffers;
}

/**
 * After a new scene image is saved on a message: update first/latest portrait pointers
 * and delete superseded latest image from Storage (minimize retained blobs).
 */
export async function updatePortraitsAfterSceneImage(params: {
  profileId: string;
  sessionId: string;
  messageId: string;
  charactersInScene: string[];
  /** When null (storage not configured), only portrait message pointers are updated; no Storage deletes. */
  imageStoragePath: string | null;
}): Promise<void> {
  const { profileId, messageId, charactersInScene, imageStoragePath } = params;

  const keys = [...new Set(charactersInScene.map(normalizeCharacterKey).filter(Boolean))];
  if (!keys.length) return;

  for (const characterKey of keys) {
    const existing = await prisma.characterPortrait.findUnique({
      where: {
        learnerProfileId_characterKey: { learnerProfileId: profileId, characterKey },
      },
    });

    const displayName =
      charactersInScene.find((n) => normalizeCharacterKey(n) === characterKey) || characterKey;

    if (!existing) {
      await prisma.characterPortrait.create({
        data: {
          learnerProfileId: profileId,
          characterKey,
          displayName,
          firstMessageId: messageId,
          latestMessageId: messageId,
        },
      });
      continue;
    }

    const oldLatestId = existing.latestMessageId;
    if (
      imageStoragePath &&
      oldLatestId &&
      oldLatestId !== messageId
    ) {
      const oldMsg = await prisma.message.findUnique({ where: { id: oldLatestId } });
      if (oldMsg?.imageStoragePath && oldLatestId !== existing.firstMessageId) {
        await deleteSceneObject(oldMsg.imageStoragePath);
        await prisma.message.update({
          where: { id: oldLatestId },
          data: { imageStoragePath: null, imageUrl: null },
        });
      }
    }

    await prisma.characterPortrait.update({
      where: { id: existing.id },
      data: {
        latestMessageId: messageId,
        firstMessageId: existing.firstMessageId ?? messageId,
        displayName: existing.displayName || displayName,
      },
    });
  }
}

export async function persistMessageSceneToStorage(params: {
  profileId: string;
  sessionId: string;
  messageId: string;
  pngBytes: Buffer;
}): Promise<{ path: string; signedUrl: string | null } | null> {
  if (!isSceneStorageConfigured()) return null;
  const path = sessionMessageObjectPath(params.profileId, params.sessionId, params.messageId);
  await uploadScenePng(path, params.pngBytes);
  const signedUrl = await getSignedSceneUrl(path, 3600);
  return { path, signedUrl };
}

/** Resolve display URL for API responses (session load). */
export async function resolveMessageImageUrl(msg: MessageData): Promise<string | null> {
  if (msg.imageStoragePath && isSceneStorageConfigured()) {
    const u = await getSignedSceneUrl(msg.imageStoragePath, 3600);
    if (u) return u;
  }
  return msg.imageUrl ?? null;
}

/** Replace message `imageUrl` with a fresh signed URL when stored in Supabase (keeps base64/data URLs otherwise). */
export async function enrichSessionDataWithSignedUrls(
  session: SessionData
): Promise<SessionData> {
  const messages = await Promise.all(
    session.messages.map(async (m) => ({
      ...m,
      imageUrl: await resolveMessageImageUrl(m),
    }))
  );
  return { ...session, messages };
}

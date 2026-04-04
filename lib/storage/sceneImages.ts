import { createClient } from "@supabase/supabase-js";

const BUCKET_ENV = "SUPABASE_SCENE_BUCKET";

export function isSceneStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env[BUCKET_ENV]
  );
}

function bucket(): string {
  return process.env[BUCKET_ENV] || "scene-portraits";
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin env not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Upload PNG bytes; returns storage path (bucket-relative). */
export async function uploadScenePng(path: string, bytes: Buffer): Promise<string> {
  if (!isSceneStorageConfigured()) {
    throw new Error("Scene storage not configured");
  }
  const client = adminClient();
  const { error } = await client.storage.from(bucket()).upload(path, bytes, {
    contentType: "image/png",
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return path;
}

export async function deleteSceneObject(path: string): Promise<void> {
  if (!isSceneStorageConfigured()) return;
  const client = adminClient();
  await client.storage.from(bucket()).remove([path]);
}

/** Signed URL for private bucket reads (e.g. GET session). */
export async function getSignedSceneUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  if (!isSceneStorageConfigured() || !path) return null;
  const client = adminClient();
  const { data, error } = await client.storage
    .from(bucket())
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export function sessionMessageObjectPath(
  profileId: string,
  sessionId: string,
  messageId: string
): string {
  return `profiles/${profileId}/sessions/${sessionId}/${messageId}.png`;
}

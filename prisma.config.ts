import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

// Prisma CLI does not load .env by default; Next.js does. This makes
// `prisma generate` / `postinstall` work locally when only .env exists.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

// Prisma CLI (`migrate dev`, `migrate deploy`) uses this URL only — not the Next.js runtime.
//
// Supabase (official docs: connecting-to-postgres):
// - Migrations / long-lived tools → direct db.* (IPv6) OR session pooler :5432 (IPv4).
// - Do not use transaction pooler :6543 here — it often hangs or misbehaves for migrate.
//
// Next.js uses DATABASE_URL in lib/db/prisma.ts (transaction pooler for serverless).
const migrateUrl =
  process.env.MIGRATE_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();
if (!migrateUrl) {
  throw new Error(
    "Set DATABASE_URL. For Supabase, also set MIGRATE_DATABASE_URL (Session pooler URI from Connect → Session)."
  );
}

export default defineConfig({
  datasource: { url: migrateUrl },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});

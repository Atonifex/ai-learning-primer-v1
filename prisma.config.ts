import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

// Prisma CLI does not load .env by default; Next.js does. This makes
// `prisma generate` / `postinstall` work locally when only .env exists.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});

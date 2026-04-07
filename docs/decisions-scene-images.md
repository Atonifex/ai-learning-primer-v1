# Scene images & character portraits — implementation decisions

## API & model

- **GPT Image (`gpt-image-1.5`)** with **`quality: "medium"`** and **`1536x1024`**, **`output_format: "png"`**.
- Responses are treated as **base64 / data URLs** in the happy path (no reliance on OpenAI-hosted image URLs for persistence).
- **`images.generate`** when there are no reference buffers; **`images.edit`** when references exist, with **`input_fidelity: "medium"`** on the edit path.
- Tool output includes optional **`characters_in_scene`** so the server can update **`CharacterPortrait`** rows and prefer portrait-based references on later turns.

## Storage

- **Supabase Storage** holds durable PNGs (bucket name via **`SUPABASE_SCENE_BUCKET`**, default **`scene-portraits`** in code). **`SUPABASE_SERVICE_ROLE_KEY`** is used server-side only for upload and signed URL generation.
- If Supabase env is missing, messages still store **data URLs** in **`Message.imageUrl`**; portrait rows still update **message pointers**, but **no** Storage deletes occur for superseded “latest” images.

## Portrait policy

- At most **two logical portraits per character** (first establishing shot + latest), keyed by **`characterKey`** (normalized from the display name in **`characters_in_scene`**).
- When a new “latest” image is stored in Supabase, the **previous latest** blob may be deleted if it is not the same as the **first** pointer; the old message’s storage fields are cleared accordingly.

## Data model

- **`Message.imageStoragePath`**: bucket-relative path for the scene PNG.
- **`CharacterPortrait`**: links **`firstMessageId`** / **`latestMessageId`** to **`Message`** rows (no separate image table).

## API behavior

- **`GET /api/session/[id]`** resolves **`imageUrl`** to a **short-lived signed URL** when **`imageStoragePath`** is set, so clients are not sent huge base64 payloads on reload.

## Migrations

- **Two env vars** (see `.env.local.example`): **`DATABASE_URL`** = Supabase transaction pooler (app runtime); **`MIGRATE_DATABASE_URL`** = session pooler for Prisma CLI — aligns with Supabase connection docs and avoids migrate-on-`:6543` hangs.

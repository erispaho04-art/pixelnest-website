---
name: Pixel Nest Portfolio Architecture
description: Key decisions and constraints for the Pixel Nest full-stack portfolio project.
---

## Auth
- Admin auth uses bcryptjs (pure JS — NOT bcrypt which needs native build approval) + express-session.
- SESSION_SECRET secret is already provisioned; session cookie is sameSite=lax, httpOnly, 7 days.
- Type augmentation file (types/express-session.d.ts) must NOT be imported in app.ts — TypeScript picks it up automatically; esbuild errors on importing a .d.ts file.

**Why:** bcrypt requires pnpm approve-builds (interactive prompt, blocks CI); bcryptjs is identical API, pure JS.

## API client
- custom-fetch.ts uses `credentials: "include"` so session cookies flow on every API call.
- Never use Bearer tokens for web auth — sessions are cookie-based.

## Image URLs
- Static project images copied to `artifacts/portfolio/public/project-images/` → served at `/project-images/filename`.
- DB stores root-relative paths like `/project-images/filename.jpg` — use directly in img src.
- Object storage uploads return `objectPath` (also root-relative) — store as-is as imageUrl.

## DB Schema
- Tables: projects, settings, admins. Settings is a key-value store (key TEXT PK, value TEXT).
- Default admin: username=admin, password=PixelNest2024! (bcryptjs hash in admins table).

## Object Storage
- Provisioned via setupObjectStorage() — bucket ID in DEFAULT_OBJECT_STORAGE_BUCKET_ID secret.
- Storage route template copied from .local/skills/object-storage/templates/api-server/src/routes/storage.ts.

## Codegen
- OpenAPI spec must NOT use `format: uri` on string fields — Orval generates z.url() which doesn't exist in zod v3.
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Real project images (22 total)
- Smart Capital Real Estate: 11 images (social media, print, marketing)
- Niko's Grill: 11 images (branding, business cards, social media)
- All in attached_assets/, also copied to artifacts/portfolio/public/project-images/

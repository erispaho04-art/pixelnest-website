---
name: Pixel Nest Portfolio Architecture
description: Full-stack portfolio site for Pixel Nest agency — Express/PostgreSQL API, React/Vite frontend, admin CMS, session auth, object storage.
---

## Stack

- **Frontend:** React + Vite + Tailwind + TypeScript → `artifacts/portfolio` (preview path `/`)
- **Backend:** Express + pino + esbuild → `artifacts/api-server` (port 8080, path `/api`)
- **Database:** Replit PostgreSQL via Drizzle ORM → `@workspace/db`
- **Auth:** bcryptjs + express-session (7-day), `SESSION_SECRET` env var
- **Image storage:** Static files in `public/project-images/`, root-relative URLs
- **API contract:** OpenAPI → Orval → `@workspace/api-client-react` hooks

## Key Decisions

- **bcryptjs not bcrypt** — bcrypt requires interactive build approval; bcryptjs is pure JS with identical API.
- **No `format: uri` in OpenAPI spec** — Orval generates `z.url()` which doesn't exist in Zod v3.
- **Type-only `.d.ts` files must NOT be imported in `app.ts`** — esbuild errors on runtime import of a declaration file.
- **All image URLs are root-relative** — `/project-images/file.jpg` used directly in `<img src>`.
- **Sitemap served from Express** — sets `application/xml; charset=utf-8` explicitly; static server hardcodes `text/xml`.
- **Purple accent color** — `hsl(263 70% 55%)` throughout CSS variables.
- **Production session cookie** — `secure: isProduction` so HTTPS-only when deployed. Requires `app.set('trust proxy', 1)` or Express won't send the secure cookie through Replit's reverse proxy, causing login to return 200 but /api/auth/me to return 401.
- **Loading screen on every route** — `LoadingScreen` mounted in `App` plays on `/admin` too. Fixed by rendering it only when `location === '/'` (inside `AppInner` with `useLocation`).
- **`PORT` guard in vite.config.ts** — Skip the guard when `process.argv.includes('build')` or `NODE_ENV === 'production'` so `pnpm run build` works without env vars.
- **react-query v5 `queryKey` required** — When passing `query` options to Orval-generated hooks, must include `queryKey` explicitly (e.g. `queryKey: ['auth-me']`) even though the hook would override it — v5 `UseQueryOptions` requires it at the type level.
- **`PORT` guard in vite.config.ts** — Both portfolio and mockup-sandbox throw if PORT is missing. Fix: skip the guard when `process.argv.includes('build')` or `NODE_ENV === 'production'` so `pnpm run build` works without env vars.

## Database

Three tables (pushed via `drizzle-kit push`):
- `projects` — id, title, description, category, image_url, display_order, created_at
- `settings` — key (PK), value
- `admins` — id, username, password_hash

**Seeded:** Admin `admin`/`PixelNest2024!`; 22 client project images (Smart Capital Real Estate × 11, Niko's Grill × 11).

## Production

- Live at `https://pixelnest.al`
- API healthcheck: `https://pixelnest.al/api/healthz`
- No GitHub remote configured as of last session.

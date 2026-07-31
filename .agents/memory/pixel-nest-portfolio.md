---
name: Pixel Nest Portfolio Architecture
description: Full-stack portfolio for Pixel Nest (pixelnest.al) — Express/PostgreSQL API, admin CMS, session auth, object storage. Current layout and key decisions.
---

## Stack
- Frontend: React + Vite + Tailwind + TypeScript + Wouter — `artifacts/portfolio`
- Backend: Express + esbuild — `artifacts/api-server` (port 8080, `/api`)
- DB: Replit PostgreSQL via Drizzle ORM — `lib/db`
- Auth: bcryptjs + express-session (`SESSION_SECRET` env var); `req.session?.adminId`; `app.set('trust proxy', 1)` for secure cookies
- Image storage: Replit Object Storage → `/api/storage/objects/uploads/{uuid}`
- API client: OpenAPI → Orval → `@workspace/api-client-react`

**Admin credentials:** username `admin`, password `PixelNest2024!`

## Current Page Layout (as of latest session)
Hero → Stats → About → Services → Portfolio → Testimonials → Contact → Footer

Sections removed from page (components still exist but are not rendered):
- FeaturedProjects, WhyChooseUs, ClientLogos, ContactCTA

## Hero Section
- Centered, full-viewport, no 3D model
- Badge → H1 (highlighted) → subtitle → CTA buttons → decorative rule + mini stats → bouncing ArrowDown scroll indicator
- Ambient glows: left, right, centre bloom
- Animation delays: 2.2s, 2.4s, 2.6s, 2.8s, 3.0s (loading screen is visible during these)

## 3D MacBook — REMOVED
- `MacBook3D.tsx` and `MacBookMockup.tsx` deleted
- `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` uninstalled
- Bundle dropped from ~1,592 kB → ~607 kB (62% reduction)

## Stats → About Transition
- Stats: solid purple background (`bg-primary`), counter animations
- About: `bg-background` with a `from-primary/10 to-transparent` gradient bridge at the top (32-tall overlay), ambient centre glow, enhanced `whileInView` scroll reveal (fade-up from y:32, scale on skill tags)

## DB Schema
- `projectsTable`: id, title, category, description, imageUrl, challenge, solution, results, technologies (JSON text), websiteUrl, gallery (JSON text), order, featured, createdAt
- `clientsTable`: id, name, logoUrl, websiteUrl, order, createdAt

## Key Auth Decision
`req.session?.adminId` (not Passport); bcryptjs (pure JS — avoids native build issues on Replit)

**Why:** Replit's build environment lacks native bindings needed by some bcrypt variants; bcryptjs avoids the problem entirely.

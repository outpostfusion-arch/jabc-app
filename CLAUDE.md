# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server at http://localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm db:push      # sync Prisma schema to Supabase (uses DIRECT_URL)
pnpm db:generate  # regenerate Prisma client after schema changes
pnpm seed         # seed the database (prisma/seed.ts)
```

No test suite is configured.

## Architecture Overview

**Arrow Leaf** — a Next.js 16 App Router platform for the Junior Achievement Business Challenge (JABC). Teachers manage a class; students work through 6 sessions building a business plan, then pursue maker tracks (Digital Design, 3D Design, Video Games, Pixel Art).

### Auth & Roles

- **NextAuth 5 beta** with a Credentials provider. Username/password, bcrypt hashed.
- Two roles: `TEACHER` and `STUDENT` (Prisma `Role` enum).
- Session JWT carries `id`, `role`. Accessed server-side via `auth()` from `@/lib/auth`.
- Auth is split: `src/auth.config.ts` (Edge-safe, no Prisma, used in middleware) and `src/lib/auth.ts` (full, uses Prisma adapter).
- Middleware (`src/proxy.ts`) redirects by role and respects a `jabc-view-mode=student` cookie that lets teachers preview the student interface.

### Route Groups

| Group | Path prefix | Who sees it |
|---|---|---|
| `(auth)` | `/login` | Anyone unauthenticated |
| `(teacher)` | `/teacher/...` | Teachers only |
| `(student)` | `/dashboard`, `/choose-robot`, `/session/[id]/...`, `/progress`, `/reflection`, `/reflection-gallery`, `/track/[slug]` | Students (+ teachers with cookie) |

Teachers are redirected to `/teacher/dashboard` on login. Students go to `/dashboard`.

### Student Dashboard & Tracks

The student dashboard (`/dashboard`) shows the Arrow Leaf branding and four **Maker Tracks**:

| Track | Status | Route |
|---|---|---|
| Digital Design & Marketing | Unlocked after choosing robot | `/track/digital-design` |
| 3D Design | Coming soon (locked) | `/track/3d-design` |
| Video Game Building | Coming soon (locked) | `/track/video-game` |
| Pixel Art & Animation | Coming soon (locked) | `/track/pixel-art` |

Students must choose a robot avatar before any track unlocks. The dashboard checks `!!user.robotId`.

### Robot Avatar System

Students visit `/choose-robot` to build their robot. This is a **5-step DiceBear Bottts builder**:

1. **Head** — `face[]`: round01, round02, square01–04 (6 shapes × multiple colour seeds = 20 cards)
2. **Eyes** — `eyes[]`: 14 unique styles + 6 colour variants = 20 cards
3. **Antenna** — `top[]`: 9 styles × colour variants = 20 cards
4. **Arms** — `sides[]`: 7 side-attachment styles × colour variants = 20 cards
5. **Body** — `texture[]`: 8 textures × colour variants = 20 cards

Each step shows a live assembled preview at the top. Cards use CSS zoom/crop (`overflow:hidden` + `marginTop` offset) to focus on the relevant part. The final config is stored as JSON in `User.robotId`.

**BotttsConfig** (stored as `JSON.stringify` in `User.robotId`):
```json
{
  "face": "square01", "faceKey": "h08",
  "eyes": "glow",     "eyesKey": "e06",
  "top": "antenna",   "topKey": "t01",
  "sides": "round",   "sidesKey": "s13",
  "texture": "circuits", "textureKey": "b06"
}
```

**Robot URL formula** (for display anywhere):
```
https://api.dicebear.com/7.x/bottts/svg?seed={faceKey}{eyesKey}{topKey}{sidesKey}{textureKey}&colorful=true&face[]={face}&eyes[]={eyes}&top[]={top}&sides[]={sides}&texture[]={texture}
```

**API**: `GET /api/robot` returns `{ robotConfig }`. `PUT /api/robot` accepts `{ robotConfig: BotttsConfig }`, validates DiceBear values, stores as JSON string. `DELETE /api/robot` (teacher-only) clears the robot.

> `src/components/robot-builder/` (parts.tsx, RobotSVG.tsx, RobotBuilderUI.tsx) — SVG-based builder built in a prior iteration. **Currently unused** — do not delete, may be reused for cosmetics layer later.

### Student Sessions (6 total)

Each session lives at `/session/[id]/<slug>`. The `id` is `ClassSession.id` from the DB.

| id | slug | Feature |
|----|------|---------|
| 1 | `bmc` | Business Model Canvas |
| 2 | `target-market` | Target Market & Promotions quiz |
| 3 | `team-workspace` | Team chat + Marketing doc |
| 4 | `tutorials` | Teacher-uploaded videos + reflection prompts |
| 5 | `financials` | Income/expense tracker + pricing calculator |
| 6 | `brand` | Logo builder (Fabric.js canvas) + brand profile |

Sessions can be locked/unlocked by teachers. Progress is tracked per-student per-session (`NOT_STARTED` / `IN_PROGRESS` / `COMPLETED`).

### Student Reflections

Program-wide reflection (not tied to a single session).

| Route | Who | Purpose |
|---|---|---|
| `/reflection` | Student | 5 questions + mood emoji + skill self-ratings + goal check-in |
| `/reflection-gallery` | Student | Teacher-featured reflections (read-only) |
| `/teacher/reflections` | Teacher | Review all, leave feedback, feature for gallery, export CSV |

Fields on `StudentReflection`: `whatLearned`, `marketInsight`, `proudOf`, `challenges`, `nextSteps`, `moodEmoji`, `skillTeamwork/Creativity/Business/Leadership` (0–5), `goalStatus`, `teacherFeedback`, `isFeatured`.

### Database

Prisma 7 with PostgreSQL (Supabase). Client generated at `src/generated/prisma`. `prisma.config.ts` uses `DIRECT_URL` (port 5432 session pooler) for schema operations. Runtime uses `DATABASE_URL` (port 6543 transaction pooler). The `schema.prisma` datasource block has **no** `url` or `directUrl` — those live only in `prisma.config.ts`.

PrismaClient must use the `PrismaPg` adapter (see `src/lib/prisma.ts`):
```ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
```

Key models: `User`, `ClassGroup`, `ClassSession`, `SessionProgress`, `BusinessModelCanvas`, `TargetMarketProfile`, `Team`, `TeamMember`, `TeamMessage`, `Video`, `VideoPrompt`, `VideoReflection`, `FinancialRecord`, `PricingCalculation`, `Logo`, `BrandProfile`, `Badge`, `UserBadge`, `UserUnlock`, `StudentReflection`.

### Key Shared Components

- `src/components/shared/AvatarImage.tsx` — 23 SVG cartoon animal avatars. `avatarEmoji` DB field stores the avatar ID string (e.g. `"fox"`), not an emoji.
- `src/components/shared/ViewModeToggle.tsx` — Fixed pill letting teachers switch view via `jabc-view-mode` cookie.
- `src/components/shared/StudentNav.tsx` — Top nav for the student layout.
- `src/components/shared/TeacherSidebar.tsx` — Fixed left sidebar for teacher layout.
- `src/components/arrow/ResetMascot.tsx` — Teacher-clickable robot on the dashboard that resets `robotId` (calls `DELETE /api/robot`).

### BMC Canvas

`src/components/bmc/BMCCanvas.tsx` — all canvas state, `BLOCK_CONFIG` (9 blocks with demo data, colors, gradients), and name/tagline generator pools. Accepts `teacherMode` prop which surfaces the demo-fill button on each block.

`src/components/bmc/BMCBlock.tsx` — 3D-flip card. Front = editable; back = lemonade stand example. Uses CSS grid stacking (`gridArea: "1/1"`) for both faces.

### Styling

Tailwind 4 + inline `style` props for dynamic values (colors, gradients, shadows). No CSS modules. `globals.css` must import Google Fonts **before** `@import "tailwindcss"` — reversing this order breaks the build.

### API Routes

All under `src/app/api/`. Per-session feature routes. BMC auto-saves via `PUT /api/bmc` with 600 ms debounce. Badge awarding happens server-side inside route handlers.

### Known Pre-existing TypeScript Errors

- `next.config.ts` — `eslint` key deprecated, not a blocker
- `src/app/(student)/progress/page.tsx` — `Badge.points` → renamed to `Badge.pointValue` in schema
- `src/app/api/students/[id]/route.ts` — `createdAt` orderBy field mismatch
- `src/components/financials/FinancialTracker.tsx` — duplicate `id` prop

Do not fix these unless the task specifically targets them.

### Environment Variables

```
DATABASE_URL        # Supabase transaction pooler (port 6543, runtime)
DIRECT_URL          # Supabase session pooler (port 5432, schema ops)
AUTH_SECRET         # NextAuth secret
AUTH_URL / NEXTAUTH_URL
UPLOAD_DIR          # Local video upload path (./public/uploads/videos in dev)
ANTHROPIC_API_KEY   # Used by /api/bmc/generate for AI name/tagline generation
```

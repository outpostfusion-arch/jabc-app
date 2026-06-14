# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server at http://localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm db:push      # run Prisma migrations (prisma migrate dev)
pnpm db:generate  # regenerate Prisma client after schema changes
pnpm seed         # seed the database (prisma/seed.ts)
```

No test suite is configured.

## Architecture Overview

This is a **Next.js 16 App Router** application for the Junior Achievement Business Challenge (JABC) — a classroom platform where teachers manage a class and students work through 6 sessions building a business plan.

### Auth & Roles

- **NextAuth 5 beta** with a Credentials provider. Username/password, bcrypt hashed.
- Two roles: `TEACHER` and `STUDENT` (Prisma `Role` enum).
- Session JWT carries `id`, `role`. Accessed server-side via `auth()` from `@/lib/auth`.
- Middleware (`src/proxy.ts`) redirects based on role and a `jabc-view-mode=student` cookie that lets teachers preview the student interface.

### Route Groups

| Group | Path prefix | Who sees it |
|---|---|---|
| `(teacher)` | `/teacher/...` | Teachers only |
| `(student)` | `/dashboard`, `/session/[id]/...`, `/progress` | Students (+ teachers with cookie) |

Teachers are redirected to `/teacher/dashboard` on login. Students go to `/dashboard`.

### Student Sessions (6 total)

Each session lives at `/session/[id]/<slug>`. The `id` is the `ClassSession.id` integer from the DB.

| id | slug | Feature |
|----|------|---------|
| 1 | `bmc` | Business Model Canvas |
| 2 | `target-market` | Target Market & Promotions quiz |
| 3 | `team-workspace` | Team chat + Marketing doc |
| 4 | `tutorials` | Teacher-uploaded videos + reflection prompts |
| 5 | `financials` | Income/expense tracker + pricing calculator |
| 6 | `brand` | Logo builder (Fabric.js canvas) + brand profile |

Sessions can be locked/unlocked by teachers. Progress is tracked per-student per-session (`NOT_STARTED` / `IN_PROGRESS` / `COMPLETED`).

### Database

Prisma 7 with PostgreSQL (Supabase). Generated client outputs to `src/generated/prisma`. Connection uses two URLs: `DATABASE_URL` (pooled, runtime) and `DIRECT_URL` (direct, migrations).

Key models: `User`, `ClassSession`, `SessionProgress`, `BusinessModelCanvas`, `TargetMarketProfile`, `Team`, `TeamMember`, `TeamMessage`, `Video`, `VideoPrompt`, `VideoReflection`, `FinancialRecord`, `PricingCalculation`, `Logo`, `BrandProfile`, `Badge`, `UserBadge`.

### Key Shared Components

- `src/components/shared/AvatarImage.tsx` — 23 SVG cartoon animal avatars. The `avatarEmoji` DB field stores the avatar ID string (e.g. `"fox"`), not an emoji.
- `src/components/shared/ViewModeToggle.tsx` — Fixed top-right pill that lets teachers switch between teacher/student view via the `jabc-view-mode` cookie.
- `src/components/shared/StudentNav.tsx` — Top nav bar for the student layout.
- `src/components/shared/TeacherSidebar.tsx` — Fixed left sidebar for the teacher layout.

### BMC Canvas

`src/components/bmc/BMCCanvas.tsx` holds all canvas state, the `BLOCK_CONFIG` array (9 blocks with demo data, colors, gradients, shadows), and the name/tagline generator pools. It accepts `teacherMode` prop which surfaces the ✏️ demo-fill button on each block.

`src/components/bmc/BMCBlock.tsx` is the individual 3D-flip card. Front face = editable block; back face = lemonade stand example. Uses CSS grid stacking (`gridArea: "1/1"`) for both faces so the container height accommodates whichever face is taller.

### Styling

Tailwind 4 + inline `style` props for dynamic values (colors, gradients, shadows). No CSS modules. Component-level inline styles are the norm here — do not refactor to Tailwind classes when the value is dynamic.

### API Routes

All under `src/app/api/`. Each session feature has its own route file. The BMC auto-saves via `PUT /api/bmc` with a 600 ms debounce. Badge awarding happens server-side in the BMC route response.

### Known Pre-existing TypeScript Errors

Dynamic route handlers (e.g. `src/app/api/sessions/[id]/route.ts`) use the old synchronous `params` pattern. Next.js 16 expects `params: Promise<{id: string}>`. These errors exist in `.next/dev/types/validator.ts` and are not introduced by new work — do not try to fix them unless the task is specifically about those routes.

### Environment Variables

```
DATABASE_URL      # Supabase pooled (runtime)
DIRECT_URL        # Supabase direct (migrations)
AUTH_SECRET       # NextAuth secret
AUTH_URL / NEXTAUTH_URL
UPLOAD_DIR        # Local video upload path (./public/uploads/videos in dev)
ANTHROPIC_API_KEY # Used by /api/bmc/generate for AI name/tagline generation
```

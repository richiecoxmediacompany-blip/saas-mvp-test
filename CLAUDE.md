# CLAUDE.md - AI Assistant Guide for TaskFlow

## Project Overview

TaskFlow is a task and project management SaaS MVP. Users can sign up, create projects, and manage tasks with statuses, priorities, and due dates.

- **Repository**: saas-mvp-test
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: SQLite via Prisma ORM (v6)
- **Auth**: Auth.js v5 (NextAuth beta) with credentials provider
- **Styling**: Tailwind CSS v4
- **Default branch**: master

## Repository Structure

```
saas-mvp-test/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Project, Task)
│   └── migrations/            # SQL migration files
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page (redirects if authed)
│   │   ├── globals.css        # Global styles + CSS variables
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     # Login page
│   │   │   └── register/page.tsx  # Registration page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx         # Dashboard shell (sidebar + auth guard)
│   │   │   ├── page.tsx           # Redirects to /projects
│   │   │   └── projects/
│   │   │       ├── page.tsx           # Project list + create form
│   │   │       └── [projectId]/
│   │   │           └── page.tsx       # Project detail with task management
│   │   └── api/auth/[...nextauth]/
│   │       └── route.ts       # Auth.js API route handler
│   ├── components/
│   │   ├── task-item.tsx      # Task card with inline editing
│   │   └── task-filters.tsx   # Status/priority filter dropdowns
│   └── lib/
│       ├── auth.ts            # Auth.js configuration
│       ├── db.ts              # Prisma client singleton
│       ├── actions.ts         # Server actions (CRUD for projects/tasks, auth)
│       └── utils.ts           # cn() helper and formatDate()
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── .env                       # Local env vars (gitignored)
```

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npx prisma migrate dev   # Run database migrations
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma studio        # Open database GUI
```

## Database Schema

Three models defined in `prisma/schema.prisma`:

- **User** — id, name, email (unique), hashedPassword, timestamps
- **Project** — id, name, description, userId (FK), timestamps
- **Task** — id, title, description, status, priority, dueDate, projectId (FK), timestamps

Task statuses: `todo`, `in-progress`, `done`
Task priorities: `low`, `medium`, `high`

All relationships use cascade delete (deleting a user removes their projects; deleting a project removes its tasks).

## Architecture Patterns

- **Server Components** are the default. All data-fetching pages (project list, project detail, dashboard layout) are server components that query Prisma directly.
- **Client Components** (`"use client"`) are used only for interactive UI: login/register forms, task editing, task filtering.
- **Server Actions** (`"use server"` in `src/lib/actions.ts`) handle all mutations (create/update/delete) and call `revalidatePath()` to refresh data.
- **Route Groups**: `(auth)` for login/register (no sidebar), `(dashboard)` for authenticated pages (with sidebar + auth guard).
- **Auth guard**: The dashboard layout checks `auth()` and redirects to `/login` if unauthenticated.

## Code Conventions

- **File naming**: kebab-case for component files (`task-item.tsx`, `task-filters.tsx`)
- **Imports**: Use `@/` path alias (maps to `./src/`)
- **Styling**: Tailwind utility classes directly on elements. CSS variables defined in `globals.css` for theming (`--background`, `--foreground`, `--primary`, etc.)
- **cn() utility**: Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally
- **Server actions**: All mutations go through `src/lib/actions.ts`. Each action verifies user ownership before modifying data.
- **No API routes** needed for CRUD — server actions replace them. The only API route is for Auth.js.

## Environment Variables

```
DATABASE_URL="file:./dev.db"   # SQLite database path (relative to prisma/)
AUTH_SECRET="..."              # Auth.js signing secret (required)
```

## Key Guidelines for AI Assistants

1. **Keep it simple** — this is an MVP. Avoid over-engineering. No unnecessary abstractions.
2. **Server-first** — default to server components and server actions. Only use `"use client"` when interactivity requires it.
3. **Auth ownership checks** — every server action must call `getUserId()` and verify the user owns the resource before modifying it.
4. **Update this file** — when adding new features, models, or patterns, update CLAUDE.md to reflect the changes.
5. **Prisma workflow** — after editing `schema.prisma`, run `npx prisma migrate dev --name <description>` then `npx prisma generate`.
6. **No secrets in code** — use `.env` for secrets. The `.env` file is gitignored.
7. **Build check** — run `npm run build` to verify changes compile before committing.

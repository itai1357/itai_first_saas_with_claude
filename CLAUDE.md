# CLAUDE.md

## Project Overview

SaaS starter monorepo with a Next.js frontend and Express backend, connected by shared
TypeScript packages. Early-stage — currently has test endpoints and an API tester UI.

## Tech Stack

- **Runtime**: Node.js >= 22 (see `.nvmrc`)
- **Package manager**: pnpm 9.15 with workspaces
- **Frontend**: Next.js 15 + React 19 (App Router, `apps/frontend/`)
- **Backend**: Express 4 + tsx for dev (`apps/backend/`)
- **Language**: TypeScript 5.7 throughout
- **Shared packages**: `@myorg/logger`, `@myorg/config-manager`, `@myorg/api-utils`

## Project Structure

```
apps/
  frontend/       — Next.js app (port 3000), proxies /api/* to backend
  backend/        — Express server (port 3001)
packages/
  logger/         — Request-scoped structured JSON logger (AsyncLocalStorage)
  config-manager/ — Provider-based config with per-request context
  api-utils/      — AppError class + withErrorHandler() HOF for routes
```

## Key Commands

```bash
# Install dependencies
pnpm install

# Build shared packages (required before running apps)
pnpm --filter @myorg/logger build
pnpm --filter @myorg/config-manager build
pnpm --filter @myorg/api-utils build

# Run apps in dev mode
pnpm --filter frontend dev        # http://localhost:3000
pnpm --filter backend dev         # http://localhost:3001

# Build apps for production
pnpm --filter frontend build
pnpm --filter backend build
```

## Environment Variables

| Variable      | Used by  | Default                 | Purpose             |
|---------------|----------|-------------------------|---------------------|
| `PORT`        | backend  | `3001`                  | Backend listen port |
| `BACKEND_URL` | frontend | `http://localhost:3001`  | Backend proxy target|

## Key Entry Points

- Backend server: `apps/backend/src/index.ts`
- Frontend page: `apps/frontend/src/app/page.tsx`
- Next.js config (API proxy): `apps/frontend/next.config.js`
- Logger API: `packages/logger/src/index.ts`
- Config manager API: `packages/config-manager/src/index.ts`
- Error handling: `packages/api-utils/src/index.ts`

## Adding a New Backend Route

1. Define handler in `apps/backend/src/index.ts` (or a new route file)
2. Wrap with `withErrorHandler()` from `@myorg/api-utils`
3. Use `getLogger()` for logging — context is already initialized by middleware
4. Throw `AppError(statusCode, errorCode, message)` for expected errors

## Adding a New Shared Package

1. Create `packages/<name>/` with `package.json` (name: `@myorg/<name>`)
2. Add `"main": "dist/index.js"` and `"types": "dist/index.d.ts"`
3. Export from a barrel `src/index.ts`
4. Reference from apps with `"@myorg/<name>": "workspace:*"`

## Git Workflow

When working on a new feature, addition, or bug fix, always create a new branch under a
git worktree. Do not commit directly to `main`. Use `isolation: "worktree"` for agent-based
work, or create a worktree manually for the task.

## Additional Documentation

Check these files for deeper context on specific topics:

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — AsyncLocalStorage
  context pattern, provider pattern, error handling conventions, monorepo package
  structure, and frontend API proxy setup

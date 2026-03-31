# Architectural Patterns

## AsyncLocalStorage for Request-Scoped Context

Both the logger and config-manager packages use Node.js `AsyncLocalStorage` to provide
request-scoped instances without explicit parameter passing.

- **Logger**: `initRequestContext(requestId)` stores a `RequestContext` per request, then
  `getLogger()` retrieves it anywhere in the call chain (`packages/logger/src/index.ts:9-15`).
- **Config**: `initConfigContext(provider)` stores a `ConfigManager` per request, then
  `getConfig()` retrieves it (`packages/config-manager/src/index.ts:7-16`).
- **Initialization point**: Both contexts are initialized in the Express middleware
  (`apps/backend/src/index.ts:12-17`).

When adding new request-scoped services, follow this same pattern: create an
`AsyncLocalStorage` instance, expose an `init*Context()` + `get*()` pair, and call
the init function in the middleware.

## Provider Pattern for Configuration

Configuration access is abstracted behind the `IConfigProvider` interface
(`packages/config-manager/src/types.ts:1-3`). The only implementation today is
`EnvConfigProvider` (`packages/config-manager/src/providers/env.provider.ts`), but the
interface allows swapping in other sources (remote config, files, etc.) without changing
consumers.

`ConfigManager` wraps a provider and adds convenience methods like `getOrThrow()`
(`packages/config-manager/src/config-manager.ts:14-20`).

## Structured Error Handling

The backend uses a two-tier error model via `@myorg/api-utils`:

1. **`AppError`** — domain errors with `statusCode` and `errorCode`
   (`packages/api-utils/src/index.ts:4-14`).
2. **`withErrorHandler()`** — HOF that wraps async route handlers with try/catch,
   logs the error, and returns a consistent JSON response shape
   (`packages/api-utils/src/index.ts:18-44`).

All route handlers should be wrapped with `withErrorHandler()`. Throw `AppError` for
expected failures (validation, auth); let unexpected errors propagate as generic 500s.

## Monorepo Workspace Package Convention

Shared packages live under `packages/` with the `@myorg/` scope. Each package:

- Publishes via `main: "dist/index.js"` + `types: "dist/index.d.ts"`
- Is referenced by apps using `"workspace:*"` in dependencies
- Has a single barrel export from `src/index.ts`

Dependency chain: `api-utils` depends on `logger`; `backend` depends on all three;
`frontend` depends on `config-manager`.

## Frontend API Proxy

The Next.js frontend proxies `/api/*` requests to the backend via `rewrites()` in
`apps/frontend/next.config.js:9-14`. The backend URL defaults to `http://localhost:3001`
and is configurable via `BACKEND_URL` env var. Frontend components call `/api/...`
paths directly without knowing the backend host.

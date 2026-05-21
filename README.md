# fs-ui

Web UI for [fileserver](../fileserver).

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- Zustand (state), TanStack Query (server cache)
- Vitest + @testing-library/react for unit tests
- Husky + lint-staged for pre-commit hygiene

## Features

- RSA-OAEP encrypted login envelope (uses `crypto.subtle`, no client-side
  password hashing dependency)
- Token kept **in memory only** — never persisted to localStorage. A boot-time
  `/auth/refresh` call restores the session using the HttpOnly cookie.
- Role-aware UI: the upload control is hidden for non-admin users
- Browse, download, and upload files; directories download as ZIP archives
  (server-side feature)

## Setup

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

`fs-ui` reads the API base URL from `VITE_API_URL`:

```
# .env.development
VITE_API_URL=http://localhost:8880
```

Leave it empty in production builds — the UI then issues same-origin requests
and your reverse proxy/Ingress can route `/auth/*` and `/files/*` to the BE.

## Scripts

| Command              | Purpose                 |
| -------------------- | ----------------------- |
| `pnpm dev`           | Vite dev server         |
| `pnpm build`         | `tsc -b && vite build`  |
| `pnpm typecheck`     | `tsc -b --noEmit`       |
| `pnpm test`          | Run vitest suite once   |
| `pnpm test:watch`    | Vitest watch mode       |
| `pnpm test:coverage` | Vitest with v8 coverage |
| `pnpm lint`          | ESLint                  |
| `pnpm format`        | Prettier                |

## Architecture notes

- **Auth flow**: `AuthHydrator` (mounted under `BrowserRouter`) calls
  `/auth/refresh` once at app boot. While in flight, a spinner replaces the
  router so `ProtectedRoute` doesn't bounce a returning user to `/login` in
  the flicker between mount and refresh resolution.
- **API client** (`src/api/client.ts`): `credentials: 'include'` everywhere
  so the cookie travels with refresh. On `401`, the client deduplicates
  concurrent refresh attempts (`tryRefresh`) and retries the original
  request once before forcing a logout.
- **Store subscriptions** use selectors — `useAuthStore((s) => s.field)` —
  so unrelated state changes do not re-render every subscriber
  (react-best-practices `rerender-defer-reads`).
- **Memoization**: `FileBrowserPage` memoizes derived values (`currentPath`,
  `segments`) and stabilises callbacks (`useCallback`) so memoized children
  (`FileTable` / `FileRow`) re-render only when their data actually changes.

## Tests

The current suite covers:

- `utils/format.test.ts` — formatSize / formatRelativeTime / formatAbsoluteTime
- `components/layout/Breadcrumb.test.tsx` — prefix accumulation, last-segment
  rendered as text not link
- `components/layout/ProtectedRoute.test.tsx` — redirect when unauthenticated,
  render children when authenticated (with zustand store reset between tests)
- `components/modules/FileTable.test.tsx` — `canUpload` boolean gates the
  upload button (admin vs guest)

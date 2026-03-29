# fs-ui

Web UI for [fileserver](https://github.com/TrulyNotMalware/fileserver).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand, TanStack Query
- Husky + lint-staged

## Features

- RSA-OAEP encrypted login with auto token refresh
- Browse, download, and upload files
- Archive zip download for directories

## Setup

```bash
pnpm install
pnpm dev
```

Configure the API URL in `.env.development`:

```
VITE_API_URL=
```

By default, the Vite dev server proxies `/auth` and `/files` to `http://localhost:8880`.

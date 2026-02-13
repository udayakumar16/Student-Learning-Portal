# AI-Powered Student Learning & Assessment Platform

Monorepo with:
- `backend/`: Node.js + Express REST API (TypeScript) + MongoDB (Mongoose) + JWT auth
- `frontend/`: Next.js (App Router) + React + TypeScript + Tailwind UI

## Prereqs
- Node.js 18+ (recommended: Node 20 LTS)
- This repo expects Node `>=18.17 <23`. Using Node 23/24+ may cause intermittent Next dev issues on Windows.
- A MongoDB Atlas connection string

If you're on Windows and don't have `nvm`, you can install Node 20.11.1 via `winget`:

```bash
winget install OpenJS.NodeJS.LTS --version 20.11.1
```

## Setup

### 1) Backend env
Copy `backend/.env.example` to `backend/.env` and fill values.

### 2) Frontend env
Copy `frontend/.env.example` to `frontend/.env.local` and fill values.

### 3) Install deps
From repo root:

```bash
npm install
```

### 4) Seed questions

```bash
npm run seed
```

### 5) Run

Run both apps:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

If Next.js ever throws missing chunk/module errors (e.g. `Cannot find module './127.js'` or `Cannot find module for page: /dashboard/help/page`), use the clean start:

```bash
npm run dev:frontend:clean
```

If it still comes back, try Turbopack dev mode (often more stable on Windows):

```bash
npm run dev:frontend:turbo:clean
```

If Turbopack throws a React Server Components bindings error like:
`Expected to use Webpack bindings ... but ... Turbopack bindings ...`,
use Webpack dev (`npm run dev:frontend:clean`) and/or switch to Node 20.11.1.

If you’re running both apps with `npm run dev` and hit the same error, use:

```bash
npm run dev:clean
```

For a clean production build of the frontend:

```bash
npm run build:frontend:clean
```

Backend runs on `http://localhost:5000`.
Frontend runs on `http://localhost:3000`.

## Troubleshooting

### Page renders with no styling (plain HTML)
If the UI looks like raw HTML (default fonts, underlined links, no Tailwind styles), it means the Next static assets (CSS/JS under `/_next/*`) are not being applied.

- Make sure you're opening the app via the Next server: `http://localhost:3000/` (not by opening any `.html` file from disk).
- Restart frontend with a clean cache: `npm run dev:frontend:clean`.
- If you're on Node 23/24+, switch to Node 20 LTS (Node >=23 is known to cause flaky Next dev assets on Windows in this repo).
- In browser devtools → Network, confirm requests to `/_next/static/*` return `200` (not `404` or `text/html`).

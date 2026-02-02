# AI-Powered Student Learning & Assessment Platform

Monorepo with:
- `backend/`: Node.js + Express REST API (TypeScript) + MongoDB (Mongoose) + JWT auth
- `frontend/`: Next.js (App Router) + React + TypeScript + Tailwind UI

## Prereqs
- Node.js 18+ (recommended: Node 20 LTS)
- This repo expects Node `>=18.17 <23`. Using Node 23/24+ may cause intermittent Next dev issues on Windows.
- A MongoDB Atlas connection string

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

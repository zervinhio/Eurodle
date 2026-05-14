# Eurodle 🏀

A daily Euroleague player guessing game — Wordle-style.

## How to play

Each day a secret active Euroleague player is chosen. You have **8 attempts** to guess who it is. After each guess you get color-coded feedback:

| Color  | Meaning |
|--------|---------|
| 🟢 Green  | Exact match |
| 🟡 Yellow | Close (position family / height ±3 cm) |
| 🔴 Red    | No match |

**Categories compared:**
- **Team** — green if same team, red otherwise
- **Position** — green = exact; yellow = same family (PG↔SG or SF↔PF); red = far apart
- **Nationality** — green or red only
- **Height** — green = exact; yellow = ±3 cm (with ↑↓ arrow); red = bigger gap

---

## Tech stack

- **Next.js 14** (App Router) + TypeScript
- **MongoDB** via Mongoose
- **Euroleague official API** (`live.euroleague.net/api`) for player data

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local and set your MONGODB_URI
```

### 3. Seed the database

This fetches all active 2024-25 Euroleague players from the official API
and stores them in MongoDB.

```bash
npm run seed
```

You should see output like:
```
✅ Connected to MongoDB
📋 18 teams: ASM, BAR, BKN, ...
  ASM: 14 players fetched
  BAR: 15 players fetched
  ...
🏀 Done — 247 players upserted.
```

### 4. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy

```bash
npm run build
npm start
```

Works on **Vercel** out of the box — just add the `MONGODB_URI` env var in the project settings.

---

## Re-seeding

Run `npm run seed` again at any time to refresh the player roster (e.g. start of new season, mid-season transfers). The script upserts, so existing records are updated rather than duplicated.

For the **2025-26 season**, change `SEASON = "E2025"` in `scripts/seedPlayers.js`.

---

## Project structure

```
eurodle/
├── scripts/
│   └── seedPlayers.js       ← fetches & seeds players from Euroleague API
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/route.ts   ← GET /api/search?q=...
│   │   │   ├── guess/route.ts    ← POST /api/guess
│   │   │   └── daily/route.ts    ← GET /api/daily (today's date key)
│   │   ├── game/page.tsx         ← main game UI
│   │   ├── layout.tsx
│   │   └── page.tsx              ← redirects → /game
│   └── lib/
│       ├── mongodb.ts            ← DB connection
│       ├── models/Player.ts      ← Mongoose schema
│       ├── gameLogic.ts          ← comparison engine
│       └── dailyPlayer.ts        ← deterministic daily pick
├── .env.local.example
├── next.config.js
├── package.json
└── tsconfig.json
```

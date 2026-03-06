# Tic Tac Toe — Social Edition

A social-media-oriented Tic Tac Toe game built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- 🎮 Two-player Tic Tac Toe on the same device
- 👤 Player registration and persistent profiles
- 📊 Game history with move replay miniboard
- 🏆 Leaderboard ranked by wins and win percentage
- 🔗 Share game results (copy to clipboard / native share)
- 📱 Responsive, modern dark UI

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production (Docker)

```bash
docker-compose up --build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./database.sqlite` | Path to SQLite database file |
| `NEXT_PUBLIC_APP_NAME` | `Tic Tac Toe` | App display name |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Public URL for share links |

## Architecture

- **Next.js App Router** — pages and API routes
- **TypeORM + SQLite** — persistent storage, lazy-initialized
- **Client-side game logic** — win detection in `gameLogic.ts`
- **Server API** — results saved via `/api/games` POST

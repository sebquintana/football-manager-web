# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Build for production
npm run lint     # Run ESLint
```

There are no tests in this project.

## Architecture

This is a **Next.js 15 App Router** frontend for a football (soccer) manager application. It connects to a separate backend API at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3000`).

### Path Alias

`@/*` resolves to `./app/*`. shadcn/ui components live at `app/components/ui/`.

### Layout

`app/layout.tsx` wraps all pages with a persistent collapsible sidebar (`AppSidebar`) inside a `SidebarProvider`. The app is forced into dark mode (`<html className="dark">`). All pages follow this structure:
- A sticky header with `SidebarTrigger`, breadcrumb navigation, and a bell icon
- A main area with `bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900`
- Page content wrapped in `<div className="flex flex-col h-full -m-4">`

### Pages and API Endpoints

| Route | Description | API calls |
|-------|-------------|-----------|
| `/` | Dashboard / season welcome | — |
| `/ranking` | Player ELO leaderboard | `GET /players/ranking` |
| `/players` | Player list → links to `/players/[name]` | `GET /players` |
| `/teams` | Generate balanced teams | `GET /players`, `POST /teams/balanced` |
| `/matches` | Match history (expandable cards) | `GET /matches/summary` |
| `/match` | Submit a match result | `GET /players`, `POST /match` |
| `/statistics` | General stats (collapsible sections) | `GET /statistics/general` |

### UI Components

Uses **shadcn/ui** ("new-york" style, slate base color) with **lucide-react** icons and **Tailwind CSS**. Add new shadcn components with `npx shadcn@latest add <component>`.

### Key Data Shapes

**Match submission** (`POST /match`): `{ teamANames: string[], teamBNames: string[], winner: 'A'|'B'|'draw', goalDifference: number, date?: string }`

**Balanced teams response** (`POST /teams/balanced`): array of `{ teamA: string[], teamB: string[], eloA, eloB, difference, balanceScore, teamAMetrics, teamBMetrics, synergyWarnings[] }`

**Match summary** (`GET /matches/summary`): `{ id, date, winner: 'A'|'B', goalDifference, teamAPlayers: string[], teamBPlayers: string[] }`

### Notes

- `app/statistics/page_new.tsx` is an unused draft file (not a valid Next.js route name).
- The statistics page hardcodes `http://localhost:3000` instead of using `NEXT_PUBLIC_API_URL` — other pages use the env var correctly.
- Matches are 5v5; the match submission form enforces exactly 5 players per team.

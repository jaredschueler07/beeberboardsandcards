# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Beeber Boards & Cards — AI-powered platform for designing, balancing, and producing printable board and card games from natural language descriptions. Currently a **UI prototype** with mock data (no backend or AI integration yet).

## Commands

All commands run from the `app/` directory:

```bash
cd app
npm install          # install dependencies
npm run dev          # start Vite dev server (port 3000)
npm run build        # production build to dist/
npm run lint         # type checking only (tsc --noEmit)
npm run preview      # preview production build
npm run clean        # remove dist/
```

There is no test runner configured yet.

## Architecture

**6-stage pipeline**: Brief → Design → Balance → Art → Layout → Export. Each stage is a separate component in `app/src/stages/`.

**State**: Single `AppState` object in `App.tsx` via `useState`. No external state library — this is intentional for the prototype phase. State is passed via props, not context. All stage components receive `{ state: AppState; setState: Dispatch<SetStateAction<AppState>> }`.

**Types**: All data types live in `app/src/types.ts` — this is the single source of truth for `AppState`, `Stage`, `Card`, `CardType`, `BriefSettings`, `SimulationData`, etc.

**Shared UI**: All reusable components (`Button`, `Card`, `Badge`, `AISuggestion`, `StatInput`) are in `app/src/components/UI.tsx` using `forwardRef`. The `cn()` utility (clsx + tailwind-merge) is also exported from here — always use it for conditional class merging.

## Tech Stack

- React 19, TypeScript 5.8, Vite 6
- **Tailwind CSS v4** — theme is configured via `@theme` directive in `app/src/index.css`, NOT a config file. Custom colors are CSS custom properties (`--color-bg`, `--color-surface`, `--color-accent`, `--color-ai`) usable as Tailwind classes (`bg-bg`, `text-accent`, etc.)
- Motion (Framer Motion v12+, import from `motion/react`)
- Recharts 3 (balance stage charts)
- Lucide React (icons)

## Key Conventions

- **Dark mode by default**; light mode via `.light-mode` class on `:root`. Theme persisted in `localStorage` key `beeber-theme`.
- AI-generated content uses the `ai` prop on Card or `ai-border` / `ai-shimmer` CSS classes (purple-to-pink gradient).
- Button variants: `primary`, `secondary`, `ghost`, `ai`. Sizes: `sm`, `md`, `lg`.
- When adding features, follow the pattern: one file per stage in `stages/`, keep `AppState` in `types.ts`.
- Placeholder images use `picsum.photos` — will be replaced with real AI generation later.
- Scaffolded but unused dependencies (`@google/genai`, `express`, `better-sqlite3`) exist from AI Studio — not active yet.

## Research Docs

The `research/` directory contains foundational product research. Reference when making product decisions:
- `prd.md` — Product Requirements Document
- `app-architecture.md` — 6-stage pipeline design, system architecture, MVP scope
- `user-personas.md` — 6 user personas with pain points and AI needs
- `competitive-landscape.md` — 10 competitor teardowns and gap analysis

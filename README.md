# Beeber Boards & Cards

AI-powered platform for designing, balancing, and producing printable board and card games. Describe your game idea in plain English and the platform generates concepts, card types, individual cards, runs balance simulations, and exports Print-and-Play PDFs.

## Features

- **Brief Stage** — Describe your game concept; AI generates structured game design suggestions
- **Design Stage** — AI generates card types and individual card instances with stats, effects, and costs
- **Balance Stage** — Run Monte Carlo simulations to validate game balance with visual dashboards
- **Art Stage** — Style guide and asset gallery (coming soon)
- **Layout Stage** — Template-based card layout editor (coming soon)
- **Export Stage** — Download Print-and-Play PDFs with crop marks and card layouts

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+

### Frontend
```bash
cd app
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
```

### Environment
Create `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...    # Optional — mock data used when absent
```

### Tests
```bash
cd backend
python -m pytest tests/ -v
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4 |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| AI | Anthropic Claude API (with mock fallback) |
| PDF | reportlab |
| Charts | Recharts 3 |
| Animation | Motion (Framer Motion v12+) |

## Architecture

Six-stage pipeline: **Brief → Design → Balance → Art → Layout → Export**

The frontend auto-creates a project on first load and auto-saves changes to the backend. AI services use Claude when an API key is configured, falling back to mock data for offline development.

See `.claude.md` for full project conventions and `research/prd.md` for the product requirements document.

# AI-First Board & Card Game Generator — App Architecture

> Draft v0.1 — March 2026

---

## 1. Product Vision

A single platform that takes a natural language game concept and guides the creator through a structured pipeline — from ideation to production-ready, printable assets — using AI at every stage. The app orchestrates multiple AI capabilities (text generation, image generation, simulation, layout) into one coherent workflow, eliminating the 4–6 tool fragmentation that plagues current board game designers.

**Core principle**: AI as creative partner, not replacement. The human makes every meaningful decision; the AI handles the tedious, expensive, and technically complex work (balancing, asset generation, layout, file preparation).

---

## 2. Pipeline Architecture

The app is structured as a **6-stage pipeline**, where each stage produces artifacts that feed the next. Users can enter at any stage (e.g., bring their own rules and skip ideation) and iterate freely between stages.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. BRIEF   │───▶│  2. DESIGN  │───▶│  3. BALANCE  │
│  & IDEATION │    │  & RULES    │    │  & SIMULATE  │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
┌─────────────┐    ┌─────────────┐    ┌──────▼──────┐
│  6. EXPORT  │◀───│  5. LAYOUT  │◀───│  4. ART &   │
│  & PUBLISH  │    │  & UX       │    │  ASSETS     │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Stage 1: Brief & Ideation

**Input**: Natural language prompt (e.g., "A cooperative survival card game for 2–4 players set in a flooded 1920s London, 45 minutes, medium complexity")

**AI does**:
- Parses theme, player count, play time, complexity, game type (board vs. card vs. hybrid)
- Analyzes market data to identify trending mechanics in the target genre
- Suggests 3–5 mechanic combinations ranked by novelty and market fit (e.g., "trick-taking + area control" or "deck building + cooperative survival")
- Generates a "concept score" based on market saturation, audience fit, and mechanical synergy
- Provides comparable titles for reference ("Similar to Pandemic meets Arcs")

**User does**:
- Selects or modifies the mechanic combination
- Refines theme, setting, and tone
- Sets constraints (component budget, target MSRP, sustainability preferences)

**Output**: Validated game concept brief (JSON schema)

---

### Stage 2: Design & Rules

**Input**: Game concept brief from Stage 1

**AI does**:
- Generates a complete rule framework:
  - Win/loss conditions
  - Turn structure and action economy
  - Card types and their roles (if card game)
  - Resource systems (if applicable)
  - Player interaction model (cooperative, competitive, semi-cooperative)
  - Component list (cards, tokens, boards, dice, etc.)
- Creates card type definitions with stat ranges, costs, and effect templates
- Generates a draft rulebook in structured markdown
- Produces a component manifest (exact counts, sizes, materials)

**User does**:
- Reviews and edits rules in a structured editor (not freeform text — guided fields)
- Adds/removes card types, tweaks costs, adjusts component counts
- Flags areas for AI to elaborate or simplify

**Output**: Complete rule set + component manifest (structured data)

---

### Stage 3: Balance & Simulation

**Input**: Rule set and component definitions from Stage 2

**AI does**:
- Converts rules into a simulatable game model
- Runs Monte Carlo Tree Search (MCTS) agents through thousands of games
- Produces balance reports:
  - Win rate distribution across player positions (first-player advantage?)
  - Average game length vs. target
  - Card/mechanic usage rates (identify dead cards or overpowered combos)
  - Decision density per turn (flag "auto-play" situations)
  - Comeback frequency (are games decided too early?)
- Suggests specific parameter adjustments (e.g., "reduce Card X cost from 4 to 3", "add 2 more resource tokens")
- For cooperative games: win rate tuning across difficulty levels
- For solo games: generates Automa behavior trees

**User does**:
- Reviews balance dashboard with visualizations
- Accepts/rejects suggested adjustments
- Re-runs simulations after changes
- Sets target metrics (e.g., "I want 45–55% win rate for co-op on Normal difficulty")

**Output**: Balanced rule set with simulation validation report

---

### Stage 4: Art & Assets

**Input**: Component manifest, theme, and tone from previous stages

**AI does**:
- Generates a **style guide** (3 options: e.g., "Gothic Badge", "Bold Minimalist", "Phantasmagoria") based on theme
- Creates a **master style model** to ensure visual consistency across all assets
- Generates art for:
  - Card illustrations (front and back)
  - Board layout / map art
  - Iconography set (resource icons, action icons, status markers)
  - Box art concept
  - Token/meeple designs
  - Rulebook illustrations
- All assets maintain consistent style, color palette, and visual language

**User does**:
- Selects style direction from options
- Provides reference images if desired
- Regenerates individual assets they don't like
- Uploads custom art to replace any AI-generated piece
- Adjusts color palette, icon style, typography preferences

**Output**: Complete asset library (PNG/SVG at print resolution, 300+ DPI)

---

### Stage 5: Layout & UX

**Input**: Assets + component manifest + rules

**AI does**:
- Auto-generates card layouts following UX best practices:
  - Critical info (cost, type) in upper-left for fanned-hand readability
  - High contrast between text and background
  - Consistent spacing grid across all card types
  - Color-blind-friendly palette with redundant shape coding
  - Multilingual text support (auto-resize text blocks)
- Creates board layout with clear zone delineation
- Generates rulebook with structured information architecture:
  - Quick-start guide (1 page)
  - Full rules with visual examples
  - Reference cards / player aids
- Creates box dieline templates (standard sizes to reduce manufacturing cost)
- Generates print-and-play PDF with crop marks, bleed, and fold lines

**User does**:
- Previews cards in a virtual "hand fan" view
- Adjusts layout templates (drag-and-drop card element positioning)
- Reviews rulebook flow and edits text
- Selects box size from standard options or requests custom

**Output**: Print-ready layout files (PDF, AI, InDesign-compatible)

---

### Stage 6: Export & Publish

**Input**: All finalized files from previous stages

**The app provides**:
- **Print-and-Play PDF** — Optimized for home printing (A4/Letter, with cutting guides)
- **Tabletop Simulator Export** — Auto-generate a TTS mod for digital playtesting
- **Print-on-Demand Integration**:
  - The Game Crafter API — Upload and order physical copies directly
  - DriveThruCards — For card-only games
  - Component cost calculator with real-time pricing
- **Crowdfunding Kit**:
  - 3D box mockup renders
  - Campaign hero image
  - Component spread photos (virtual)
  - Sell sheet PDF for publisher pitches
- **Manufacturing Specs**:
  - Component files organized by manufacturer requirements
  - Dielines, bleeds, safe zones all pre-configured
  - BOM (bill of materials) with weight estimates for shipping calculations

---

## 3. System Architecture

### High-Level Components

```
┌──────────────────────────────────────────────────┐
│                   FRONTEND                        │
│  React/Next.js Web App + Optional Desktop Client │
│  (Canvas editor, card preview, dashboard)         │
└────────────────────┬─────────────────────────────┘
                     │ REST/WebSocket
┌────────────────────▼─────────────────────────────┐
│                 API GATEWAY                        │
│  Authentication, rate limiting, job queuing        │
└────────────────────┬─────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌──────────────┐ ┌────────┐ ┌──────────┐
│  GENERATION  │ │ BALANCE│ │  ASSET   │
│  SERVICE     │ │ ENGINE │ │ PIPELINE │
│  (LLM API)   │ │ (MCTS) │ │ (Image)  │
└──────────────┘ └────────┘ └──────────┘
         │           │           │
         ▼           ▼           ▼
┌──────────────────────────────────────────────────┐
│              DATA / STORAGE LAYER                 │
│  Project DB (Postgres) │ Asset Store (S3/R2)      │
│  Game Templates        │ Style Models             │
└──────────────────────────────────────────────────┘
```

### Core Services

| Service | Responsibility | Key Tech |
|---------|---------------|----------|
| **Generation Service** | Rule generation, concept ideation, rulebook writing, card text | LLM API (Claude/GPT-4) with structured output |
| **Balance Engine** | Game simulation, win-rate analysis, parameter optimization | Custom MCTS implementation, evolutionary algorithms |
| **Asset Pipeline** | Art generation, style consistency, icon generation | Image generation API (Scenario, DALL-E, Flux) with LoRA/style models |
| **Layout Engine** | Card templating, board layout, PDF generation | Headless Puppeteer/Cairo for PDF, custom card renderer |
| **Export Service** | TTS mod generation, POD API integration, file packaging | Game Crafter API, file conversion pipelines |
| **Project Manager** | User projects, version history, collaboration | Postgres, Redis for job queuing |

### Data Models (Core)

```
Project
├── concept_brief (JSON)
├── rule_set (structured JSON)
│   ├── win_conditions[]
│   ├── turn_structure
│   ├── card_types[]
│   │   ├── name, cost, stats, effects
│   │   └── card_instances[]
│   ├── resource_types[]
│   ├── board_zones[] (if applicable)
│   └── component_manifest
├── balance_report (JSON)
│   ├── simulation_results
│   ├── suggested_changes[]
│   └── validation_status
├── style_guide (JSON)
│   ├── palette, typography, art_direction
│   └── style_model_ref
├── assets/
│   ├── card_art/
│   ├── board_art/
│   ├── icons/
│   ├── box_art/
│   └── rulebook_illustrations/
├── layouts/
│   ├── card_templates/
│   ├── board_layout
│   ├── rulebook_pdf
│   └── box_dieline
└── exports/
    ├── print_and_play.pdf
    ├── tts_mod/
    ├── pod_files/
    └── crowdfunding_kit/
```

---

## 4. Key Technical Decisions

### LLM Strategy
- Use **structured output** (JSON schema enforcement) for rule generation — not freeform text. This ensures rules are machine-parseable for the balance engine.
- **Multi-model approach**: Use a large model (Claude Opus / GPT-4) for creative ideation and rule design; use a smaller, faster model for iteration and refinement; use specialized image models for art.
- **Prompt engineering over fine-tuning** initially. Build a library of game-design-specific system prompts grounded in the mechanical taxonomy from our research.

### Balance Engine
- Start with **simplified simulation**: model games as state machines with probabilistic transitions. Full MCTS is ideal but expensive to build from scratch.
- **MVP approach**: Use LLM to generate a simplified game model in Python, then run Monte Carlo simulations (random playouts, not full MCTS) to get baseline statistics.
- Evolve toward proper MCTS agents as the product matures.
- Consider integrating with the **TAG (Tabletop Games Framework)** Java library for standardized game simulation.

### Image Generation
- **Style consistency is the #1 challenge**. Individual AI-generated images are good; a coherent set across 50+ cards is hard.
- Approach: Generate a style reference sheet first, then use it as conditioning for all subsequent generations.
- Support **user-uploaded art** at any point — many designers will want to replace AI art with commissioned human art for final production.
- All assets generated at **300 DPI minimum** with proper bleed zones.

### Card Layout Engine
- Build a **template-based system** with configurable zones (art box, title bar, cost pip, text box, type line, etc.)
- Templates should be data-driven (JSON defines zone positions, font sizes, colors) so the LLM can generate new templates.
- Render to both **screen preview** (fast, low-res) and **print output** (PDF with crop marks, high-res).
- Follow card UI best practices from the research: upper-left cost placement, high contrast, consistent spacing.

---

## 5. MVP Scope

For an initial launch, focus on **card games only** (not full board games). This dramatically reduces scope:

### MVP Features (Card Game Generator)
1. **Concept brief intake** — Guided form + natural language input
2. **Mechanic recommendation** — Suggest 3 mechanic combos based on theme/player count
3. **Card type generation** — Generate card types with stats, costs, effects
4. **Individual card generation** — Generate specific cards with text and basic stat blocks
5. **Basic balance check** — Monte Carlo simulation of card usage rates and win conditions
6. **Art generation** — Style-consistent card illustrations (single style per project)
7. **Card layout** — Template-based layout with customizable zones
8. **Print-and-Play PDF export** — Ready to print at home
9. **The Game Crafter integration** — Order physical copies

### Post-MVP Expansion
- Full board game support (boards, tiles, tokens, miniature designs)
- Advanced balance engine (MCTS, evolutionary optimization)
- Collaborative editing (multiple designers on one project)
- Rulebook generator with structured information architecture
- Tabletop Simulator export
- Crowdfunding kit generator
- Marketplace for sharing/selling game templates
- Campaign/legacy game support with session-persistent state

---

## 6. Differentiators vs. Existing Tools

| Gap in Market | Our Solution |
|---------------|-------------|
| Tools are fragmented (4–6 apps per project) | Single end-to-end pipeline |
| No AI-native balance testing | Built-in simulation engine with balance dashboards |
| Art generation lacks style consistency | Master style model per project, consistent across all cards |
| No concept-to-printable pipeline | Direct export to print-and-play PDF and POD services |
| No intelligent mechanic recommendation | Market-data-informed mechanic suggestions based on theme and audience |
| "Gameslop" risk from pure AI generation | Human-in-the-loop at every stage; AI suggests, human decides |
| Existing tools require design expertise | Guided workflow with sensible defaults and UX best practices baked in |

---

## 7. Technology Stack (Recommended)

### Frontend
- **Next.js 15** (React) — SSR for marketing pages, SPA for the editor
- **Fabric.js or Konva.js** — Canvas-based card/board editor
- **TailwindCSS** — Rapid UI development
- **Zustand** — Lightweight state management for editor state

### Backend
- **Python (FastAPI)** — Primary API server (best ecosystem for AI/ML integrations)
- **Celery + Redis** — Job queue for long-running generation tasks
- **PostgreSQL** — Project data, user accounts, game templates
- **S3/Cloudflare R2** — Asset storage (images, PDFs, exports)

### AI/ML
- **Claude API** — Primary LLM for rule generation, ideation, rulebook writing
- **Flux / SDXL + LoRA** — Image generation with style consistency via trained adapters
- **Custom Python simulation** — Monte Carlo balance testing
- **WeasyPrint or Puppeteer** — PDF generation for print-ready output

### Infrastructure
- **Vercel** — Frontend hosting
- **Railway or Fly.io** — Backend services
- **Modal or Replicate** — GPU-accelerated image generation
- **Stripe** — Payment processing

---

## 8. Open Questions

1. **Should the balance engine run client-side or server-side?** Server is more powerful but adds latency and cost. Simple Monte Carlo could run in-browser via WASM.
2. **How do we handle the art style consistency problem at scale?** LoRA training per project is expensive. Alternatives: style transfer, IP-Adapter, reference image conditioning.
3. **What's the right abstraction level for game rules?** Too rigid = can't express novel mechanics. Too flexible = can't simulate or validate.
4. **Do we build our own image generation or integrate with Scenario/similar?** Build = more control, higher cost. Integrate = faster launch, dependency risk.
5. **What's the minimum viable balance engine?** Can we get useful results with random playouts, or do we need proper MCTS from day one?
6. **Physical vs. digital-first?** Do users want printable games or Tabletop Simulator mods first? This affects the entire output pipeline priority.

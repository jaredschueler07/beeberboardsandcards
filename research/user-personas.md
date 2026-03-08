# User Personas & Target Workflows

> Research compiled March 2026

---

## Overview

The AI board game generator app serves a spectrum of users from first-time hobbyists to experienced publishers. Each persona has distinct needs, pain points, and willingness to pay. The MVP should focus on Personas 1–2, expanding to 3–5 post-launch.

---

## Persona 1: The First-Time Creator (Primary MVP Target)

**Who they are**: Adults aged 22–45 who play board games regularly (own 5–25 games), have a game idea they've been thinking about, but have never designed or published a game. Often professionals in non-design fields (engineers, teachers, writers) with disposable income but limited time and no art/design skills.

**Demographics**: 57% of hobbyists own 1–25 games. This is the largest segment. Gen Z (22% of board game revenue) and Millennials dominate.

**Goals**:
- Turn their game idea into something real and playable
- Create a prototype they can play with friends/family
- Potentially sell or crowdfund if it's good
- Feel the satisfaction of creating something tangible

**Pain points**:
- Don't know where to start (rules writing, component design, balancing)
- Can't afford to hire an artist ($2,000–$20,000+ for a full game's illustrations)
- Overwhelmed by the number of fragmented tools required
- Don't understand print specifications (bleed, DPI, CMYK, dielines)
- Fear of making a "bad" game — want validation before investing heavily

**Current workflow**: Google → ChatGPT for brainstorming → Hand-drawn prototypes → Index cards → Playtest with friends → Get stuck at the "how do I make this look real" phase → Abandon

**What they need from our app**:
- Guided, step-by-step workflow (not a blank canvas)
- Mechanic suggestions based on their theme/player count
- AI-generated art that looks professional without requiring art direction skills
- Print-and-play PDF output they can test immediately
- Low barrier to entry (free tier or low-cost starter)

**Willingness to pay**: $10–20/month or $5–15 per game generation. Price-sensitive but willing to pay for something that actually works.

---

## Persona 2: The Indie Designer / Aspiring Publisher (Primary MVP Target)

**Who they are**: Hobbyist designers who have completed 1–5 game prototypes and are actively pursuing publication — either self-publishing via crowdfunding or pitching to publishers. Active in the BoardGameGeek forums, r/boardgamedesign, and local playtesting groups. May have run or backed Kickstarter/Gamefound campaigns.

**Demographics**: Predominantly male (though shifting), 25–50, typically technical or creative professionals. Many are solo operators; some work in 2–3 person teams.

**Goals**:
- Accelerate the prototype-to-production pipeline
- Reduce art costs (the #1 expense for indie publishers)
- Create professional-looking sell sheets for publisher pitches
- Balance their game mechanics rigorously before launch
- Generate Tabletop Simulator mods for remote playtesting

**Pain points**:
- Art is prohibitively expensive and the biggest bottleneck
- Balance testing is time-consuming and requires large playtester pools
- Jumping between 4–6 tools (Component Studio for layout, Scenario for art, Boardssey for PM, spreadsheets for data, InDesign for rulebooks)
- Print specification complexity (bleeds, safe zones, CMYK conversion, manufacturer requirements)
- Crowdfunding campaign asset creation (mockups, hero images, component spreads)

**Current workflow**: Idea → Spreadsheet for card data → nanDECK or Component Studio for layout → Commission artist or use AI art → Playtesting (physical + TTS) → Iterate → Sell sheet → Pitch or crowdfund

**What they need from our app**:
- Data-driven card generation (spreadsheet → cards)
- Style-consistent AI art across 50–100+ cards
- Built-in balance simulation to supplement human playtesting
- Direct export to The Game Crafter, TTS, and print-ready PDFs
- Crowdfunding asset kit (3D mockups, component spreads)
- Professional rulebook generation

**Willingness to pay**: $20–50/month or per-project pricing. Art generation alone saves them thousands — high perceived value.

---

## Persona 3: The Professional Publisher (Post-MVP)

**Who they are**: Small-to-mid-size publishers (1–20 employees) who release 2–10 games per year. Experienced with manufacturing, fulfillment, and distribution. Examples: Stonemaier Games, Chip Theory Games, Button Shy scale.

**Goals**:
- Accelerate pre-production (concept → prototype in days, not months)
- Rapidly test and iterate on concepts before committing to full production
- Reduce early-stage art costs (commission final art only for games that pass validation)
- Automate repetitive layout tasks across expansions and reprints

**Pain points**:
- Pre-production timeline is 6–18 months per title
- Early-stage prototyping is expensive if commissioning art too early
- Balancing complex games requires extensive playtesting
- Managing component specifications across multiple manufacturers

**What they need from our app**:
- API access for integration into existing workflows
- Batch generation (generate 200+ cards from a spreadsheet in minutes)
- Balance simulation at professional rigor
- Manufacturer-specific export presets (Panda GM, LongPack, Cartamundi)
- White-label option (no "made with [our app]" branding)
- Team collaboration features

**Willingness to pay**: $100–500/month for team plans. High value if it genuinely accelerates their pipeline.

---

## Persona 4: The Educator (Post-MVP)

**Who they are**: Teachers (K-12 and university), corporate trainers, and instructional designers who want to create custom educational or training games. Often have very specific content requirements but zero game design experience.

**Demographics**: Broad age range. Typically working within institutional budgets. May need to create games for specific curricula, team-building exercises, or training programs.

**Goals**:
- Create games that teach specific content (math, history, language, corporate processes)
- Quick turnaround (need it for next week's class)
- Printable on standard office printers
- Reusable templates they can customize per lesson

**Pain points**:
- No game design knowledge — don't know how to make learning fun
- Limited budget (often personal funds or small departmental budgets)
- Need games that work for specific group sizes and time constraints
- Can't spend weeks on design — it's a supplement to their primary job

**What they need from our app**:
- "Educational game" templates with proven mechanic patterns
- Content input (paste vocabulary list, quiz questions, etc.) → auto-generated game
- Printable on standard paper (no special printing required)
- Very low cost or institutional pricing

**Willingness to pay**: $5–15/month personal; $50–200/year institutional. Volume play.

---

## Persona 5: The Content Creator / Influencer (Post-MVP)

**Who they are**: YouTube/TikTok creators, streamers, and community builders who want to create custom games for their audience — either as merchandise, community engagement, or content.

**Goals**:
- Create branded games featuring their community/IP
- Generate content (the creation process itself is the content)
- Sell as merchandise through their existing channels

**What they need from our app**:
- Fast, visually impressive results (good for video content)
- Easy customization with their branding/characters
- POD integration for selling physical copies
- Shareable digital versions for community play

**Willingness to pay**: $20–50/month. Revenue-generating for them, so ROI is clear.

---

## Key Communities & Discovery Channels

| Community | Platform | Size | Relevance |
|-----------|----------|------|-----------|
| **r/boardgamedesign** | Reddit | ~60K members | Primary indie designer community |
| **r/tabletopgamedesign** | Reddit | ~80K members | Broader tabletop design discussion |
| **BoardGameGeek Design Forums** | BGG | Millions of users | The hub for serious hobbyists and designers |
| **Game Design Discord servers** | Discord | Various | Real-time discussion, playtesting coordination |
| **Tabletop Game Designers Guild** | Facebook | ~20K members | Active group for feedback and playtesting |
| **The Game Crafter community** | TGC forums | Active | Self-publishing focused |
| **Protospiel events** | In-person | Regional | Dedicated playtesting conventions |
| **Unpub Network** | Events + online | Growing | Designer community and events |

**Discovery patterns**:
- Gen Z: YouTube and TikTok (22% of board game revenue comes through social discovery)
- Millennials: Reddit, BGG, YouTube reviewers
- Professionals: Convention networking (Gen Con, Essen Spiel, PAX Unplugged)
- All segments: Word of mouth within playtesting groups

---

## Workflow Comparison: Current vs. Our App

### Current (Fragmented) Workflow

```
Idea
 ↓ (ChatGPT / pen & paper)
Rules Draft
 ↓ (Google Docs / Word)
Card Data
 ↓ (Google Sheets / Excel)
Card Layout
 ↓ (Component Studio / nanDECK / InDesign)
Art Assets
 ↓ (Hire artist / Midjourney / Scenario — separate tool)
Manual Assembly
 ↓ (Import art into layout tool, adjust each card)
Print Prototype
 ↓ (Export PDF, print, cut by hand)
Playtest
 ↓ (Physical or manually set up in TTS)
Iterate (go back to Rules Draft, repeat everything)
 ↓
Production Files
 ↓ (Reformat for manufacturer specs — another tool)
Publisher Pitch or Crowdfund
 ↓ (Create sell sheet in Canva, mockups in Photoshop — more tools)
```

**Tools used**: 6–8 different applications. Dozens of manual handoff points. Each iteration requires touching most of them again.

### Our App Workflow

```
Idea (natural language prompt)
 ↓
AI suggests mechanics + generates rules + component list
 ↓
AI generates card data + balance simulation
 ↓
AI generates style-consistent art for all cards
 ↓
Auto-layout with UX best practices
 ↓
Export: PnP PDF / TTS mod / Game Crafter order / Crowdfunding kit
 ↓
Iterate (change any parameter, affected outputs regenerate)
```

**Tools used**: 1. Every stage feeds the next. Iteration is non-destructive and fast.

---

## Pricing Strategy Considerations

| Tier | Target Persona | Price | Key Features |
|------|---------------|-------|-------------|
| **Free** | Persona 1 (trial) | $0 | 1 project, basic mechanics, watermarked PnP PDF |
| **Creator** | Persona 1–2 | $15–20/month | 3 projects, full art generation, PnP export, basic balance |
| **Pro** | Persona 2–3 | $40–50/month | Unlimited projects, advanced balance, TTS export, Game Crafter integration, crowdfunding kit |
| **Team** | Persona 3 | $100–200/month | Multi-user, API access, batch generation, manufacturer presets, white-label |
| **Education** | Persona 4 | $50–200/year | Templates, bulk student access, simplified UI |

**Key insight**: Art generation alone replaces $2,000–$20,000 in commissioning costs. Even at $50/month, the ROI for Persona 2 is enormous — this should be the anchor pricing message.

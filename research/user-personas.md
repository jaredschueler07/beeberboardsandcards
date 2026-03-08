# User Personas & Target Workflows

> Research compiled March 2026

---

## Overview

The AI board game generator app serves a spectrum of users from first-time hobbyists to experienced publishers. Each persona has distinct needs, pain points, and willingness to pay. The MVP should focus on Personas 1–2, expanding to 3–6 post-launch.

---

## Designer Demographics (Industry Context)

- **81%+ of credited designers** on top BGG-ranked games are white males. ~22% of designers are women (Board Game Design Lab, 2020). Less than 20% women in most design organizations.
- **Geographic concentration**: US (40.5%), Germany (21%), France (8%), with smaller shares from Italy, UK, Canada, Czech Republic.
- **Most are hobbyists first** — they come from playing games, not professional design. Tend to be middle-aged, college-educated, with disposable income and leisure time.
- **Typical design timeline**: 1–3 years from idea to published game. Games go through ~100 iterations.
- **Designer tool spending**: $15–35/month on digital tools. The real expense is art ($2,000–$10,000+) and manufacturing.
- **An AI tool that lowers cost/time barriers could dramatically expand who can design games** — particularly women, people of color, and people in lower-income geographies.

### Top Designer Complaints (from community research)
1. Playtesting access and quality of feedback
2. Art/illustration costs eating the budget
3. Documentation chaos (rules in Google Docs, feedback in Discord, notes in notebooks)
4. Balancing games is incredibly hard and tedious
5. Rules writing — achieving clarity without ambiguity
6. Marketing is underestimated and overwhelming
7. Tariff/shipping uncertainty (2024–2025 specifically)

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

**Market validation**: The gamification in education market is projected to grow from **$1.14B (2024) to $18.63B by 2033** (CAGR 36.4%). 67% of US schools and 61% of Canadian schools use game-based learning. This is a very real and rapidly growing segment.

---

## Persona 5: The Corporate/Events Buyer (Post-MVP)

**Who they are**: HR managers, team-building facilitators, marketing agencies, event planners. Companies looking for branded or custom team-building experiences, trade show giveaways, or onboarding programs.

**Goals**:
- Create a branded board game for a corporate retreat, product launch, or trade show
- Fast turnaround (days, not weeks)
- Professional-quality, client-facing output
- Branded packaging and components

**Pain points**:
- Custom game design agencies charge $5,000–$25,000+
- Lead times are weeks to months
- Hard to iterate on concepts
- MOQs of 100–200+ units from manufacturers

**Current workflow**: Hire agencies (ODM Group, Board Game Designs, Loopper) or buy generic team-building kits.

**What they need from our app**:
- Brand-to-game pipeline: upload logo, company values, team size → complete game concept with branded assets
- Quick turnaround (days not weeks)
- POD integration for physical production
- Templates for common corporate use cases (icebreakers, trivia, strategy)
- Professional-quality output suitable for client-facing events

**Willingness to pay**: $500–5,000 per project (one-time). B2B with company budgets. High value per transaction, lower volume.

**Market validation**: 65%+ of B2B buyers prioritize customizable designs. 68% of adults played board games in the last year (up from 52% pre-pandemic).

---

## Persona 6: The Content Creator / Influencer (Post-MVP)

**Who they are**: YouTube/TikTok creators, streamers, and community builders in the tabletop space who want to create custom games for their audience — either as merchandise, community engagement, or content. Also includes game cafe owners and event organizers.

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

---

## Hobbyist-to-Professional Spectrum

| Dimension | Hobbyist | Serious Indie | Professional Publisher |
|-----------|----------|---------------|----------------------|
| **Games/year** | 0–1 (may never finish) | 1–3 in development | 2–5 published |
| **Budget** | $0–500 | $1,000–15,000 | $10,000–100,000+ |
| **Art needs** | "Good enough" AI art is fine | AI for prototyping, hire humans for final | Need art direction tools, not replacement |
| **Key need** | Hand-holding, templates, "just make it work" | Speed, iteration, playtesting tools | Workflow integration, team features, evaluation tools |
| **Publishing path** | Share with friends, maybe POD | Kickstarter or pitch to publishers | Direct to retail/distribution |
| **Tool budget** | $0–30/month | $20–50/month | $100–500/month |

---

## Workflow Pain Points Ranked by Opportunity

Based on frequency of complaints across communities (BGG, Reddit, Discord, design blogs) and alignment with AI capabilities:

1. **Art generation and visual design** — Highest cost, highest frustration, most directly addressable by AI. Every persona needs this.
2. **Prototyping speed** — The gap between "idea" and "playable thing on the table" is weeks/months. AI can compress this to hours.
3. **Playtesting access and feedback quality** — AI simulation can't replace human playtesting but can supplement it massively (run 10,000 simulated games before the first human playtest).
4. **Game balance** — Currently done by gut feel over hundreds of manual playtests. Automated simulation is a genuine competitive moat — no consumer tool offers this today.
5. **Rules writing and documentation** — LLMs are well-suited to structured, clear technical writing. Converting game state to a readable rulebook is a natural AI application.
6. **Tool fragmentation** — Designers use 4–6 separate tools. An integrated pipeline has immediate value even without AI, and AI makes each stage dramatically better.
7. **Export and production preparation** — Print-ready files with correct bleed, crop marks, and manufacturer specs are technically tedious. Automating this removes a barrier to physical production.

---

## Strategic Takeaways

1. **The biggest underserved gap** is ideation-to-playtest-ready prototype. No existing tool covers this end-to-end with AI.
2. **Art cost is the #1 financial pain point** across all designer personas. AI art generation for prototyping would be the single highest-value feature.
3. **The serious indie designer (Persona 2) is the ideal early adopter** — they have budget, pain, and are active in communities that amplify word-of-mouth.
4. **The educator segment is enormous and validated** ($1B+ market growing at 36% CAGR) but requires radically simpler UX. Consider as a separate product mode.
5. **The corporate segment is high-value per transaction** ($500–5,000+) but low-volume B2B. Good for revenue, not for growth metrics.
6. **The hobbyist first-timer is the largest addressable audience** but hardest to monetize. Freemium with paid exports/premium art is the natural fit.
7. **Tabletop Simulator export is table-stakes** for any serious design tool — it's the de facto standard for remote playtesting.
8. **An AI tool that lowers barriers could diversify who designs games** — expanding the 81% white male base by making design accessible to underrepresented groups.

---

## Sources

- [Pine Island Games — Demographics and Design](https://www.pineislandgames.com/blog/demographicsanddesign)
- [Analog Game Studies — Gender and Racial Representation](https://analoggamestudies.org/2018/12/assessing-gender-and-racial-representation-in-top-rated-boardgamegeek-games/)
- [Stonemaier Games — Demographic Survey](https://stonemaiergames.com/5-surprises-from-our-demographic-survey/)
- [Board Game Design Lab — How to Design](https://boardgamedesignlab.com/how-to-design-a-board-game/)
- [Brandon the Game Dev — Start to Finish](https://brandonthegamedev.com/start-to-finish-publish-and-sell-your-first-board-game/)
- [LaunchBoom — Cost to Publish a Board Game 2026](https://www.launchboom.com/game-tips/cost-to-publish-a-board-game)
- [The City of Games — First-Time Creator Stats](https://thecityofkings.com/news/stats-from-successful-first-time-creators/)
- [Kickstarter — 2024 Was a Big Year for Games](https://updates.kickstarter.com/kickstarter-biggest-platform-for-games/)
- [Market Data Forecast — Gamification Education Market](https://www.marketdataforecast.com/market-reports/gamification-education-market)
- [Pine Island Games — Illustration Pricing Guide](https://www.pineislandgames.com/blog/illustration-a-comprehensive-guide)
- [Streamlined Gaming — Best Board Game Design Sites](https://streamlinedgaming.com/best-board-game-design-sites-and-forums-for-creators/)

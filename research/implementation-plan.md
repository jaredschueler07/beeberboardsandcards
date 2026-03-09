# Beeber Boards & Cards — Implementation Plan

This comprehensive, phased implementation plan serves to bridge the current structural state of the existing user interface prototype into a fully production-ready Minimum Viable Product. The strategy aggressively targets the progressive layering of backend infrastructure, generative integrations, and complex mathematical engines onto the existing foundational typing systems.

## Phase 0: Foundation (Current State Assessment)

- **Estimated Duration:** 1 Week (Solo Developer) / 3 Days (3-Person Team)
- **Current State Inventory:** A meticulous review of the repository (jaredschueler07/beeberboardsandcards) indicates a highly developed frontend shell. The codebase comprises fourteen total commits and is fundamentally built upon a robust TypeScript foundation, which accounts for 97.4% of the logic layer, supported by a specialized CSS design system representing 2.2% of the repository. The application routing shell is centralized within `app/src/App.tsx`, directing traffic across the six distinct stage components located within the `app/src/stages/` directory. The visual language is heavily standardized through the shared component library in `app/src/components/UI.tsx` and the tokenized constants defined in `app/src/constants.ts`. Crucially, the data model is strictly defined within `app/src/types.ts`. However, the current iteration is entirely disconnected from any persistent backend infrastructure; all state mutations are currently ephemeral, and user authentication is entirely absent.
- **Technical Debt Resolution:** The repository contains orphaned backend dependencies, most notably `@google/genai`, `express`, and `better-sqlite3`, which were likely included during an initial, abandoned monolithic prototyping phase. These dependencies create unnecessary security vulnerabilities and must be systematically stripped from the `package.json` manifest.
- **Key Deliverables:** A completely sanitized, highly typed React frontend application, thoroughly upgraded to the latest Vite build system to optimize hot-module replacement during development. The strict typing definitions must be comprehensively applied across all interactive elements within the six stage components.
- **Technical Decisions:** The primary architectural decision is to permanently decouple the existing monolithic frontend structure from the future backend. The React application will be containerized and deployed strictly as a static asset package via a modern edge network (e.g., Vercel or Netlify), strictly preparing it to act as an independent client consuming data from a dedicated, cross-origin API.

## Phase 1: Backend & Infrastructure

- **Estimated Duration:** 2 Weeks (Solo Developer) / 1 Week (3-Person Team)
- **Overview:** This phase establishes the fundamental persistence layer, secure user authentication gateways, and the core routing logic required to handle the platform's future compute-heavy operational tasks.
- **Key Deliverables:**
  - A fully functional, containerized Continuous Integration and Continuous Deployment pipeline specifically configured for the new backend service.
  - A comprehensive user registration, login, and session management flow seamlessly integrated into the existing `app/src/App.tsx` shell.
  - The complete translation of the TypeScript data models defined in `app/src/types.ts` into highly relational PostgreSQL database tables, specifically architecting discrete schemas for Projects, Card Instances, and overarching Rulesets.
- **Dependencies:** Successful completion of Phase 0 cleanup.
- **Technical Decisions:** The backend framework will be constructed using **FastAPI (Python)** rather than Node.js. This decision is critical because the future Monte Carlo simulation engine and complex artificial intelligence orchestration logic demand the high-performance numerical processing capabilities inherent to the Python ecosystem. The database infrastructure will utilize PostgreSQL hosted via the Supabase platform. This provides highly optimized, out-of-the-box Row Level Security policies to guarantee strict tenant isolation and manages the complex authentication logic autonomously, massively accelerating the development timeline. File storage will rely on integrated object storage buckets for staging all uploaded visual reference assets.
- **Files to Modify/Create:** Creation of a new `/api` directory structure parallel to the existing `/app` directory. Modifications to `.env` configurations and deep integration of API fetching logic within the React application shell.

## Phase 2: AI Integration — Generation Pipeline

- **Estimated Duration:** 3 Weeks (Solo Developer) / 2 Weeks (3-Person Team)
- **Overview:** This phase is dedicated to fully activating the logic within the "Brief" and "Design" stages. It involves integrating Large Language Models to autonomously generate foundational game mechanics, extract structured entities, and populate the application's data grids with highly formatted, mathematically balanced card attributes.
- **Key Deliverables:**
  - A fully operational "Brief" stage interface where unstructured natural language is successfully parsed into structured project metadata payloads.
  - A functional "Design" stage spreadsheet where the language model dynamically populates the interface with distinct card attributes based strictly on the user's brief.
  - The implementation of robust, session-based rate-limiting logic to protect backend financial resources from API abuse.
- **Dependencies:** Phase 1 infrastructure must be actively accepting authenticated payloads.
- **Technical Decisions:** The primary integration will leverage Anthropic's Claude model accessed via authorized API endpoints. This specific model is selected due to its empirically superior instruction-following capabilities regarding strict JSON schema adherence, which is an absolute necessity to prevent catastrophic data corruption within the Design stage's internal data grid. Furthermore, the architecture mandates the implementation of an aggressive middleware layer within the FastAPI routing logic. This middleware must enforce strict Pydantic model validation against every payload returned by the language model. If an output fails validation against the application's core types, the backend must automatically construct and dispatch a specific repair prompt to the model, completely abstracting the error-correction loop from the user interface.

## Phase 3: Balance Engine

- **Estimated Duration:** 4 Weeks (Solo Developer) / 2 Weeks (3-Person Team)
- **Overview:** Phase 3 represents the most mathematically complex segment of the implementation. It requires translating the static JSON card definitions into a highly dynamic, executable state environment capable of running thousands of automated, concurrent Monte Carlo simulations.
- **Key Deliverables:**
  - A secure, isolated execution sandbox strictly capable of sequentially processing the complex data matrices exported from the Design stage.
  - Dedicated API endpoints engineered to accept full game state representations and reliably return dense statistical summaries, including win rates, standard deviations, and turn duration arrays.
  - The precise wiring of these FastAPI responses directly into the existing Recharts visualization components located within `app/src/stages/BalanceStage.tsx`.
- **Dependencies:** Phase 2 must be complete, as the mathematically structured JSON generation is the mandatory fuel required to drive the engine.
- **Technical Decisions:** The engineering team will construct a highly generic, event-driven abstract state machine natively within Python. This engine must effectively abstract universal tabletop mechanics—such as deck drawing, resource allocation, and integer reduction—into highly optimized, callable functions. To achieve the required simulation volume without breaching latency budgets, the engine must leverage advanced concurrency patterns, specifically utilizing Python's `asyncio` framework and `multiprocessing` modules to execute thousands of game instances in absolute parallel across clustered worker nodes.

## Phase 4: Art & Asset Pipeline

- **Estimated Duration:** 3 Weeks (Solo Developer) / 1.5 Weeks (3-Person Team)
- **Overview:** This phase activates the "Art" stage, implementing the generative visual pipelines required to produce highly coherent, style-consistent imagery for all cards, boards, and mechanical tokens defined within the project state.
- **Key Deliverables:**
  - The deep integration of intelligent prompt engineering logic that seamlessly merges the specific text description of a card with the user's globally defined style guide architecture.
  - A robust, asynchronous job queuing system specifically built to handle long-running image generation tasks, complete with client-side polling mechanisms integrated into the React frontend to seamlessly update the user interface when specific assets finish rendering.
  - The activation of the localized asset replacement and cropping interface directly within the Art stage view.
- **Dependencies:** The foundational data schemas from Phase 2 must be finalized.
- **Technical Decisions:** The visual generation engine will rely on a dedicated serverless GPU cluster running advanced Stable Diffusion XL models. Crucially, to enforce strict visual consistency across the entire component catalog without incurring the massive latency and compute costs associated with training individual custom models per user, the architecture will utilize sophisticated adapter networks. These specialized neural components allow the system to pass a single, definitive "reference image" directly into the generation pipeline alongside the textual prompt, mathematically enforcing stylistic similarity with zero required pre-training time.
- **Files to Modify/Create:** Comprehensive behavioral additions to `app/src/stages/ArtStage.tsx` and the corresponding interface elements within the `UI.tsx` library.

## Phase 5: Layout & Export

- **Estimated Duration:** 3 Weeks (Solo Developer) / 2 Weeks (3-Person Team)
- **Overview:** Phase 5 is focused on physical materialization. It involves algorithmically merging the abstract text data from the Design stage with the generated visual assets from the Art stage, binding them within the spatial templates, and executing the heavy compilation processes required to generate highly specific, print-ready document formats.
- **Key Deliverables:**
  - The activation of the intuitive, drag-and-drop template rendering engine, allowing users to precisely define absolute spatial zones for typography and imagery.
  - A highly deterministic document generation engine capable of automatically applying required 0.125-inch bleeds, defining precise crop marks, and strictly enforcing 300 DPI image standards.
  - The successful implementation of an OAuth2 authorization flow and the successful transmission of a synthetic test order injection directly into The Game Crafter's sandbox API environment.
- **Dependencies:** Phase 2 (Text Data) and Phase 4 (Image Assets) must both be fully operational to provide the required payload variables.
- **Technical Decisions:** The primary layout engine will utilize advanced React-based document rendering libraries housed within an isolated Node.js microservice. This specific architectural choice allows the engineering team to seamlessly translate standard CSS absolute positioning coordinates directly into high-fidelity, vector-based PDF documents without relying on external, slow-rendering browser automation tools. Furthermore, the integration with commercial manufacturing APIs requires the implementation of highly robust, multi-part upload flows specifically engineered to map the platform's localized dimensional data directly into the strict physical bleed templates required by the manufacturer's automated cutting machines.

## Phase 6: Polish & Launch Preparation

- **Estimated Duration:** 2 Weeks (Solo Developer) / 1 Week (3-Person Team)
- **Overview:** The final implementation phase is entirely dedicated to feature stabilization, the deployment of user onboarding tools, the finalization of the AI Chat assistant, and the rigorous hardening of the application against edge-case errors prior to public release.
- **Key Deliverables:**
  - The successful deployment of the context-aware artificial intelligence chat widget permanently overlaid on the core user interface.
  - The implementation of a highly polished, interactive first-time user onboarding tutorial designed to guide the Hobbyist persona through the platform's complexities.
  - Extensive frontend performance optimizations, specifically implementing aggressive lazy-loading protocols for all image assets rendered within the dense spreadsheet grid views.
  - The final provisioning and deployment of the stable beta testing environment.
- **Dependencies:** All previous functional phases must be code-complete and fully integrated into the main branch repository.
- **Technical Decisions:** The AI Chat assistant will be implemented utilizing highly optimized Retrieval-Augmented Generation techniques. Rather than relying on standard contextual memory, the application will actively serialize the exact, current state matrix from the React Context provider and inject it directly into the system prompt structure, guaranteeing hyper-specific, relevant assistance. Concurrently, the frontend team must implement strict, hierarchical error boundaries throughout the React component tree. This defensive architectural pattern ensures that if an API payload returns malformed data, only the specific corrupted component will fail, rather than triggering a catastrophic crash of the entire application session.

## Milestone Checkpoints

### Milestone 1: "Playable Prototype" (Achieved upon completion of Phase 3)

- **Definition:** A foundational user can input a core textual concept, successfully receive generated structural card data, execute automated mathematical balance simulations, and manually export the raw, unformatted data matrices.
- **Strategic Value:** This milestone definitively validates the platform's core "smart" functionality, proving that the underlying mathematical orchestration engine is stable and capable of processing dynamic user variables at scale.

### Milestone 2: "Beta Ready" (Achieved upon completion of Phase 5)

- **Definition:** The complete, end-to-end design flow is fully functional. Users can successfully generate and assign graphical artwork, intuitively map data to spatial templates, and download a finalized, fully formatted Print-and-Play document.
- **Strategic Value:** The platform is functionally ready for closed-cohort testing targeting the primary Serious Indie Designer segment. Crucial feedback loops regarding artistic coherence tolerances and the overall user experience of the layout interface begin immediately at this stage.

### Milestone 3: "Launch Ready" (Achieved upon completion of Phase 6)

- **Definition:** The entire application architecture is stabilized. It features highly robust data persistence, aggressive error-handling protocols, polished onboarding logic, commercial manufacturing integration, and persistent contextual support systems.
- **Strategic Value:** The platform is certified for public release, triggering authorized marketing campaigns and the immediate activation of the payment processing gateways required to monetize the premium Artisan and Guildmaster subscription tiers.

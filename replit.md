# AI Quality Lab

## Overview
A gamified learning application for Product Managers to master evaluations (evals) and guardrails for AI products. Users learn to define success criteria for AI outputs through 33 progressive challenges across 11 quality dimensions, plus an Error Analysis Lab for practicing trace review and failure taxonomy building.

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx      # Navigation with mobile menu
│   │   │   └── footer.tsx      # Site footer
│   │   ├── ui/                  # Shadcn components
│   │   └── api-key-required.tsx # API key prompt banner
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces (includes SandboxScenario with failureModes)
│   │   ├── storage.ts          # localStorage/sessionStorage helpers
│   │   ├── challenges-data.ts  # 33 challenge scenarios + 6 sandbox scenarios with failure modes
│   │   ├── error-analysis-data.ts # 25 TaskPilot traces, expert taxonomy, localStorage helpers
│   │   ├── api.ts              # Direct browser-to-API integration (scenario-aware judge prompt)
│   │   ├── synonyms.ts         # Deterministic synonym matching tables
│   │   ├── pii-detection.ts    # PII pattern detection
│   │   └── content-moderation.ts # Pre/post validation, offensive detection
│   └── pages/
│       ├── home.tsx            # Learning path landing page (3-step path)
│       ├── learn.tsx           # Educational content
│       ├── practice.tsx        # Combined Practice page with Guided + Open tabs
│       ├── eval-challenge.tsx  # Level-based challenge playground
│       ├── error-analysis.tsx  # Error Analysis Lab (2 phases, 25 traces)
│       ├── about.tsx           # How the app works (architecture)
│       └── settings.tsx        # API key management with dedicated key tip
server/
├── index.ts                    # Express server entry (CSP headers configured)
└── routes.ts                   # API routes (minimal - most logic is frontend)
```

## Navigation Structure
```
Learn | Practice | Error Analysis | About | Settings
```
- Practice page has two tabs: Guided (33 challenges) and Open (6 sandbox scenarios)
- `/practice` defaults to Guided tab
- `/practice?tab=open` links directly to Open tab
- `/challenges` and `/sandbox` redirect to `/practice` for backward compatibility
- `/error-analysis` — Error Analysis Lab (no API key needed)

## Key Features

### Storage Architecture
- **sessionStorage**: API keys (auto-deleted on tab close for security)
- **localStorage**: Progress tracking, completed levels, achievements, error analysis progress

### Three-Layer Matching System (Guided Challenges)
1. **Garbage Detection**: Filters random/invalid input
2. **Deterministic Synonym Matching**: Fast, accurate keyword matching from synonym tables
3. **LLM Validation**: Fallback for complex semantic matching with hallucination prevention

### Three-Layer Validation Pipeline (Open Practice)
1. **Pre-Validation (Code)**: Garbage, copy-paste, identical examples, format, offensive content detection — runs BEFORE LLM
2. **LLM Evaluation**: Scenario-aware judge with per-scenario failure modes, 3-dimension bad example scoring
3. **Post-Validation (Code)**: Override LLM scores if it missed offensive content, copy-paste, or hallucination — runs AFTER LLM

### Scenario-Aware Judge (Delta 6)
- Each sandbox scenario has `failureModes` array with specific ways bot responses can fail
- Judge prompt injects failure modes for contextual evaluation
- Bad examples evaluated on 3 dimensions: violates_user_criteria, is_realistic_failure, failure_mode_matched
- Good examples scored on scenario appropriateness (meets_user_criteria is informational only)

### Error Analysis Lab (Delta 8)
- 25 TaskPilot AI assistant traces for review (no API key required)
- **Phase 1: Review** — Pass/Fail each trace, write failure notes, see expert feedback
  - Keyboard shortcuts: P=Pass, F=Fail, N=Next
  - Back button to revisit previous traces (read-only)
  - Borderline traces (8, 12, 22, 25) have softer disagreement messages
  - Collapsible context panel for TaskPilot product info
- **Phase 2: Build Taxonomy** — Categorize failure notes into named categories
  - Autocomplete from existing categories
  - Side-by-side comparison with expert 10-category taxonomy
  - "What's Next" section with actionable steps and resources
- localStorage key: `errorAnalysisProgress`
- Edge cases: 0 failures prompts redo, 1-3 failures shows gentle suggestion

### Quality Dimensions (11 total, 3 levels each = 33 challenges)
**Eval + Runtime:** Instruction Following, Format Compliance, Toxicity Detection
**Eval-Focused:** Relevance, Completeness, Tone & Style, Consistency
**Requires System Design:** Groundedness, Factual Accuracy (Advanced), Refusal Handling
**Security:** Adversarial Robustness

### API Integration
- Direct browser-to-OpenAI/Anthropic API calls
- Keys never touch backend servers
- Supports both providers with automatic model selection

### Security
- CSP headers configured in server/index.ts
  - Production: `script-src 'self'` (strict)
  - Development: `script-src 'self' 'unsafe-inline'` (needed for Vite HMR)
  - Allows: Google Fonts, YouTube embeds, OpenAI/Anthropic API calls
- No disclaimer popup (removed as redundant — users must visit Settings for API key first)
- Dedicated API key tip on Settings page

## Development Commands
- `npm run dev` - Start development server
- Server runs on port 5000 (frontend and backend)

## Important Notes
- PII detection warns users when entering email, phone, SSN, or credit card patterns
- All 33 challenges have expert criteria with difficulty progression
- Factual Accuracy marked as "Advanced" with note to focus on Groundedness instead
- Progress is persisted locally; API keys are session-only
- Settings page includes tip to generate a dedicated API key for the app

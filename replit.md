# AI Quality Lab

## Overview
A gamified learning application for Product Managers to master evaluations (evals) and guardrails for AI products. Users learn to define success criteria for AI outputs through 30 progressive challenges across 10 quality dimensions.

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx      # Navigation with mobile menu
│   │   │   └── footer.tsx      # Site footer
│   │   ├── ui/                  # Shadcn components
│   │   ├── disclaimer-modal.tsx # First-use privacy warning
│   │   └── api-key-required.tsx # API key prompt banner
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── storage.ts          # localStorage/sessionStorage helpers
│   │   ├── challenges-data.ts  # 30 challenge scenarios with expert criteria
│   │   ├── api.ts              # Direct browser-to-API integration
│   │   ├── synonyms.ts         # Deterministic synonym matching tables
│   │   ├── pii-detection.ts    # PII pattern detection
│   │   └── content-moderation.ts # Pre/post validation, offensive detection
│   └── pages/
│       ├── home.tsx            # Learning path landing page
│       ├── learn.tsx           # Educational content
│       ├── challenges.tsx      # Challenge grid view
│       ├── eval-challenge.tsx  # Level-based challenge playground
│       ├── sandbox.tsx         # Custom scenario practice
│       ├── about.tsx           # How the app works (architecture)
│       └── settings.tsx        # API key management
server/
├── index.ts                    # Express server entry
└── routes.ts                   # API routes (minimal - most logic is frontend)
```

## Key Features

### Storage Architecture
- **sessionStorage**: API keys (auto-deleted on tab close for security)
- **localStorage**: Progress tracking, completed levels, achievements

### Three-Layer Matching System (Challenges)
1. **Garbage Detection**: Filters random/invalid input
2. **Deterministic Synonym Matching**: Fast, accurate keyword matching from synonym tables
3. **LLM Validation**: Fallback for complex semantic matching with hallucination prevention

### Three-Layer Validation Pipeline (Sandbox)
1. **Pre-Validation (Code)**: Garbage, copy-paste, identical examples, format, offensive content detection — runs BEFORE LLM
2. **LLM Evaluation**: Semantic quality scoring with automatic fail conditions
3. **Post-Validation (Code)**: Override LLM scores if it missed offensive content, copy-paste, or hallucination — runs AFTER LLM

### Quality Dimensions (10 total, 3 levels each = 30 challenges)
1. Instruction Following
2. Format Compliance  
3. Toxicity Detection
4. Relevance
5. Completeness
6. Tone & Style
7. Consistency
8. Groundedness
9. Factual Accuracy
10. Refusal Handling

### API Integration
- Direct browser-to-OpenAI/Anthropic API calls
- Keys never touch backend servers
- Supports both providers with automatic model selection

## Development Commands
- `npm run dev` - Start development server
- Server runs on port 5000 (frontend and backend)

## Important Notes
- First-use disclaimer modal warns against entering real/sensitive data
- PII detection warns users when entering email, phone, SSN, or credit card patterns
- All 30 challenges have expert criteria with difficulty progression
- Progress is persisted locally; API keys are session-only

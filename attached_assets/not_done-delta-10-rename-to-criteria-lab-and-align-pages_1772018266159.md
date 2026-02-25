# not_done — Delta 10: Rename "Practice" to "Criteria Lab" + Align All Pages

Date: 2026-02-25

**Supersedes delta-9.** Delta-9 merged Sandbox into Challenges and renamed to "Practice." This delta does the same merge but renames to "Criteria Lab" instead, and fixes all stale references across the app.

**Why "Criteria Lab":** With Error Analysis Lab added, "Practice" is too generic — Error Analysis is also practice. "Criteria Lab" describes what the section actually teaches (defining quality criteria) and creates a clean parallel: Criteria Lab → Error Analysis Lab.

---

## Change 1: Navigation

**Before (current app):**
```
Learn | Challenges | Sandbox | Progress | About | Settings
```

**After:**
```
Learn | Criteria Lab | Error Analysis Lab | Progress | About | Settings
```

- Remove "Challenges" and "Sandbox" as separate nav items
- Add "Criteria Lab" (merges both)
- Add "Error Analysis Lab" (new feature from delta-8)

---

## Change 2: Criteria Lab page

**Route:** `/criteria-lab`
**Redirects:** `/challenges` → `/criteria-lab?tab=guided`, `/sandbox` → `/criteria-lab?tab=open`, `/practice` → `/criteria-lab`

The Criteria Lab page has two tabs:

```
┌─────────────────────────────────────────────┐
│  Criteria Lab                               │
│                                             │
│  [ Guided ]  [ Open ]                       │
│  ─────────────────────────────────────────   │
│                                             │
│  (tab content below)                        │
│                                             │
└─────────────────────────────────────────────┘
```

**Tab: Guided** (default tab)
- Shows the existing 33 challenges exactly as they are now
- 11 quality dimensions, 3 levels each
- Same UI, same progression, same scoring
- Everything from the current `/challenges` page lives here unchanged

**Tab: Open**
- Shows the existing 6 sandbox scenarios exactly as they are now
- Same scenario grid, same interaction (write criteria + good example + bad example)
- Same scoring, same evaluation
- Everything from the current `/sandbox` page lives here unchanged

**Tab descriptions** (small subtitle under each tab name):
- **Guided:** "33 exercises across 11 quality dimensions. Fixed scenarios, expert comparison."
- **Open:** "6 realistic scenarios. Write your own criteria and examples from scratch."

---

## Change 3: Home page — Learning path infographic

**Before (current app):**
```
1. LEARN — Understand evals & guardrails
2. CHALLENGES — 33 hands-on exercises
3. PROGRESS — Track learning
4. SANDBOX — Practice on your own
```

**After:**
```
1. LEARN — Understand quality dimensions
2. CRITERIA LAB — Define what "good" looks like
3. ERROR ANALYSIS LAB — Review, diagnose, categorize
```

Three steps, not four. Each step teaches one clear skill. Progress is accessible from nav but doesn't need to be in the learning path — it's a dashboard, not a learning step.

**Home page hero subtitle update:**
- Before: "Master the basics of evals and guardrails for AI products"
- After: "Learn to evaluate AI outputs — from defining quality criteria to diagnosing failures"

---

## Change 4: Learn page references

Anywhere the Learn page mentions "Challenges" or "Sandbox" as destinations, update:

- "Head to Challenges to practice" → "Head to the Criteria Lab to start with guided exercises"
- "Try the Sandbox" → "Try open scenarios in the Criteria Lab"

**Learn page Section 7 CTA (Shipping Decisions):**
- Before: "Go to Challenges →" (links to `/challenges`)
- After: "Go to Criteria Lab →" (links to `/criteria-lab`)

**Learn page "From Learning to Production" section:**
Update the table and text to reference the full learning path:

Before:
```
| Here | Production |
| You write criteria | You write criteria (which become evaluators) |
```

After:
```
| In the Criteria Lab | In Production |
| You define what "good" looks like | You define evaluator criteria |
| You review pre-made scenarios | You review real user conversations |
| You compare to expert criteria | You build a failure taxonomy |
```

**Learn page "What You're Learning" section — add bridge to Error Analysis:**
After the "What Production Adds" paragraph, add:

> **Next step: Error Analysis Lab**
> Once you can define quality criteria, the next skill is reviewing real AI outputs and finding patterns. The Error Analysis Lab walks you through this with 25 pre-built conversations — no API key needed.

---

## Change 5: About page updates

**Navigation line:**
- Before: "Learn", "Challenges", "Sandbox", "Progress", "About", "Settings"
- After: "Learn", "Criteria Lab", "Error Analysis Lab", "Progress", "About", "Settings"

**Footer CTA:**
- Before: `[Start Challenges →]` (primary) + `[Try Sandbox →]` (secondary)
- After: `[Start Criteria Lab →]` (primary, links to `/criteria-lab`) + `[Try Error Analysis Lab →]` (secondary, links to `/error-analysis`)

---

## Change 6: Error Analysis Lab references

In delta-8 (Error Analysis Lab), all references to "Practice" become "Criteria Lab":

- Landing page text: "You've learned the vocabulary (quality dimensions), practiced defining criteria (Criteria Lab)..."
- Learning path: `Learn → Criteria Lab → Error Analysis Lab`
- Nav order: `Learn | Criteria Lab | Error Analysis Lab | Progress | About | Settings`
- "What's Next" section intro: "...practiced defining criteria (guided and open exercises in the Criteria Lab)..."

---

## Change 7: Progress page

The Progress page tracks Criteria Lab only (guided challenges + open scenarios). Error Analysis Lab is NOT tracked here — it has its own internal progress within its own page.

**Before:**
```
Challenges: 15/33 complete
Sandbox: 2/6 complete
```

**After:**
```
Criteria Lab
  Guided: 15/33 complete
  Open: 2/6 complete
```

---

## Change 8: URL structure

- `/criteria-lab` — Criteria Lab page, defaults to Guided tab
- `/criteria-lab?tab=guided` — Direct link to Guided tab
- `/criteria-lab?tab=open` — Direct link to Open tab
- `/error-analysis` — Error Analysis Lab page
- `/challenges` — Redirect to `/criteria-lab?tab=guided`
- `/sandbox` — Redirect to `/criteria-lab?tab=open`
- `/practice` — Redirect to `/criteria-lab`

---

## What does NOT change

- All challenge content (33 scenarios, expert criteria, scoring logic) stays identical
- All sandbox content (6 scenarios, evaluation logic) stays identical
- All Error Analysis Lab content (25 traces, expert taxonomy) stays identical
- localStorage keys and data structure stay the same (no need to migrate user progress)
- API key requirements stay the same (Criteria Lab needs API key, Error Analysis Lab does not)
- Settings page stays identical
- About page content stays identical (only nav and CTAs change)
- Learn page content stays identical (only references and CTAs change)

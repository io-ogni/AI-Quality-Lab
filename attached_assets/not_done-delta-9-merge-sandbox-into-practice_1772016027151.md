# not_done — Delta 9: Merge Sandbox into Challenges, Rename to "Practice"

Date: 2026-02-24

**Problem:** With Error Analysis Lab added, the nav has four learning sections (Learn, Challenges, Sandbox, Error Analysis). Sandbox and Challenges teach the same core skill — defining quality criteria. Sandbox is "advanced Challenges," not a peer to Error Analysis. Four items clutters the nav and obscures the actual learning progression.

**Fix:** Fold Sandbox into Challenges. Rename the page to "Practice." Two tabs: Guided (current Challenges) and Open (current Sandbox).

---

## Change 1: Update top nav

**Before:**
```
Learn | Challenges | Sandbox | Error Analysis | Progress | Settings
```

**After:**
```
Learn | Practice | Error Analysis | Progress | Settings
```

- Remove "Sandbox" from nav entirely
- Rename "Challenges" to "Practice"
- Route: `/practice` (redirect `/challenges` and `/sandbox` to `/practice` for any bookmarks)

---

## Change 2: Practice page with two tabs

The Practice page (`/practice`) has two tabs at the top:

```
┌─────────────────────────────────────────────┐
│  Practice                                   │
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

---

## Change 3: Tab descriptions

Small subtitle under each tab name to orient the user:

- **Guided:** "33 exercises across 11 quality dimensions. Fixed scenarios, expert comparison."
- **Open:** "6 realistic scenarios. Write your own criteria and examples from scratch."

---

## Change 4: Update Home page learning path

The visual learning path infographic on the Home page needs updating:

**Before:**
```
1. LEARN — Understand evals & guardrails
2. CHALLENGES — 33 hands-on exercises
3. SANDBOX — Practice with real scenarios
4. ERROR ANALYSIS — Practice the real-world process
```

**After:**
```
1. LEARN — Understand evals & guardrails
2. PRACTICE — Guided exercises + open scenarios
3. ERROR ANALYSIS — Review, diagnose, categorize
```

Three steps, not four. Cleaner progression.

---

## Change 5: Update Learn page references

Anywhere the Learn page mentions "Challenges" or "Sandbox" as separate destinations, update to reference "Practice" with the relevant tab:

- "Head to Challenges to practice" → "Head to Practice to start with guided exercises"
- "Try the Sandbox" → "Try open practice scenarios in the Practice section"

---

## Change 6: Update Error Analysis Lab references

In the Error Analysis Lab intro and summary screens, the learning path reference changes:

**Before:**
```
Learn → Challenges → Sandbox → Error Analysis Lab
```

**After:**
```
Learn → Practice → Error Analysis Lab
```

---

## Change 7: URL structure

- `/practice` — Practice page, defaults to Guided tab
- `/practice?tab=guided` — Direct link to Guided tab
- `/practice?tab=open` — Direct link to Open tab
- `/challenges` — Redirect to `/practice?tab=guided`
- `/sandbox` — Redirect to `/practice?tab=open`

---

## Change 8: Progress page updates

If the Progress page tracks Challenges and Sandbox separately, merge the display:

**Before:**
```
Challenges: 15/33 complete
Sandbox: 2/6 complete
```

**After:**
```
Practice
  Guided: 15/33 complete
  Open: 2/6 complete
```

---

## What does NOT change

- All challenge content (scenarios, expert criteria, scoring logic) stays identical
- All sandbox content (6 scenarios, evaluation logic) stays identical
- localStorage keys and data structure stay the same (no need to migrate user progress)
- API key requirements stay the same (both tabs need API key)
- Error Analysis Lab content and behavior stays identical
- Settings page stays identical

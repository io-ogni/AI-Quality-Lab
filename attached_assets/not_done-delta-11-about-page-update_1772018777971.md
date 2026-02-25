# not_done — Delta 11: About Page — Update for Error Analysis Lab

Date: 2026-02-25

**Problem:** The About page was written when the app only had Challenges and Sandbox. It explains the 3-layer evaluation architecture (Code → LLM → Code) but says nothing about the Error Analysis Lab. Now the app has two labs — the About page needs to cover both.

---

## Change 1: Section 1 — Reframe "Why This App Exists"

The opening should introduce both labs before diving into architecture details.

**Before:**
```
You can't just use keyword matching to evaluate AI responses.
"Be professional" and "maintain a formal tone" mean the same thing —
but a keyword check would miss that.

But LLMs alone aren't reliable either. They can be inconsistent,
hallucinate scores, or be tricked by prompt injection.

Our solution: Don't trust the LLM alone. Use code + LLM + code.
```

**After:**
```
AI Quality Lab teaches two core PM skills:

1. Defining quality criteria — What does "good" look like for a
   given scenario? (Criteria Lab)
2. Error analysis — Reviewing real AI outputs, diagnosing failures,
   and finding patterns. (Error Analysis Lab)

The Criteria Lab uses AI to evaluate your work — and that evaluation
itself is an example of the challenge. How do you reliably judge
whether someone's criteria are good?

Below is how we solved that problem under the hood.
```

Then the existing architecture explanation (Sections 2-3) follows naturally — it's now clearly about how the Criteria Lab's evaluation works.

---

## Change 2: Section 4 — Rename "How Challenges Work"

- **Before:** "How Challenges Work"
- **After:** "How the Criteria Lab Works"

Update all references within this section:
- "The 33 challenges" → "The 33 guided exercises"
- "Challenges have pre-defined expert criteria" → "Each exercise has pre-defined expert criteria"

---

## Change 3: New section — "How the Error Analysis Lab Works"

**Location:** After Section 6 ("Lessons for Building AI Features"), before Section 7 (Tech Stack).

**Header:** "How the Error Analysis Lab Works"

**Content:**
```
The Error Analysis Lab is completely different from the Criteria Lab.
There's no LLM, no API key, no AI evaluation of your work.

You review 25 pre-written conversations from a fictional AI assistant
(TaskPilot) and practice the error analysis process:

Phase 1: Review
Read each conversation. Decide: Pass or Fail. If Fail, write down
what's wrong. After each trace, see what an expert evaluator thought.

Phase 2: Build Your Taxonomy
Take all your failure notes and group them into categories. Then
compare your categories to the expert's taxonomy.

Everything runs locally in your browser. Your progress is saved
in localStorage. No data is sent anywhere.

Why no AI? Because error analysis is a human skill. The whole point
is that YOU review the outputs and find the patterns — not an
algorithm. This is exactly how it works in production.
```

---

## Change 4: Section 7 — Update Tech Stack table

**Before:**

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| LLM Calls | OpenAI API or Anthropic API (your key) |
| Content Moderation | TensorFlow.js Toxicity Model (local) |
| Storage | Browser localStorage |

**After:**

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| LLM Calls | OpenAI API or Anthropic API (your key) — Criteria Lab only |
| Content Moderation | TensorFlow.js Toxicity Model (local) — Criteria Lab only |
| Error Analysis Lab | Static content + localStorage (no API calls) |
| Storage | Browser localStorage |

---

## Change 5: Navigation and CTAs

**Navigation line:**
- Before: "Learn", "Challenges", "Sandbox", "Progress", "About", "Settings"
- After: "Learn", "Criteria Lab", "Error Analysis Lab", "Progress", "About", "Settings"

**Footer CTA:**
- Before: `[Start Challenges →]` (primary) + `[Try Sandbox →]` (secondary)
- After: `[Start Criteria Lab →]` (primary, links to `/criteria-lab`) + `[Try Error Analysis Lab →]` (secondary, links to `/error-analysis`)

---

## What does NOT change

- Sections 2-3 (Architecture diagram, "Who Does What" table) — stays identical, now clearly scoped to Criteria Lab by the updated intro
- Section 5 (Content Moderation / TensorFlow.js) — stays identical
- Section 6 ("Lessons for Building AI Features") — stays identical
- Section 8 (Known Limitations) — stays identical

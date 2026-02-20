# Delta: About This App Page — Full Spec (with TensorFlow.js fix)

**Date:** 2026-02-20
**Issue:** About page incorrectly showed "Code" + "Pattern matching" for offensive content detection. Should reference TensorFlow.js.

---

## Route

`/about`

## Navigation

Add "About" to nav links: "Learn", "Challenges", "Sandbox", "Progress", "About", "Settings"

---

## Section 1: The Challenge

**Header:** "Why This App Exists"

**Content:**
```
You can't just use keyword matching to evaluate AI responses.
"Be professional" and "maintain a formal tone" mean the same thing —
but a keyword check would miss that.

But LLMs alone aren't reliable either. They can be inconsistent,
hallucinate scores, or be tricked by prompt injection.

Our solution: Don't trust the LLM alone. Use code + LLM + code.
```

---

## Section 2: The Architecture

**Header:** "How We Evaluate Your Work"

**Visual:** Show this diagram (can be styled as a flowchart or three boxes with arrows)

```
┌─────────────────────────────────────────────────────────┐
│ LAYER 1: CODE PRE-VALIDATION                            │
│ Runs BEFORE the LLM                                     │
│                                                         │
│ • Garbage detection (input too short?)                  │
│ • Copy-paste detection (did you paste criteria as       │
│   example?)                                             │
│ • Identical examples detection                          │
│ • Format detection (examples look like bullet lists?)   │
│ • Offensive content detection (TensorFlow.js)           │
│                                                         │
│ If FAIL → Return immediately, don't call the LLM        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ LAYER 2: LLM EVALUATION                                 │
│                                                         │
│ Semantic evaluation of your criteria and examples       │
│ • Are your criteria specific enough?                    │
│ • Are they relevant to the scenario?                    │
│ • Do your examples actually demonstrate the criteria?   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ LAYER 3: CODE POST-VALIDATION                           │
│ Runs AFTER the LLM                                      │
│                                                         │
│ • Did the LLM miss offensive content? Override.         │
│ • Did the LLM score copy-pasted text too high? Override.│
│ • Recalculate final score if needed.                    │
└─────────────────────────────────────────────────────────┘
```

---

## Section 3: What's Deterministic vs AI

**Header:** "Who Does What"

| Task | Who Does It | Why |
|------|-------------|-----|
| Check if input is too short | Code | Simple rule, 100% reliable |
| Detect copy-pasted text | Code | String comparison, no AI needed |
| Detect offensive content | Local AI (TensorFlow.js) | Runs in browser, catches variations like "1diot" and "f*ck", no data sent to servers |
| Match "polite" to "professional" | LLM | Requires semantic understanding |
| Judge if criteria are complete | LLM | Requires domain knowledge |
| Verify LLM didn't hallucinate | Code | Check if claimed text exists in input |
| Calculate final score | Code | Math, not judgment |

---

## Section 4: Challenges Mode — Deterministic Matching First

**Header:** "How Challenges Work"

**Content:**
```
The 33 challenges have pre-defined "expert criteria" — the answers
we're looking for.

Before calling any LLM, we check if your answer matches using
synonym tables:

  "professional" = "formal" = "business-like"
  "empathetic" = "understanding" = "compassionate"

Why? It's instant, free, 100% reliable, and consistent.

The LLM only runs when we need semantic judgment that synonyms
can't capture.
```

---

## Section 5: Content Moderation — Privacy First

**Header:** "How We Handle Offensive Content"

**Content:**
```
We use TensorFlow.js to detect offensive content. This is important:

✓ Runs 100% in YOUR browser
✓ No data sent to external servers
✓ Catches variations humans try (like "1diot" or "f*ck")
✓ Trained on real toxic content patterns
✓ ~15MB model, downloaded once and cached

We never send your text to a moderation API. Your input stays
on your device.
```

---

## Section 6: Why This Matters for Your Work

**Header:** "Lessons for Building AI Features"

**Content (as numbered list or cards):**

```
1. Don't trust LLMs alone — always validate
   LLMs can hallucinate, be inconsistent, or be manipulated.

2. Use code for what code does best
   Simple checks, format validation, math — don't waste an LLM call.

3. Use AI for what AI does best
   Semantic understanding, nuance, judgment calls.

4. Validate inputs BEFORE the LLM
   Catch garbage early. Save money. Fail fast.

5. Validate outputs AFTER the LLM
   The LLM might miss things. Have a safety net.

6. Privacy matters — use local models when possible
   TensorFlow.js runs in the browser. No API calls needed for
   content moderation.
```

---

## Section 7: The Tech Stack

**Header:** "What Powers This App"

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| LLM Calls | OpenAI API or Anthropic API (your key) |
| Content Moderation | TensorFlow.js Toxicity Model (local) |
| Storage | Browser localStorage |

---

## Footer CTA

**Content:**
```
Now you know how it works under the hood.
Ready to practice?
```

**Buttons:**
- [Start Challenges →] (primary, links to `/challenges`)
- [Try Sandbox →] (secondary, links to `/sandbox`)

---

## Key Fix Summary

The "Detect offensive content" row was incorrectly showing:
- **Wrong:** "Code" + "Pattern matching catches common cases"
- **Correct:** "Local AI (TensorFlow.js)" + "Runs in browser, catches variations like '1diot' and 'f*ck', no data sent to servers"

This is a privacy/trust feature worth highlighting.

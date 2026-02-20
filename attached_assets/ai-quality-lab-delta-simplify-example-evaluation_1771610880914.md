# Delta: Simplify Example Validation Logic

**Date:** 2026-02-20
**Priority:** HIGH — Current logic is overly complex and produces confusing results

---

## The Problem

Current approach evaluates examples against TWO things:
1. The user's criteria
2. The scenario

This creates edge cases:
- Bad criteria + "correct" bad example → high score (because it "violates" bad criteria)
- Swapped examples → confusing feedback

**Example of the bug:**

User submitted for Financial Advisor:
- Criteria: "give advice like buy bitcoin" (WRONG criteria)
- Bad example: "You should talk to a financial expert" (actually CORRECT behavior)
- Result: Bad example got 4/5 because it "violates the criteria"

This is nonsense. The bad example is the correct response for the scenario.

---

## The Fix: Evaluate Examples Against Scenario Only

**Remove** the check against user's criteria. Evaluate examples **only** against the scenario.

| What | Evaluated Against |
|------|-------------------|
| Criteria | The scenario (are these good criteria for this bot type?) |
| Good example | The scenario (is this a good response for this bot type?) |
| Bad example | The scenario (is this a realistic failure for this bot type?) |

The scenario/system prompt is the source of truth, not the user's criteria.

---

## Updated Judge Prompt

Replace the example evaluation sections with:

```
## Evaluating the Good Example

Evaluate ONLY against the scenario, NOT against the user's criteria.

Ask: "If a real [bot type] gave this response, would it be appropriate?"

Check:
- Does it follow the system prompt's instructions?
- Is it appropriate for this bot type?
- Would this be a good response in production?

Score:
- is_good_for_scenario: TRUE if this would be an appropriate response
- score: 5 if clearly good, 1 if clearly bad, 2-4 for partial

Do NOT check if it matches the user's criteria. The user's criteria might be wrong.

## Evaluating the Bad Example

Evaluate ONLY against the scenario, NOT against the user's criteria.

Ask: "If a real [bot type] gave this response, would it be a problem?"

Check:
- Does it violate the system prompt's instructions?
- Would this be a failure mode for this bot type?
- Is this a realistic mistake a bot might make?

Score:
- is_realistic_failure: TRUE if this would be problematic behavior
- score: 5 if clearly a realistic failure, 1 if actually correct behavior, 2-4 for partial

CRITICAL: If the "bad" example is actually CORRECT behavior for the scenario, it FAILS.
A response that follows the system prompt is NOT a failure.
```

---

## Updated Response Format

Simpler structure — no `criteria_check` array, no `meets_user_criteria` or `violates_user_criteria`:

```json
{
  "good_example": {
    "is_good_for_scenario": true,
    "score": 4,
    "feedback": "This response appropriately recommends consulting a professional, which aligns with the financial advisor bot's purpose."
  },
  "bad_example": {
    "is_realistic_failure": true,
    "score": 5,
    "feedback": "This response gives specific investment advice, which violates the bot's guidelines. This is a realistic failure mode."
  }
}
```

---

## What This Changes

### Before (Complex)
```
Good example evaluation:
- meets_user_criteria? (check against user's criteria)
- is_good_for_scenario? (check against scenario)
- Both must be true

Bad example evaluation:
- violates_user_criteria? (check against user's criteria)
- is_realistic_failure? (check against scenario)
- Both must be true
```

### After (Simple)
```
Good example evaluation:
- is_good_for_scenario? (check against scenario only)

Bad example evaluation:
- is_realistic_failure? (check against scenario only)
```

---

## Why This Is Better

1. **Simpler logic** — One source of truth (the scenario)

2. **No edge cases** — Bad criteria can't produce weird example scores

3. **Independent skill evaluation:**
   - Criteria scores tell you: "Can you articulate quality?"
   - Example scores tell you: "Can you recognize good/bad responses?"

4. **The implicit connection:** If criteria is good AND examples are good, they naturally align. If they don't, the separate scores surface which one is wrong.

5. **Teaches the right thing:** "Do you understand what good/bad looks like for this bot type?" — not "Are you internally consistent?"

---

## Test Cases

### Test Case 1: Good criteria, good examples
```
Scenario: Financial Advisor
Criteria: "recommend professionals, don't give specific advice"
Good: "I'd suggest speaking with a certified financial planner."
Bad: "Definitely invest in index funds!"

Expected:
- Criteria: High scores (relevant, specific)
- Good example: 5/5, is_good_for_scenario: true
- Bad example: 5/5, is_realistic_failure: true
```

### Test Case 2: Bad criteria, but user recognizes good/bad
```
Scenario: Financial Advisor
Criteria: "give specific investment advice" (WRONG)
Good: "I'd recommend speaking with a financial advisor." (actually correct)
Bad: "Put everything in Bitcoin!" (actually bad)

Expected:
- Criteria: Low scores (unsafe, irrelevant to system prompt)
- Good example: 5/5, is_good_for_scenario: true (it IS good for the scenario)
- Bad example: 5/5, is_realistic_failure: true (it IS a realistic failure)
```

### Test Case 3: Good criteria, swapped examples
```
Scenario: Financial Advisor
Criteria: "recommend professionals, don't give advice"
Good: "Just go for it, buy Bitcoin!" (actually bad)
Bad: "You should consult a financial expert." (actually good)

Expected:
- Criteria: High scores
- Good example: 1/5, is_good_for_scenario: false, feedback: "This gives specific advice, which is inappropriate for a financial advisor bot."
- Bad example: 1/5, is_realistic_failure: false, feedback: "This is actually correct behavior — recommending an expert. A bad example should show a realistic failure."
```

### Test Case 4: Bad criteria, swapped examples
```
Scenario: Financial Advisor
Criteria: "give specific advice" (WRONG)
Good: "Buy index funds!" (matches bad criteria, but is bad for scenario)
Bad: "Talk to a professional." (violates bad criteria, but is good for scenario)

Expected:
- Criteria: Low scores (unsafe)
- Good example: 1/5, is_good_for_scenario: false
- Bad example: 1/5, is_realistic_failure: false
```

---

## Summary

1. **Remove** `meets_user_criteria` and `violates_user_criteria` checks
2. **Keep only** `is_good_for_scenario` and `is_realistic_failure`
3. **Evaluate examples against the scenario**, not the user's criteria
4. **Simplify** response format and judge prompt

The scenario is the source of truth. The user's criteria is what we're evaluating, not what we're evaluating against.

# Delta: Fix Example Validation Logic

**Date:** 2026-02-20
**Priority:** HIGH — Current bug allows swapped/wrong examples to pass

---

## The Bug

User submitted for Financial Advisor scenario:

**Criteria:**
- acknowledge the dilemma
- do not give advice
- recommend professional advisors

**Good Example:** "I'd say, just go for it!"
**Bad Example:** "I think you should talk to someone with more experience."

**Result:** Score 4/5, passed.

**Problem:** The examples are backwards.
- "Just go for it" VIOLATES "do not give advice" — should fail as a good example
- "Talk to someone with more experience" FOLLOWS "recommend professional advisors" — should fail as a bad example

The judge didn't catch this.

---

## Root Cause

The judge evaluates examples without rigorously cross-checking against the user's criteria. It's looking at whether examples are "reasonable" rather than whether they **actually meet/violate the specific criteria provided**.

---

## Fix: Update Judge Prompt

Add explicit validation instructions to the judge prompt.

### Current Logic (Implicit)
```
Evaluate if the good example is good.
Evaluate if the bad example is bad.
```

### Required Logic (Explicit)
```
For the GOOD example:
1. List each criterion the user provided
2. Check if this example MEETS each criterion
3. If ANY criterion is violated, this is NOT a valid good example

For the BAD example:
1. List each criterion the user provided
2. Check if this example VIOLATES at least one criterion
3. If the example MEETS all criteria, this is NOT a valid bad example
```

---

## Updated Judge Prompt Section

Replace the example evaluation section with:

```
## Evaluating the Good Example

CRITICAL: A good example must MEET the user's criteria, not just "sound good."

Step-by-step:
1. List each criterion the user provided
2. For each criterion, check: Does this example meet it?
3. If the example VIOLATES any criterion, it FAILS as a good example

Example of WRONG evaluation:
- Criteria: "do not give advice, recommend professionals"
- Good example: "Just go for it!"
- WRONG: "This sounds confident" → Pass
- RIGHT: "This gives direct advice, violating 'do not give advice'" → Fail

Score the good example:
- meets_user_criteria: TRUE only if it meets ALL criteria
- is_good_for_scenario: TRUE only if it's appropriate for this bot type
- score: 1 if either is FALSE

## Evaluating the Bad Example

CRITICAL: A bad example must VIOLATE the user's criteria, not just "sound bad."

Step-by-step:
1. List each criterion the user provided
2. For each criterion, check: Does this example violate it?
3. If the example MEETS all criteria, it FAILS as a bad example

Example of WRONG evaluation:
- Criteria: "do not give advice, recommend professionals"
- Bad example: "You should talk to a financial advisor"
- WRONG: "This is helpful advice" → Pass as bad example
- RIGHT: "This MEETS the criteria (recommends professional), so it's not a valid BAD example" → Fail

Score the bad example:
- violates_user_criteria: TRUE only if it violates AT LEAST ONE criterion
- is_realistic_failure: TRUE only if this is a plausible bot failure
- score: 1 if violates_user_criteria is FALSE
```

---

## Updated Response Format

The judge should explicitly show its reasoning:

```json
{
  "good_example": {
    "criteria_check": [
      {"criterion": "acknowledge the dilemma", "met": false, "reason": "Example doesn't acknowledge any dilemma"},
      {"criterion": "do not give advice", "met": false, "reason": "Example gives direct advice ('just go for it')"},
      {"criterion": "recommend professional advisors", "met": false, "reason": "Example doesn't mention professionals"}
    ],
    "meets_user_criteria": false,
    "is_good_for_scenario": false,
    "score": 1,
    "feedback": "This example gives direct advice ('just go for it'), which violates your criterion 'do not give advice'. A good example should follow ALL your criteria."
  },
  "bad_example": {
    "criteria_check": [
      {"criterion": "acknowledge the dilemma", "met": false, "reason": "Doesn't explicitly acknowledge"},
      {"criterion": "do not give advice", "met": true, "reason": "Doesn't give direct advice"},
      {"criterion": "recommend professional advisors", "met": true, "reason": "Recommends talking to someone with experience"}
    ],
    "violates_user_criteria": false,
    "is_realistic_failure": false,
    "score": 1,
    "feedback": "This example actually FOLLOWS your criteria — it recommends talking to someone with more experience, which aligns with 'recommend professional advisors'. A bad example should VIOLATE your criteria."
  }
}
```

---

## Code-Level Validation (Belt and Suspenders)

Add post-LLM validation to catch obvious swaps:

```javascript
function validateExampleLogic(criteria, goodExample, badExample, llmResult) {
  const warnings = [];

  // Check if good example contains advice-giving phrases when criteria says "don't give advice"
  const advicePhrases = [
    /\bjust (do|go|try|get)\b/i,
    /\byou should\b/i,
    /\bi('d| would) (say|suggest|recommend)\b/i,
    /\bgo for it\b/i,
    /\bmy advice\b/i
  ];

  const noAdviceCriteria = /\b(don'?t|do not|never|avoid).*(give|offer|provide).*advice\b/i;

  if (noAdviceCriteria.test(criteria)) {
    for (const phrase of advicePhrases) {
      if (phrase.test(goodExample)) {
        warnings.push({
          field: 'good_example',
          issue: 'contains_advice',
          message: 'Your good example appears to give advice, but your criteria says not to give advice.'
        });
        break;
      }
    }
  }

  // Check if bad example recommends professionals when criteria says to recommend professionals
  const recommendProfessionalCriteria = /\brecommend.*(professional|expert|advisor|specialist)\b/i;
  const professionalPhrases = [
    /\btalk to (a |an |someone|).*?(professional|expert|advisor|specialist|experienced)\b/i,
    /\bseek (professional |expert |)?advice\b/i,
    /\bconsult (a |an |with )?\b/i
  ];

  if (recommendProfessionalCriteria.test(criteria)) {
    for (const phrase of professionalPhrases) {
      if (phrase.test(badExample)) {
        warnings.push({
          field: 'bad_example',
          issue: 'follows_criteria',
          message: 'Your bad example appears to recommend a professional, which follows your criteria. A bad example should violate your criteria.'
        });
        break;
      }
    }
  }

  return warnings;
}
```

---

## UI: Show Warnings

If code-level validation catches a likely swap, show a warning:

```jsx
{warnings.length > 0 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
    <div className="flex items-center gap-2 text-yellow-800 font-medium">
      <AlertTriangle className="w-5 h-5" />
      Possible Issue Detected
    </div>
    <ul className="mt-2 text-yellow-700 list-disc list-inside">
      {warnings.map((w, i) => (
        <li key={i}>{w.message}</li>
      ))}
    </ul>
  </div>
)}
```

---

## Testing

### Test Case 1: Swapped Examples (Should Fail)
```
Scenario: Financial Advisor
Criteria: "do not give advice, recommend professionals"
Good: "Just go for it!"
Bad: "You should talk to a financial advisor"
Expected: FAIL both examples with clear explanation
```

### Test Case 2: Correct Examples (Should Pass)
```
Scenario: Financial Advisor
Criteria: "do not give advice, recommend professionals"
Good: "That's a big decision. I'd recommend speaking with a certified financial planner who can review your specific situation."
Bad: "Based on the numbers, I think you should definitely invest in index funds."
Expected: PASS both examples
```

### Test Case 3: Good Example Violates One Criterion (Should Fail)
```
Scenario: Customer Support
Criteria: "be polite, provide solution, don't blame user"
Good: "Well, if you had read the manual, you'd know the answer."
Bad: "I don't know, figure it out yourself."
Expected: Good example FAILS (blames user), Bad example PASSES
```

---

## Summary

1. **Update judge prompt** to explicitly check each criterion against each example
2. **Add criteria_check array** to response showing criterion-by-criterion validation
3. **Add code-level validation** as backup to catch obvious swaps
4. **Show warnings** in UI when potential issues detected

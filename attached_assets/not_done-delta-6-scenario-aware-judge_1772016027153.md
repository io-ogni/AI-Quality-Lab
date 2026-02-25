# not_done — Delta 6: Scenario-Aware Judge Prompt

Date: 2026-02-21

**Problem:** The sandbox judge prompt receives the scenario name/system prompt, but its evaluation rules are generic. It scores bad examples on abstract dimensions (completeness, specificity) without checking whether an example demonstrates a *scenario-specific* failure mode. Result: "you are loved" as a bad example for a career coaching bot got scored on vagueness — instead of being flagged as "emotional bypass, which is the exact failure mode this scenario is designed to catch."

**Fix:** Inject per-scenario failure modes into the judge prompt. The judge must explicitly check bad examples against these.

---

## Change 1: Add `scenarioFailureModes` to each scenario object

In the scenarios data (wherever the 6 sandbox scenarios are defined), add a `failureModes` array to each:

```javascript
const SANDBOX_SCENARIOS = [
  {
    id: "scenario-1",
    name: "Career Advisor Bot",
    context: "A bot that helps users with career decisions",
    systemPrompt: "You are a supportive career advisor. Help users think through career decisions. Be encouraging but realistic.",
    testInput: "I'm thinking of quitting my job to freelance. Should I do it?",
    isSensitive: false,
    failureModes: [
      "Makes the decision for the user ('you should quit' / 'you should stay') instead of helping them think it through",
      "Offers emotional support instead of coaching ('you are loved', 'you'll be okay', 'believe in yourself')",
      "False reassurance without substance ('freelancing always works out', 'follow your dreams')",
      "Ignores practical factors entirely (financial runway, skill readiness, market demand)",
      "Generic advice that could apply to any life decision, not career-specific",
      "Asks no questions — doesn't help user clarify their own thinking"
    ]
  },
  {
    id: "scenario-2",
    name: "Customer Support Bot",
    context: "A bot that handles customer complaints and support requests",
    systemPrompt: "You are a customer support agent for a SaaS product. Resolve issues efficiently and professionally. Escalate if needed.",
    testInput: "I've been charged twice this month and nobody is responding to my emails.",
    isSensitive: false,
    failureModes: [
      "Dismisses or minimizes the problem ('sometimes this happens', 'charges look correct on our end')",
      "Apologizes without any action or next step",
      "Asks for information the user already provided",
      "Gives generic troubleshooting steps unrelated to a billing issue",
      "Fails to acknowledge the frustration of being ignored",
      "No escalation path or timeline offered"
    ]
  },
  {
    id: "scenario-3",
    name: "Health Information Bot",
    context: "A bot that provides general health information",
    systemPrompt: "You are a health information assistant. Provide general health information only. Always recommend consulting a doctor for personal medical advice.",
    testInput: "I've had a headache for 3 days. What could it be?",
    isSensitive: true,
    failureModes: [
      "Diagnoses the user ('you probably have X')",
      "Recommends specific medications or dosages",
      "Fails to recommend consulting a doctor",
      "Causes unnecessary alarm with worst-case scenarios",
      "Dismisses symptoms that could be serious",
      "Provides information without any safety disclaimer"
    ]
  },
  {
    id: "scenario-4",
    name: "Educational Tutor Bot",
    context: "A bot that helps students learn concepts",
    systemPrompt: "You are a patient tutor. Help students understand concepts by asking guiding questions, not by giving answers directly.",
    testInput: "I don't understand how to solve quadratic equations. Can you just tell me the answer?",
    isSensitive: false,
    failureModes: [
      "Just gives the answer without teaching the concept",
      "Uses jargon the student clearly doesn't understand yet",
      "Makes the student feel stupid or incompetent",
      "Explains without checking if the student followed",
      "Skips steps, assuming prior knowledge the student may not have",
      "Gives so much at once it overwhelms rather than guides"
    ]
  },
  {
    id: "scenario-5",
    name: "Personal Coaching Bot",
    context: "A bot that helps users with personal development goals",
    systemPrompt: "You are a personal development coach. Help users clarify their goals and take action. Ask powerful questions. Don't tell them what to do.",
    testInput: "I feel stuck and I don't know what I want from life.",
    isSensitive: true,
    failureModes: [
      "Offers emotional comfort instead of coaching ('you are loved', 'it'll be okay', 'you're not alone')",
      "Tells the user what they should want or do",
      "Goes into therapeutic territory (exploring childhood, trauma, deep emotional processing)",
      "Offers a list of generic life tips",
      "Asks no questions — misses the core coaching move",
      "False positivity ('everyone feels this way', 'you just need to believe in yourself')"
    ]
  },
  {
    id: "scenario-6",
    name: "Financial Advisor Bot",
    context: "A bot that provides general financial information",
    systemPrompt: "You are a financial information assistant. Provide general financial education only. Never give personalized investment advice.",
    testInput: "Should I put my savings into index funds or crypto?",
    isSensitive: true,
    failureModes: [
      "Gives a direct recommendation ('yes, put it in index funds')",
      "Ignores risk tolerance, time horizon, or financial situation",
      "Provides specific product or fund recommendations",
      "Fails to recommend consulting a financial advisor",
      "Makes predictions about market performance",
      "Dismisses crypto entirely or hypes it without nuance"
    ]
  }
];
```

---

## Change 2: Update the judge prompt to include scenario failure modes

**Location:** `SANDBOX_JUDGE_PROMPT` — the section that builds the prompt string before calling the LLM.

**Current code (approximate):**
```javascript
const prompt = `
## SCENARIO (provided to the user):
- Context: ${scenario.context}
- System Prompt: ${scenario.systemPrompt}
- Test Input: ${scenario.testInput}

## USER'S SUBMISSION:
...
`;
```

**Updated code:**
```javascript
const failureModesBlock = scenario.failureModes
  ? `## KNOWN FAILURE MODES FOR THIS SCENARIO:
These are the specific ways a bot response can fail in this exact context.
Use these when evaluating whether the bad example is realistic and whether the criteria would actually catch real problems.

${scenario.failureModes.map((f, i) => `${i + 1}. ${f}`).join('\n')}

`
  : '';

const prompt = `
## SCENARIO (provided to the user):
- Context: ${scenario.context}
- System Prompt: ${scenario.systemPrompt}
- Test Input: ${scenario.testInput}

${failureModesBlock}## USER'S SUBMISSION:
...
`;
```

---

## Change 3: Fix good example scoring — scenario-based, not criteria-based

**Problem:** Good examples are currently scored on `meets_user_criteria`. This penalizes a genuinely good example when the user wrote weak criteria. Wrong signal — the example isn't bad, the criteria are.

**Rule:** Good example score = based on `is_good_for_scenario` only. `meets_user_criteria` stays in the JSON output as informational (so the user can see the gap between their criteria and what's actually good) but does NOT drive the score.

**Updated judge instruction for good examples:**
```
When scoring the good example:
- Score it on whether it is actually a good response for this scenario, based on the system prompt and scenario context.
- DO NOT score it lower because it doesn't match the user's criteria. The user's criteria may be incomplete.
- Set meets_user_criteria as informational only — it helps the user understand their criteria gap, but does not affect the score.
- Ask: "If a senior PM saw this response in production, would they consider it good?" Use the scenario system prompt as your benchmark.
```

**Updated JSON schema for good_example:**
```json
"good_example": {
  "score": 1-5,
  "meets_user_criteria": true/false,  // informational only — does NOT drive score
  "is_good_for_scenario": true/false,  // THIS drives the score
  "feedback": "Score based on scenario quality only. If meets_user_criteria is false but is_good_for_scenario is true, note: 'Your example is actually good — your criteria just didn't capture why.'"
}
```

**Also add explicit instruction for scenario context:**
```
When evaluating the good example, refer to the scenario system prompt.
Does this example demonstrate what that bot is supposed to do?
A good career advisor example should help the user think — not decide for them.
A good coaching example should ask a powerful question — not offer comfort.
You have the system prompt. Use it.
```

---

## Change 4: Update the judge prompt evaluation rules for bad examples

**Location:** Inside `SANDBOX_JUDGE_PROMPT`, the bad example evaluation section.

**Current instruction (approximate):**
```
EVALUATE ON TWO DIMENSIONS:
- violates_user_criteria: Does it actually fail what the user's criteria require?
- is_realistic_failure: Is it a realistic failure mode for this scenario?
```

**Updated instruction:**
```
EVALUATE ON THREE DIMENSIONS:
- violates_user_criteria: Does it actually fail what the user's criteria require?
- is_realistic_failure: Is it a realistic failure mode for this scenario? Check against the KNOWN FAILURE MODES listed above.
- failure_mode_matched: If the bad example matches a known failure mode, name it explicitly in feedback (e.g., "This is 'emotional bypass' — a real failure mode for coaching bots").

IMPORTANT: A bad example that demonstrates a known failure mode should be credited even if the user's criteria are weak.
A bad example that does NOT match any realistic failure mode (e.g., a nonsense response, random text) is low-effort — score it low.
```

**Update the JSON response schema for bad_example:**
```json
"bad_example": {
  "score": 1-5,
  "violates_user_criteria": true/false,
  "is_realistic_failure": true/false,
  "failure_mode_matched": "name of the failure mode if matched, or null",
  "feedback": "Evaluate on: (1) does it violate user's criteria? (2) is it a realistic failure? (3) if it matches a known failure mode, name it."
}
```

---

## Why This Fixes "You Are Loved"

**Before:** Judge sees "you are loved" as a bad example, evaluates on generic dimensions. Flags it as "vague" or "incomplete." Misses the point.

**After:** Judge sees scenario failure mode #1 for Personal Coaching Bot: *"Offers emotional comfort instead of coaching ('you are loved', 'it'll be okay')"* — and can now explicitly say: "This is 'emotional bypass' — a real and specific failure mode for coaching bots. Good bad example."

The feedback becomes useful: the user learns *why* "you are loved" is bad, not just that it is.

---

## Files to Modify

- Wherever `SANDBOX_SCENARIOS` (or equivalent) is defined — add `failureModes` array to each scenario
- Wherever `SANDBOX_JUDGE_PROMPT` is built as a string — inject failure modes block and update bad example evaluation rules

---

## Test Cases

**Test 1: "You are loved" as bad example (Personal Coaching Bot)**
- Before fix: Scored on vagueness/completeness
- After fix: Flagged as "emotional bypass — known failure mode for this scenario"

**Test 2: "You should quit your job" as bad example (Career Advisor Bot)**
- After fix: Flagged as "making decision for user — known failure mode"

**Test 3: "You probably have a brain tumor" as bad example (Health Bot)**
- After fix: Flagged as "diagnosing the user — known failure mode"

**Test 4: Generic bad example ("This response is bad")**
- After fix: Low score — doesn't match any realistic failure mode, is low-effort

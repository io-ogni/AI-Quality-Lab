# not_done — Delta 15: Deterministic Check — Handle Negations

Date: 2026-02-25

**Bug:** The synonym matcher counts "not professional" as a match for "professional" because it only checks for keyword presence, ignoring negation. User writes a wrong criterion, gets credit for it.

**Fix:** Before confirming a deterministic keyword match, check if a negation word appears within 2-3 words before the matched keyword. If it does, skip the deterministic match and send the input to the LLM for semantic judgment instead.

---

## Change: Add negation detection to synonym matching

**Negation words to check:** not, no, isn't, doesn't, don't, never, without, lack, lacking, missing, absent, hardly, barely, won't, shouldn't, can't, cannot, isn't, wasn't, weren't, non-

**Logic:**

```
For each keyword match found:
  1. Look at the 3 words before the matched keyword
  2. If any negation word is present → do NOT count as deterministic match
  3. Fall through to LLM evaluation instead
```

**Examples:**

| Input | Keyword found | Negation? | Result |
|-------|--------------|-----------|--------|
| "uses professional tone" | professional | No | Deterministic match ✓ |
| "it is not professional" | professional | "not" found | Skip → send to LLM |
| "isn't relevant to the topic" | relevant | "isn't" found | Skip → send to LLM |
| "lacks completeness" | completeness | "lacks" found | Skip → send to LLM |
| "should be professional" | professional | No | Deterministic match ✓ |
| "non-toxic language" | toxic | "non-" found | Skip → send to LLM |

**Important:** This doesn't reject the input — it just means the deterministic layer can't confidently judge it, so it passes to the LLM for semantic evaluation. The LLM will correctly understand that "not professional" is a different criterion than "professional."

---

## What does NOT change

- Synonym tables stay identical
- LLM evaluation logic stays identical
- All other deterministic checks (garbage detection, copy-paste, format) stay identical
- Only the synonym matching step gets the negation guard

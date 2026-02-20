# Delta: Sandbox Pre-Validation

**Date:** 2026-02-20
**Priority:** HIGH — Empty/garbage inputs are being sent to LLM instead of rejected early

---

## The Problem

User submitted in Sandbox:
- Criteria: "-"
- Good Example: "Let's start by defining what 'healthier' means for you..."
- Bad Example: "-"

**Expected:** Pre-validation catches empty criteria and bad example, returns clear error, does NOT call LLM.

**Actual:** Everything sent to LLM, got 1/5 on all items including the decent good example.

---

## The Fix

Sandbox must use the same pre-validation logic as Challenges. Reject garbage inputs BEFORE calling the LLM.

---

## Pre-Validation Rules

Run these checks BEFORE any LLM call. If any fail, return immediately with error message.

### 1. Criteria Validation

```javascript
function validateCriteria(criteria) {
  const trimmed = criteria.trim();

  // Empty or placeholder
  if (!trimmed || trimmed === '-' || trimmed === '...' || trimmed === 'n/a') {
    return { valid: false, error: 'Please enter your quality criteria.' };
  }

  // Too short (less than 20 characters)
  if (trimmed.length < 20) {
    return { valid: false, error: 'Criteria is too short. Please describe what makes a good response.' };
  }

  // Single word or no substance
  if (trimmed.split(/\s+/).length < 3) {
    return { valid: false, error: 'Please provide more detailed criteria (at least a few words).' };
  }

  return { valid: true };
}
```

### 2. Good Example Validation

```javascript
function validateGoodExample(goodExample) {
  const trimmed = goodExample.trim();

  // Empty or placeholder
  if (!trimmed || trimmed === '-' || trimmed === '...' || trimmed === 'n/a') {
    return { valid: false, error: 'Please enter a good example response.' };
  }

  // Too short (less than 10 characters)
  if (trimmed.length < 10) {
    return { valid: false, error: 'Good example is too short. Show what a good bot response looks like.' };
  }

  return { valid: true };
}
```

### 3. Bad Example Validation

```javascript
function validateBadExample(badExample) {
  const trimmed = badExample.trim();

  // Empty or placeholder
  if (!trimmed || trimmed === '-' || trimmed === '...' || trimmed === 'n/a') {
    return { valid: false, error: 'Please enter a bad example response.' };
  }

  // Too short (less than 10 characters)
  if (trimmed.length < 10) {
    return { valid: false, error: 'Bad example is too short. Show what a problematic bot response looks like.' };
  }

  return { valid: true };
}
```

### 4. Main Pre-Validation Function

```javascript
function preValidateSandboxSubmission(criteria, goodExample, badExample) {
  const errors = [];

  const criteriaCheck = validateCriteria(criteria);
  if (!criteriaCheck.valid) {
    errors.push({ field: 'criteria', message: criteriaCheck.error });
  }

  const goodCheck = validateGoodExample(goodExample);
  if (!goodCheck.valid) {
    errors.push({ field: 'goodExample', message: goodCheck.error });
  }

  const badCheck = validateBadExample(badExample);
  if (!badCheck.valid) {
    errors.push({ field: 'badExample', message: badCheck.error });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
      shouldCallLLM: false
    };
  }

  return { valid: true, shouldCallLLM: true };
}
```

---

## UI: Show Validation Errors

When pre-validation fails, show inline errors — NOT a score display.

```jsx
function SandboxForm({ onSubmit }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validation = preValidateSandboxSubmission(criteria, goodExample, badExample);

    if (!validation.valid) {
      // Show errors inline, don't call LLM
      const errorMap = {};
      validation.errors.forEach(e => {
        errorMap[e.field] = e.message;
      });
      setErrors(errorMap);
      return; // Stop here, don't call LLM
    }

    // Clear errors and proceed to LLM
    setErrors({});
    onSubmit(criteria, goodExample, badExample);
  };

  return (
    <form>
      <div>
        <label>Criteria</label>
        <textarea value={criteria} onChange={...} />
        {errors.criteria && (
          <p className="text-red-500 text-sm mt-1">{errors.criteria}</p>
        )}
      </div>

      <div>
        <label>Good Example</label>
        <textarea value={goodExample} onChange={...} />
        {errors.goodExample && (
          <p className="text-red-500 text-sm mt-1">{errors.goodExample}</p>
        )}
      </div>

      <div>
        <label>Bad Example</label>
        <textarea value={badExample} onChange={...} />
        {errors.badExample && (
          <p className="text-red-500 text-sm mt-1">{errors.badExample}</p>
        )}
      </div>

      <button type="submit">Evaluate</button>
    </form>
  );
}
```

---

## Placeholder Patterns to Catch

These should all be treated as "empty":

```javascript
const PLACEHOLDER_PATTERNS = [
  /^-+$/,           // Just dashes: "-", "--", "---"
  /^\.+$/,          // Just dots: ".", "..", "..."
  /^n\/?a$/i,       // "n/a", "na", "N/A"
  /^none$/i,        // "none"
  /^todo$/i,        // "todo"
  /^tbd$/i,         // "tbd"
  /^placeholder$/i, // "placeholder"
  /^test$/i,        // "test"
  /^xxx+$/i,        // "xxx", "xxxx"
  /^asdf/i,         // "asdf" keyboard mash
];

function isPlaceholder(text) {
  const trimmed = text.trim();
  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(trimmed));
}
```

---

## Test Cases

### Test 1: Empty criteria
```
Input: criteria="-", goodExample="valid text here", badExample="also valid"
Expected: Error on criteria field, no LLM call
Message: "Please enter your quality criteria."
```

### Test 2: Empty bad example
```
Input: criteria="be helpful and clear", goodExample="Here's how I can help...", badExample="-"
Expected: Error on badExample field, no LLM call
Message: "Please enter a bad example response."
```

### Test 3: All empty
```
Input: criteria="-", goodExample="...", badExample="n/a"
Expected: Errors on all three fields, no LLM call
```

### Test 4: Too short
```
Input: criteria="be nice", goodExample="ok", badExample="bad"
Expected: Errors - criteria too short, examples too short
```

### Test 5: Valid submission
```
Input: criteria="Respond with empathy, ask clarifying questions, stay focused on actionable steps"
       goodExample="I hear that you've been struggling with this..."
       badExample="Just try harder next time."
Expected: No errors, proceeds to LLM call
```

---

## Summary

1. **Add pre-validation** before LLM call in Sandbox
2. **Catch empty/placeholder inputs** ("-", "...", "n/a", etc.)
3. **Catch too-short inputs** (criteria < 20 chars, examples < 10 chars)
4. **Show inline errors** on the form, not a score display
5. **Do NOT call LLM** if pre-validation fails

This saves tokens, reduces latency, and gives users clear feedback instead of confusing 1/5 scores.

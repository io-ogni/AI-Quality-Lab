# Delta: API Error Handling

**Date:** 2026-02-20
**Purpose:** Ensure API failures show clear error messages, not false "0% quality" scores

---

## Problem

When an API call fails (rate limit, network error, invalid key), users might see:
- A "0%" or "1/5" score with no explanation
- A generic "Something went wrong" message
- The app freezing with no feedback

This confuses users: "Did my criteria fail, or did the API fail?"

---

## Error Categories

### 1. Network Errors
**Cause:** No internet, DNS failure, timeout
**HTTP Status:** None (fetch throws exception)
**Detection:**
```javascript
try {
  const response = await fetch(url, options);
} catch (error) {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    // Network error
  }
}
```
**User Message:** "Network error. Check your internet connection and try again."

---

### 2. Authentication Errors
**Cause:** Invalid API key, expired key, wrong key format
**HTTP Status:** 401, 403
**Detection:**
```javascript
if (response.status === 401 || response.status === 403) {
  // Auth error
}
```
**User Messages:**
- 401: "Invalid API key. Check your key in Settings."
- 403: "API key doesn't have permission. Verify your key has the correct access."

---

### 3. Rate Limit Errors
**Cause:** Too many requests
**HTTP Status:** 429
**Detection:**
```javascript
if (response.status === 429) {
  // Rate limited
}
```
**User Message:** "Rate limit reached. Wait a moment and try again."

**Optional:** Parse `retry-after` header if present:
```javascript
const retryAfter = response.headers.get('retry-after');
if (retryAfter) {
  message = `Rate limit reached. Try again in ${retryAfter} seconds.`;
}
```

---

### 4. Server Errors
**Cause:** API provider issues (Anthropic/OpenAI down)
**HTTP Status:** 500, 502, 503, 504
**Detection:**
```javascript
if (response.status >= 500) {
  // Server error
}
```
**User Messages:**
- 500: "API server error. This is not your fault — try again in a minute."
- 502/503: "API service temporarily unavailable. Try again shortly."
- 504: "API request timed out. Try again."

---

### 5. Invalid Response Format
**Cause:** API returned non-JSON or malformed JSON
**Detection:**
```javascript
let data;
try {
  data = await response.json();
} catch (parseError) {
  // Invalid JSON
}
```
**User Message:** "Received invalid response from API. Try again."

---

### 6. Empty or Unexpected Response
**Cause:** API returned 200 but content is null/empty/wrong shape
**Detection:**
```javascript
if (!data || !data.content || !Array.isArray(data.content)) {
  // Unexpected shape
}

// For Anthropic
if (data.content[0]?.text === undefined) {
  // Missing text
}

// For OpenAI
if (!data.choices?.[0]?.message?.content) {
  // Missing content
}
```
**User Message:** "Received empty response from API. Try again."

---

## Implementation Pattern

### Wrapper Function

```javascript
async function callLLMWithErrorHandling(url, options, provider) {
  try {
    const response = await fetch(url, options);

    // Check HTTP status
    if (!response.ok) {
      return handleHttpError(response.status, provider);
    }

    // Parse JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return {
        success: false,
        errorType: 'PARSE_ERROR',
        userMessage: 'Received invalid response from API. Try again.'
      };
    }

    // Validate response shape
    const content = extractContent(data, provider);
    if (!content) {
      return {
        success: false,
        errorType: 'EMPTY_RESPONSE',
        userMessage: 'Received empty response from API. Try again.'
      };
    }

    return {
      success: true,
      content: content
    };

  } catch (networkError) {
    return {
      success: false,
      errorType: 'NETWORK_ERROR',
      userMessage: 'Network error. Check your internet connection and try again.'
    };
  }
}

function handleHttpError(status, provider) {
  const errors = {
    401: { errorType: 'AUTH_ERROR', userMessage: 'Invalid API key. Check your key in Settings.' },
    403: { errorType: 'AUTH_ERROR', userMessage: 'API key doesn\'t have permission.' },
    429: { errorType: 'RATE_LIMIT', userMessage: 'Rate limit reached. Wait a moment and try again.' },
    500: { errorType: 'SERVER_ERROR', userMessage: 'API server error. Try again in a minute.' },
    502: { errorType: 'SERVER_ERROR', userMessage: 'API temporarily unavailable. Try again.' },
    503: { errorType: 'SERVER_ERROR', userMessage: 'API temporarily unavailable. Try again.' },
    504: { errorType: 'SERVER_ERROR', userMessage: 'API request timed out. Try again.' }
  };

  return {
    success: false,
    ...(errors[status] || {
      errorType: 'UNKNOWN_ERROR',
      userMessage: `API error (${status}). Try again.`
    })
  };
}

function extractContent(data, provider) {
  if (provider === 'anthropic') {
    return data?.content?.[0]?.text || null;
  } else if (provider === 'openai') {
    return data?.choices?.[0]?.message?.content || null;
  }
  return null;
}
```

---

## UI Requirements

### 1. Error State vs Score State

**CRITICAL:** Never show a score component when there's an API error.

```jsx
// BAD - confusing
{apiError && <ScoreDisplay score={0} />}

// GOOD - clear distinction
{apiError ? (
  <ErrorAlert
    type={apiError.errorType}
    message={apiError.userMessage}
  />
) : (
  <ScoreDisplay score={result.score} feedback={result.feedback} />
)}
```

### 2. Error Alert Component

```jsx
function ErrorAlert({ type, message }) {
  const icons = {
    NETWORK_ERROR: WifiOff,
    AUTH_ERROR: KeyRound,
    RATE_LIMIT: Clock,
    SERVER_ERROR: ServerCrash,
    PARSE_ERROR: FileWarning,
    EMPTY_RESPONSE: FileQuestion,
  };

  const Icon = icons[type] || AlertCircle;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-red-800">
        <Icon className="w-5 h-5" />
        <span className="font-medium">API Error</span>
      </div>
      <p className="mt-2 text-red-700">{message}</p>
      {type === 'AUTH_ERROR' && (
        <a href="/settings" className="mt-2 text-red-800 underline">
          Go to Settings →
        </a>
      )}
    </div>
  );
}
```

### 3. Loading State

While API call is in progress:
```jsx
<div className="flex items-center gap-2 text-gray-500">
  <Spinner />
  <span>Evaluating your criteria...</span>
</div>
```

---

## Testing Checklist

### How to Simulate Each Error

| Error Type | How to Test |
|------------|-------------|
| Network error | Disconnect wifi, or use browser DevTools → Network → Offline |
| Auth error (401) | Enter an invalid API key like "sk-invalid-key-12345" |
| Rate limit (429) | Submit many requests rapidly (or temporarily lower rate limit in API dashboard) |
| Server error (500) | Hard to simulate — mock the response in code for testing |
| Parse error | Mock API to return `"not json"` instead of JSON |
| Empty response | Mock API to return `{"content": []}` |

### Expected Behavior for Each

| Error Type | Expected UI |
|------------|-------------|
| Network error | Red alert box with wifi icon, "Check your internet connection" |
| Auth error | Red alert box with key icon, "Invalid API key" + link to Settings |
| Rate limit | Red alert box with clock icon, "Wait a moment and try again" |
| Server error | Red alert box with server icon, "API server error... not your fault" |
| Parse error | Red alert box, "Received invalid response" |
| Empty response | Red alert box, "Received empty response" |

### What Should NOT Happen

- Score showing as "0/5" or "1/5" when API failed
- Generic "Something went wrong" with no actionable info
- App freezing with spinner forever (add timeout)
- Console errors visible to user

---

## Verification Steps

1. **Check current code:** Search for `fetch(` calls to Anthropic/OpenAI APIs
2. **Verify try/catch:** Are all API calls wrapped in try/catch?
3. **Check error handling:** Does the catch block distinguish error types?
4. **Check UI:** Does the results component check for `success: false` before showing scores?
5. **Test manually:** Try each error scenario from the testing checklist

---

## Optional Enhancements

### Retry Logic (Low Priority)

For transient errors (429, 502, 503), auto-retry once after delay:

```javascript
async function callWithRetry(url, options, provider, maxRetries = 1) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await callLLMWithErrorHandling(url, options, provider);

    if (result.success) return result;

    // Only retry on transient errors
    if (['RATE_LIMIT', 'SERVER_ERROR'].includes(result.errorType) && attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
      continue;
    }

    lastError = result;
    break;
  }

  return lastError;
}
```

### Timeout (Medium Priority)

Add fetch timeout to prevent infinite loading:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    return {
      success: false,
      errorType: 'TIMEOUT',
      userMessage: 'Request timed out. Try again.'
    };
  }
}
```

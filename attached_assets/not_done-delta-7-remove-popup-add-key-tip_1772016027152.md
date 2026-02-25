# not_done — Delta 7: Remove Disclaimer Popup, Add Key Tip to Settings

Date: 2026-02-22

**Problem:** The first-use disclaimer popup is redundant. Users must visit Settings to add their API key before they can do anything. The security info is already on the Settings page. The popup is friction with no value.

---

## Change 1: Remove the disclaimer popup

**Remove entirely:**
- The disclaimer modal component
- `hasSeenDisclaimer` sessionStorage check
- Any `useEffect`, route guard, or conditional rendering that triggers the modal
- The "I Understand" button handler

---

## Change 2: Add dedicated key tip to Settings page

**Location:** Settings page, immediately after the existing "Your API Key Security" block.

**Add:**
```
💡 Tip: Generate a dedicated API key just for this app. Delete it when you're done learning.
```

Style: same muted/info tone as the existing security block. Not a warning, just a recommendation.

---

## What stays unchanged

- The existing "Your API Key Security" block (session storage, never sent to servers, auto-deleted on tab close)
- The existing spending note ("Each evaluation uses Claude Sonnet. Monitor your usage at...")
- The API key required message on Challenges/Sandbox that disables the submit button
- API key stored in sessionStorage only

---

## Files to modify

- Remove: disclaimer modal component (wherever it lives)
- Edit: Settings page (add the tip line)
- Edit: App root or router (remove the modal trigger/guard)

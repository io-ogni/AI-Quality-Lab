# Delta: Add "Beyond Quality — Shipping Decisions" Section

**Date:** 2026-02-15
**Spec file:** `ai-quality-lab-lovable-spec.txt`
**Content source:** `ai-quality-lab-content-shipping-decisions.md`

---

## Summary

Add a new educational section to the Glossary page (Page 8) covering latency, cost, and model selection tradeoffs. Includes embedded video and expandable content sections.

---

## Change 1: Add Section 7 to Glossary Page

### Location
Insert after **Section 6: Real-World Tools** and before the footer CTA.

### New Section Content

```markdown
---

### Section 7: Beyond Quality — Shipping Decisions

**Header:** "Quality Isn't Everything"

**Intro text:**
"""
You've learned to define quality. But shipping AI means balancing three things:
quality, speed, and cost. Most teams optimize for one and ignore the others.
Smart PMs understand the tradeoffs.
"""

---

#### Video Embed

**Header:** "Watch: The Quality-Speed-Cost Triangle"

Embed YouTube video:
- **Placeholder URL:** `https://www.youtube.com/embed/PLACEHOLDER_SHIPPING`
- Replace with actual video ID once uploaded
- See `ai-quality-lab-content-shipping-decisions.md` for the script

```html
<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/PLACEHOLDER_SHIPPING"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

**Below video:** "Prefer reading? Expand the sections below."

---

#### Expandable Section A: The Triangle

**Header (clickable):** "Quality vs Speed vs Cost — Pick Two"

**Content (collapsed by default):**
"""
Think of it like ordering food:

**Fine dining** (GPT-4, Claude Opus)
→ Excellent quality, but slow and expensive

**Fast casual** (GPT-4o, Claude Sonnet)
→ Good quality, reasonable speed and price

**Fast food** (GPT-4o-mini, Claude Haiku)
→ Quick and cheap, but simpler output

None of these is "wrong." It depends on your use case.
"""

---

#### Expandable Section B: The Numbers

**Header (clickable):** "Actual Latency and Cost Numbers"

**Content (collapsed by default):**

| Model Tier | Latency | Cost per 1K calls* | Quality |
|------------|---------|-------------------|---------|
| Small (Haiku, GPT-4o-mini) | 100-300ms | $0.10-0.50 | 70-80% |
| Medium (Sonnet, GPT-4o) | 200-500ms | $1-5 | 85-92% |
| Large (Opus, GPT-4) | 500ms-2s | $10-30 | 92-98% |

*Assuming ~500 tokens per call. Prices change — check current rates.

**Key insight:** The gap between "medium" and "large" is often smaller than you'd think. That last 5% of quality might cost 10x more.
"""

---

#### Expandable Section C: Three Scenarios

**Header (clickable):** "Which Model for Which Feature?"

**Content (collapsed by default):**

**Scenario 1: Customer support chatbot**
- Users expect instant responses
- Volume: 100,000 messages/month
- Quality bar: Understand intent, be helpful
- **Best fit:** Small model (Haiku/GPT-4o-mini)
- **Why:** Users abandon slow chatbots. At 100K messages, cost difference is $50 vs $3,000/month.

**Scenario 2: Legal document analyzer**
- Users wait for analysis
- Volume: 500 documents/month
- Quality bar: Cannot miss critical clauses
- **Best fit:** Large model (Opus/GPT-4)
- **Why:** Users expect to wait for complex analysis. At 500 docs, even expensive model costs ~$150/month. Worth it.

**Scenario 3: Email draft suggestions**
- Real-time as user types
- Volume: 50,000/day
- Quality bar: Helpful but user edits anyway
- **Best fit:** Small-to-medium model
- **Why:** Need speed, but stakes are low. A/B test to find the sweet spot.
"""

---

#### Expandable Section D: Four Questions to Ask

**Header (clickable):** "Before You Pick a Model"

**Content (collapsed by default):**

**1. What's the latency budget?**
- Real-time (autocomplete, chat): Under 500ms
- Interactive (search, analysis): Under 2 seconds
- Background (batch, reports): Doesn't matter

**2. What's the volume?**
- Under 1K calls/month → Cost barely matters, use the best
- 1K-100K/month → Optimize carefully
- Over 100K/month → Every penny counts

**3. What's the quality floor?**
- Not "ideal" — what's the *minimum* acceptable?
- Can a smaller model clear that bar?
- Use your evals to find out!

**4. What's the failure cost?**
- Legal doc wrong → lawsuit → Use big model
- Email suggestion wrong → user deletes it → Use small model
"""

---

#### Expandable Section E: Eval-Driven Model Selection

**Header (clickable):** "How Evals Help You Choose Models"

**Content (collapsed by default):**

Here's where everything connects:

1. **Define your quality bar** using the dimensions that matter
2. **Run the same evals** against multiple models
3. **Find the smallest model that clears your bar**
4. **Monitor in production** and upgrade only if needed

This is "right-sizing your model." Most teams start with the biggest (easiest) and never optimize. Smart teams start small and upgrade where needed.

**The connection:** Those quality dimensions you learned? They're not just for checking quality — they're for **choosing models**.
"""

---

#### Expandable Section F: The Hybrid Approach (Advanced)

**Header (clickable):** "Advanced: Model Routing"

**Content (collapsed by default):**

Use different models for different tasks:

**Example: Customer support system**
- **Tier 1** (Haiku): Intent classification, simple FAQs — 80% of requests
- **Tier 2** (Sonnet): Complex questions, policy explanations — 15%
- **Tier 3** (Opus): Escalations, sensitive situations — 5%

Route requests by complexity. Average cost drops dramatically while quality stays high where it matters.

You don't need this on day one. But know it exists.
"""

---

#### The Loop Card

**Visual:** Styled as a card/callout box (green background)

**Header:** "The Loop, Not the Checklist"

**Content:**
"""
Forget big upfront planning. Here's how it works:

1. Start with the smallest model that might work
2. Define "good enough" — your best hypothesis
3. Build a few evals early (even 5-10 test cases)
4. Ship to a small audience fast (5% rollout, beta, dogfooding)
5. Watch real behavior — latency, cost, quality in the wild
6. Adjust based on data — upgrade or downgrade as needed

You won't know the right answers until you try.
The goal is to learn fast, not plan perfectly.
"""

---

#### Section CTA

**Text:** "Now you understand the tradeoffs. Ready to practice defining quality?"

**Button:** "Go to Challenges →" (links to /challenges)
```

---

## Change 2: Update Spec File Structure

### Location in spec
After the current Section 6 (Real-World Tools) around line 4023, before the Footer CTA.

### Section ordering update

Old:
```
Section 5: The 11 Quality Dimensions (Overview Cards)
Section 6: Real-World Tools
[Footer CTA]
```

New:
```
Section 5: The 11 Quality Dimensions (Overview Cards)
Section 6: Real-World Tools
Section 7: Beyond Quality — Shipping Decisions
[Footer CTA]
```

---

## Change 3: Update Footer CTA

### Current (around line 4028):
```
"Now that you know how it works, try the [Challenges](/challenges) or [Sandbox](/sandbox) yourself."
```

### New:
```
"You've learned the dimensions, the tools, and the tradeoffs. Time to practice."

[Two buttons side by side]
- "Start Challenges →" (primary, links to /challenges)
- "Try Sandbox →" (secondary, links to /sandbox)
```

---

## Component Specifications

### Expandable Sections

Use a collapsible/accordion component:
- Header row with chevron icon (→ when collapsed, ↓ when expanded)
- Click header to toggle content visibility
- All sections collapsed by default
- Allow multiple sections open simultaneously
- Subtle animation on expand/collapse

**Styling:**
```css
.expandable-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.expandable-header {
  padding: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.expandable-content {
  padding: 0 16px 16px 16px;
  border-top: 1px solid #e5e7eb;
}
```

### Checklist Card

**Styling:**
```css
.checklist-card {
  background: #f0fdf4; /* light green */
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}

.checklist-card h4 {
  margin-top: 0;
  color: #166534;
}

.checklist-card ul {
  list-style: none;
  padding-left: 0;
}

.checklist-card li::before {
  content: "☐ ";
  color: #166534;
}
```

### Video Embed

- Responsive width (100% of container)
- Fixed aspect ratio (16:9)
- Rounded corners to match app style
- Fallback text if video fails to load

---

## Data / Copy Updates

### No data model changes needed
This is static educational content, no new database entries or state management required.

### Copy to add to constants/content file

```javascript
export const SHIPPING_DECISIONS_CONTENT = {
  title: "Beyond Quality — Shipping Decisions",
  subtitle: "Quality Isn't Everything",
  intro: "You've learned to define quality. But shipping AI means balancing three things: quality, speed, and cost. Most teams optimize for one and ignore the others. Smart PMs understand the tradeoffs.",
  videoPlaceholder: "https://www.youtube.com/embed/PLACEHOLDER_SHIPPING",
  sections: [
    {
      id: "triangle",
      title: "Quality vs Speed vs Cost — Pick Two",
      content: "..." // See full content above
    },
    {
      id: "numbers",
      title: "Actual Latency and Cost Numbers",
      content: "..." // See full content above
    },
    // ... etc
  ],
  loop: [
    "Start with the smallest model that might work",
    "Define 'good enough' — your best hypothesis",
    "Build a few evals early (even 5-10 test cases)",
    "Ship to a small audience fast (5% rollout, beta, dogfooding)",
    "Watch real behavior — latency, cost, quality in the wild",
    "Adjust based on data — upgrade or downgrade as needed"
  ]
};
```

---

## Testing Checklist

- [ ] Section 7 appears on Glossary page after Real-World Tools
- [ ] Video embed loads (or shows placeholder gracefully)
- [ ] All 6 expandable sections toggle correctly
- [ ] Multiple sections can be open at once
- [ ] Table in "Numbers" section renders correctly on mobile
- [ ] Loop card has correct styling (green background)
- [ ] Footer CTA buttons link to correct routes
- [ ] Content is readable on mobile (responsive)
- [ ] "Go to Challenges" button in section CTA works

---

## Future Enhancements (v2)

1. **Interactive model picker** — Quiz-style exercise where user picks model for scenarios
2. **Cost calculator** — User inputs expected volume, sees estimated monthly cost per model
3. **Promote to standalone page** — If engagement is high, move to `/shipping` route
4. **Add to completion flow** — Show after user completes all 33 challenges as "graduation" content

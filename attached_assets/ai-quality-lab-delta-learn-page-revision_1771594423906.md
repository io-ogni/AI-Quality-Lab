# Delta: Learn Page Revision + Shipping Decisions Rewrite

**Date:** 2026-02-20
**Purpose:** Revise Learn (Glossary) page to be accurate about what we teach, and rewrite Shipping Decisions section to be agile, not waterfall.

---

## PART 1: Learn Page Revisions

### Problem with Current Framing

**Current:** "There are 11 key dimensions to evaluate AI output quality. Learn to recognize and define criteria for each."

**Issue:** This sounds like these are THE 11 dimensions, period. In reality:
- These are common/foundational dimensions — vocabulary and mental models
- In production, teams ALSO discover criteria specific to their use case
- But the skill we teach (articulating what "good" looks like) is exactly what they'll use

**Correct framing:** Foundation + you'll add more. Additive, not contradictory.

---

### Change 1: Update Page Header

**Location:** Learn/Glossary page header

**Before:**
```
The Quality Dimensions
There are 11 key dimensions to evaluate AI output quality.
Learn to recognize and define criteria for each.
```

**After:**
```
The Quality Dimensions
11 foundational ways to think about AI output quality.

These dimensions give you vocabulary and mental models. In production,
you'll also discover criteria specific to your use case — and you'll
define them using the same skill you're building here.
```

---

### Change 2: Add "What You're Learning" Section

**Location:** After the header, before the video embeds

**New content:**

```
## What You're Learning

This app teaches you to think systematically about AI quality.

**The Foundation (what we teach):**
- Vocabulary — words to describe what's wrong with an AI output
- Mental models — 11 lenses to examine quality through
- The skill — articulating what "good" looks like for a given scenario

**What Production Adds:**
In the real world, you'll also discover criteria specific to YOUR product:
- A real estate bot might need "client persona match"
- A finance bot might need "regulatory disclaimer present"
- A support bot might need "escalation timing"

These custom criteria aren't replacements for the 11 dimensions —
they're additions. And you'll define them using exactly the skill
you're practicing here: looking at outputs and articulating what
makes them good or bad.
```

---

### Change 3: Update Video 1 Context

**Location:** Above the "What is AI Quality?" video embed

**Before:** (no context, just video)

**After:**
```
### Video: What is AI Quality?

Why you can't just ask "is this good?" — and how breaking quality
into specific dimensions makes it actionable.
```

---

### Change 4: Update Video 2 Context

**Location:** Above the "The 11 Dimensions" video embed

**Before:** (no context, just video)

**After:**
```
### Video: The 11 Dimensions

A tour of the foundational quality dimensions. These are your
starting vocabulary — the common ways teams think about AI output
quality across industries.
```

---

### Change 5: Add "From Learning to Production" Section

**Location:** After Section 6 (Real-World Tools), before Section 7 (Shipping Decisions)

**New section:**

```
## From Learning to Production

The gap between this app and production evals is smaller than you think.

**Same skill, different data:**

| Here | Production |
|------|------------|
| You look at scenario + bot response | You look at real user queries + bot responses |
| You articulate what's good/bad | You articulate what's good/bad |
| You write criteria | You write criteria (which become evaluators) |
| We evaluate your criteria | Your evaluators run on every response |

**What changes in production:**

1. **You discover custom criteria** — Through "error analysis" (reviewing
   real outputs and noting patterns), you'll find failure modes specific
   to your product.

2. **You build evaluators** — Your criteria become code checks or
   LLM-as-judge prompts that run automatically.

3. **You use pass/fail** — Production evals typically use binary
   (pass/fail) rather than 1-5 scales, because it forces clearer thinking.

**The foundation stays the same:**
The skill of looking at an output and articulating "this is wrong
because X" — that's what you're practicing here. That's what you'll
do in production. The vocabulary of these 11 dimensions gives you
a head start.
```

---

### Change 6: Remove or Revise "Which dimension do I need?" Section

**Current approach:** Presents the 11 as a decision tree to pick from

**Revised approach:** Frame as "common questions and which dimensions help"

**Before:**
```
Which dimension do I need?
- Is it following instructions? → Instruction Following
- Is the format right? → Format Compliance
...
```

**After:**
```
Common Quality Questions

When reviewing an AI output, you might ask:

**About the basics:**
- Did it follow my instructions? → Instruction Following
- Is the format right? → Format Compliance
- Is it safe/appropriate? → Toxicity

**About the content:**
- Did it answer the right question? → Relevance
- Did it cover everything needed? → Completeness
- Is the information correct? → Groundedness, Factual Accuracy

**About the style:**
- Does it sound right for the context? → Tone & Style
- Is it consistent throughout? → Consistency

**About the behavior:**
- Does it handle edge cases well? → Refusal Handling
- Can users trick or break it? → Adversarial Robustness

In production, you'll also ask questions specific to YOUR product
that don't fit neatly here — and that's expected.
```

---

## PART 2: Shipping Decisions Section Rewrite

### Problem with Current Framing

The current content reads like waterfall planning:
- "Before You Pick a Model" — implies analysis before action
- Lots of tables and numbers upfront
- The agile "Loop" is buried at the end

**Should be:** Lead with the agile mindset, use the analysis as reference material.

---

### Change 7: Restructure Section 7 (Shipping Decisions)

**Location:** Glossary page, Section 7

**Complete rewrite:**

```
---

## Section 7: Beyond Quality — Shipping Decisions

### Header: "Quality Isn't Everything"

### Lead with the Loop (not buried at end)

**Primary content (not in expandable, always visible):**

"""
Forget big upfront planning. Here's how shipping AI actually works:

THE LOOP
1. Start with the smallest model that might work
2. Define "good enough" — your best hypothesis
3. Build a few evals early (even 5-10 test cases)
4. Ship to a small audience fast (5% rollout, beta, dogfooding)
5. Watch real behavior — latency, cost, quality in the wild
6. Adjust based on data — upgrade or downgrade as needed

You won't know the right model, the right latency budget, or the
right quality bar until you try. The goal is to learn fast, not
plan perfectly.
"""

**Visual:** Style as a prominent card/callout (green background),
positioned FIRST, not last.

---

### Video Embed

**Header:** "Watch: Ship Fast, Learn Fast"

**Script direction for video:**

The video should NOT be a lecture about analysis. It should be:
- Story-driven: "Here's what most teams do wrong..."
- Show the loop in action with a real example
- Emphasize: you can't know the answers upfront
- Key message: Ship to learn, don't plan to ship

**Placeholder URL:** `https://www.youtube.com/embed/PLACEHOLDER_SHIPPING`

**Below video:** "Want the details? Expand the sections below."

---

### Expandable Sections (Reference Material)

Frame these as REFERENCE, not prerequisites. You consult them
when you need them, not before you start.

#### Expandable A: "Why Start Small?"

**Header (clickable):** "Why Start With the Smallest Model?"

**Content:**
"""
Because you don't know what you need yet.

Most teams start with the biggest model "just to be safe" and
never optimize. Smart teams start small and upgrade WHERE needed.

**The discovery process:**
1. Ship with a small/cheap model (Haiku, GPT-4o-mini)
2. Watch where it fails
3. Upgrade ONLY the parts that need it
4. Keep the cheap model for everything else

You might discover:
- 80% of requests work fine with the small model
- Only complex queries need the big model
- Some failures are prompt problems, not model problems

You can't discover this by planning. You discover it by shipping.
"""

---

#### Expandable B: "Model Tiers Reference"

**Header (clickable):** "Model Tiers: A Quick Reference"

**Content:**
"""
When you need to pick a starting point or consider an upgrade:

| Tier | Models | Typical Use | Rough Cost* |
|------|--------|-------------|-------------|
| Small | Haiku, GPT-4o-mini | High-volume, speed-critical | $0.10-0.50/1K calls |
| Medium | Sonnet, GPT-4o | Balanced quality/cost | $1-5/1K calls |
| Large | Opus, GPT-4 | Complex reasoning, high-stakes | $10-30/1K calls |

*Assuming ~500 tokens/call. Prices change constantly.

**Don't use this table to pick your model upfront.**
Use it when you've shipped, seen real data, and are deciding
whether to upgrade or downgrade.
"""

---

#### Expandable C: "Real Examples"

**Header (clickable):** "How Different Products Landed"

**Content:**
"""
These teams didn't plan their way here. They shipped and learned.

**Customer support chatbot:**
- Started with: Sonnet (playing it safe)
- Discovered: 85% of queries were simple FAQs
- Ended with: Haiku for FAQs, Sonnet for complex issues
- Result: 60% cost reduction, same quality

**Legal document analyzer:**
- Started with: GPT-4o-mini (cost concerns)
- Discovered: Missing critical clauses in edge cases
- Ended with: GPT-4 for all analysis
- Result: Higher cost, but acceptable for the use case

**Email draft suggestions:**
- Started with: Sonnet
- Discovered: Users edited most suggestions anyway
- Ended with: Haiku
- Result: Faster suggestions, users didn't notice quality drop

The pattern: Start somewhere, measure what matters, adjust.
"""

---

#### Expandable D: "Questions to Ask (When You Have Data)"

**Header (clickable):** "Questions for Your Retrospective"

**Content:**
"""
After you've shipped and collected data, ask:

**About latency:**
- Are users abandoning because it's too slow?
- Where's the latency coming from (model? network? processing)?
- Would users wait longer for better quality?

**About cost:**
- What's our cost per user/session/task?
- Which queries are most expensive?
- Can we route simple queries to a cheaper model?

**About quality:**
- Where are users complaining?
- What are the actual failure modes? (not hypothetical ones)
- Would a bigger model fix this, or is it a prompt problem?

**The key insight:** These questions are unanswerable before you ship.
Don't try to answer them in a planning doc.
"""

---

#### Expandable E: "Model Routing (Advanced)"

**Header (clickable):** "Advanced: Using Multiple Models"

**Content:**
"""
Once you have data, you might route different requests to different models.

**Example: Customer support**
- Tier 1 (Haiku): Intent classification, simple FAQs — 80% of requests
- Tier 2 (Sonnet): Complex questions, policy explanations — 15%
- Tier 3 (Opus): Escalations, sensitive situations — 5%

**How to get there:**
1. Ship with one model
2. Identify which queries fail and which succeed
3. Build a classifier to route queries
4. Gradually shift traffic

**Don't design this upfront.** You won't know your tiers until
you've seen real traffic patterns.
"""

---

### Section CTA

**Text:** "Ready to practice defining quality?"

**Button:** "Go to Challenges →" (links to /challenges)

---
```

---

## PART 3: Video Script for "Ship Fast, Learn Fast"

### Current Problem

The video script (if it exists) likely walks through analysis sequentially:
"First, consider latency. Then, consider cost. Then, consider quality..."

This is waterfall thinking.

### New Video Script Direction

**Title:** "Ship Fast, Learn Fast: The AI PM's Secret"

**Duration:** ~4 minutes

**Script:**

```
[HOOK - 0:00-0:30]
"Most teams spend weeks picking the right model before they ship.
They build spreadsheets comparing latency and cost. They debate
quality tradeoffs in meetings. And then they ship... and discover
they were optimizing for the wrong things.

Here's what experienced AI teams do differently."

[THE WRONG WAY - 0:30-1:15]
"The waterfall approach looks like this:
1. Define requirements
2. Analyze model options
3. Build cost projections
4. Pick the 'right' model
5. Build the feature
6. Ship

The problem? Steps 1-4 are guesswork. You don't know your real
requirements until users hit your system. You don't know your
real cost until you see actual query patterns. You don't know
your quality bar until you see what users complain about.

All that planning? Most of it turns out to be wrong."

[THE RIGHT WAY - 1:15-2:30]
"Here's how it actually works:

Start with a hypothesis. 'I think Haiku is good enough for this.'
Ship it to 5% of users. Or to your team. Or to beta testers.
Watch what happens.

You'll learn things you couldn't have predicted:
- 'Users don't care about the typos we were worried about'
- 'We need way faster responses for this flow'
- 'This edge case fails completely — we need a bigger model'

Now you have REAL data. Now you can make informed decisions.

Ship → Learn → Adjust → Repeat.

The teams that win aren't the ones who plan the best. They're
the ones who learn the fastest."

[THE LOOP - 2:30-3:15]
"Here's the loop:

1. Start with the smallest model that might work
2. Define 'good enough' — just your best guess
3. Build a few evals — even 5-10 test cases help
4. Ship to a small audience — beta, 5% rollout, whatever
5. Watch real behavior — not metrics dashboards, actual outputs
6. Adjust based on data — upgrade, downgrade, or fix your prompts

This loop might take a week. Then you run it again. And again.

Each loop, you get smarter. Each loop, your product gets better."

[THE MINDSET SHIFT - 3:15-3:45]
"The shift is from 'plan to ship' to 'ship to learn.'

You're not trying to get it right the first time. You're trying
to learn fast enough that you converge on 'right' faster than
your competitors.

The analysis — latency budgets, cost projections, quality bars —
that stuff is useful AFTER you have data. Not before."

[CLOSE - 3:45-4:00]
"So stop planning. Pick a model. Ship something. Learn.

The answers you're looking for? They're in your production data,
not in a spreadsheet."
```

---

## Summary of Changes

| Location | Change |
|----------|--------|
| Learn page header | Reframe as "foundational vocabulary" |
| New section | "What You're Learning" - foundation + production adds |
| Video contexts | Add brief framing for each video |
| New section | "From Learning to Production" - bridge to real-world |
| Dimension picker | Reframe as "common questions" not decision tree |
| Shipping Decisions | Lead with The Loop, move analysis to expandables |
| Shipping video | New script: "Ship to learn, not plan to ship" |

---

## Testing Checklist

- [ ] Learn page header reflects "foundational vocabulary" framing
- [ ] "What You're Learning" section appears before videos
- [ ] Video context text appears above each embed
- [ ] "From Learning to Production" section appears after Real-World Tools
- [ ] Shipping Decisions leads with The Loop card (prominent, not collapsed)
- [ ] Shipping Decisions expandables are clearly labeled as reference material
- [ ] No repeated disclaimers on individual dimension cards
- [ ] Tone is positive (additive) not undermining (contradictory)

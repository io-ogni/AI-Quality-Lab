# not_done — Delta 13: Learn Page — Simplify "What You're Learning" + Remove "From Learning to Production"

Date: 2026-02-25

**Problem:** The Learn page has two sections that say the same thing in different ways: "What You're Learning" (verbose, hard to scan) and "From Learning to Production" (redundant table + bullets). Both explain "this app teaches you skills you'll use in production." Say it once, clearly.

---

## Change 1: Replace "What You're Learning" section

**Location:** After the Learn page header, before the video embeds.

**Before:**
```
What You're Learning

This app teaches you to think systematically about AI quality.

The Foundation (what we teach):
- Vocabulary — words to describe what's wrong with an AI output
- Mental models — 11 lenses to examine quality through
- The skill — articulating what "good" looks like for a given scenario

What Production Adds:
In the real world, you'll also discover criteria specific to your product:
- A real estate bot might need "client persona match"
- A finance bot might need "regulatory disclaimer present"
- A support bot might need "escalation timing"

These custom criteria aren't replacements for the 11 dimensions —
they're additions. And you'll define them using exactly the skill
you're practicing here: looking at outputs and articulating what
makes them good or bad.

Next step: Error Analysis Lab
Once you can define quality criteria, the next skill is reviewing
real AI outputs and finding patterns. The Error Analysis Lab walks
you through this with 25 pre-built conversations — no API key needed.
```

**After:**
```
What You're Learning

This app teaches two skills, in order:

1. Define quality criteria
   Look at an AI output and articulate what makes it good or bad.
   You'll practice this across 11 quality dimensions — from
   "did it follow instructions?" to "can users trick it?"
   → Criteria Lab

2. Find failure patterns
   Review real AI conversations, diagnose what's wrong, and group
   failures into categories you can act on.
   → Error Analysis Lab (no API key needed)

In production, you'll use the same skills on your own product.
The dimensions here are your starting vocabulary — you'll discover
more that are specific to your use case (like "regulatory disclaimer
present" for a finance bot, or "escalation timing" for support).
```

---

## Change 2: Remove "From Learning to Production" section

**Location:** After Section 6 (Real-World Tools), before the Resources section.

Delete the entire "From Learning to Production" section:
- The header
- The "Same skill, different data" table
- The "What changes in production" bullets (custom criteria, build evaluators, pass/fail)
- The "The foundation stays the same" closing paragraph

This is now redundant — the new "What You're Learning" section covers the same ground in three lines instead of three paragraphs.

---

## Change 3: Settings — "Clear All Progress" includes Error Analysis

The "Clear All Progress" button in Settings must also clear the `errorAnalysisProgress` localStorage key (Error Analysis Lab progress — phase, trace position, responses, categories). Currently it only clears Criteria Lab data.

"Clear All Progress" means clear ALL progress — both labs.

---

## What does NOT change

- Learn page header ("11 foundational ways to think about AI output quality") stays identical
- Video embeds and video context text stay identical
- All 11 quality dimension sections stay identical
- "Common Quality Questions" section stays identical
- Resources section (delta-12) stays identical

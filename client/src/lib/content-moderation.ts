import type { CriteriaEvaluation } from './types';

const OFFENSIVE_PATTERNS = [
  /\b(idiot|stupid|moron|imbecile|dumb\s*ass)\b/i,
  /\b(fuck|f[*u]ck|fuk|fück|f\*\*k)\b/i,
  /\b(shit|sh[*i]t|sh1t)\b/i,
  /\b(ass\b|a\$\$|asshole|a\*\*hole)\b/i,
  /\b(dick|d[1i]ck)\b/i,
  /\b(bitch|b[1i]tch)\b/i,
  /\b(cunt)\b/i,
  /\b(retard|retarded|r[3e]tard)\b/i,
  /\bkill\s*(yourself|urself|your\s*self)\b/i,
  /\bgo\s*die\b/i,
  /\b(nigger|nigga|n[1i]gg[ae3]r?)\b/i,
  /\b(faggot|fag|f[a4]gg?[o0]t)\b/i,
  /\b(whore|slut|hoe)\b/i,
];

export function detectOffensiveContent(text: string): { isOffensive: boolean; flaggedText?: string } {
  for (const pattern of OFFENSIVE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return { isOffensive: true, flaggedText: match[0] };
    }
  }
  return { isOffensive: false };
}

function wordSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = Array.from(wordsA).filter(w => wordsB.has(w)).length;
  const union = new Set(Array.from(wordsA).concat(Array.from(wordsB))).size;
  return union > 0 ? intersection / union : 0;
}

function hasBulletFormat(text: string): boolean {
  const lines = text.trim().split('\n');
  const bulletLines = lines.filter(l => /^\s*[-•*]\s+/.test(l) || /^\s*\d+[.)]\s+/.test(l));
  return bulletLines.length >= 2 && bulletLines.length / lines.length > 0.5;
}

export interface PreValidationError {
  field: 'criteria' | 'good_example' | 'bad_example' | 'both';
  issue: 'too_short' | 'copy_paste' | 'identical' | 'looks_like_criteria' | 'offensive';
  message: string;
}

export interface PreValidationWarning {
  field: 'good_example' | 'bad_example';
  issue: 'looks_like_criteria';
  message: string;
}

export interface PreValidationResult {
  valid: boolean;
  errors: PreValidationError[];
  warnings: PreValidationWarning[];
  forcedResult: {
    overallScore: number;
    passed: false;
    criticalGaps: string[];
  } | null;
}

export function preValidateSandboxSubmission(
  criteria: string,
  goodExample: string,
  badExample: string
): PreValidationResult {
  const errors: PreValidationError[] = [];
  const warnings: PreValidationWarning[] = [];

  if (criteria.trim().length < 20) {
    errors.push({ field: 'criteria', issue: 'too_short', message: 'Criteria is too short. Write at least 3 distinct points.' });
  }
  if (goodExample.trim().length < 10) {
    errors.push({ field: 'good_example', issue: 'too_short', message: 'Good example is too short. Write a realistic bot response.' });
  }
  if (badExample.trim().length < 10) {
    errors.push({ field: 'bad_example', issue: 'too_short', message: 'Bad example is too short. Write a realistic bot response.' });
  }

  if (wordSimilarity(goodExample, criteria) > 0.8) {
    errors.push({ field: 'good_example', issue: 'copy_paste', message: 'Your good example looks copy-pasted from your criteria. Write a realistic bot response instead.' });
  }
  if (wordSimilarity(badExample, criteria) > 0.8) {
    errors.push({ field: 'bad_example', issue: 'copy_paste', message: 'Your bad example looks copy-pasted from your criteria. Write a realistic bot response instead.' });
  }

  if (wordSimilarity(goodExample, badExample) > 0.9) {
    errors.push({ field: 'both', issue: 'identical', message: 'Your good and bad examples are nearly identical. They should show clearly different responses.' });
  }

  if (hasBulletFormat(goodExample)) {
    errors.push({ field: 'good_example', issue: 'looks_like_criteria', message: 'Your good example looks like a list of criteria, not a bot response. Examples should read like actual responses.' });
  }
  if (hasBulletFormat(badExample)) {
    errors.push({ field: 'bad_example', issue: 'looks_like_criteria', message: 'Your bad example looks like a list of criteria, not a bot response. Examples should read like actual responses.' });
  }

  const criteriaOffensive = detectOffensiveContent(criteria);
  if (criteriaOffensive.isOffensive) {
    errors.push({ field: 'criteria', issue: 'offensive', message: `Your criteria contains offensive language ("${criteriaOffensive.flaggedText}"). Please use professional language.` });
  }
  const goodOffensive = detectOffensiveContent(goodExample);
  if (goodOffensive.isOffensive) {
    errors.push({ field: 'good_example', issue: 'offensive', message: `Your good example contains offensive language ("${goodOffensive.flaggedText}"). A good example should demonstrate a proper response.` });
  }
  const badOffensive = detectOffensiveContent(badExample);
  if (badOffensive.isOffensive) {
    errors.push({ field: 'bad_example', issue: 'offensive', message: `Your bad example contains offensive language ("${badOffensive.flaggedText}"). Even bad examples should avoid profanity — show realistic failures instead.` });
  }

  const hasErrors = errors.length > 0;
  const criticalGaps = errors.map(e => e.message);
  if (warnings.length > 0) {
    criticalGaps.push(...warnings.map(w => w.message));
  }

  return {
    valid: !hasErrors,
    errors,
    warnings,
    forcedResult: hasErrors ? {
      overallScore: 1,
      passed: false,
      criticalGaps,
    } : null,
  };
}

export function postValidateLLMResponse(
  llmResult: CriteriaEvaluation,
  criteria: string,
  goodExample: string,
  badExample: string
): CriteriaEvaluation {
  const result: CriteriaEvaluation = {
    ...llmResult,
    scores: {
      ...llmResult.scores,
      goodExample: { ...llmResult.scores.goodExample },
      badExample: { ...llmResult.scores.badExample },
    },
    criticalGaps: [...llmResult.criticalGaps],
  };

  const goodOffensive = detectOffensiveContent(goodExample);
  if (goodOffensive.isOffensive && result.scores.goodExample.score > 2) {
    result.scores.goodExample = {
      score: 1,
      feedback: `CRITICAL: Your good example contains offensive language ("${goodOffensive.flaggedText}"). A good example must demonstrate a proper, professional response.`,
    };
    result.criticalGaps.push('Good example contains offensive language — cannot pass.');
  }

  if (wordSimilarity(badExample, criteria) > 0.7 && result.scores.badExample.score > 2) {
    result.scores.badExample = {
      score: 1,
      feedback: 'This is not an example — you pasted your criteria. Write a realistic bad bot response.',
    };
    result.criticalGaps.push('Bad example is a copy of your criteria, not a bot response.');
  }

  if (wordSimilarity(goodExample, criteria) > 0.7 && result.scores.goodExample.score > 2) {
    result.scores.goodExample = {
      score: 1,
      feedback: 'This is not an example — you pasted your criteria. Write a realistic good bot response.',
    };
    result.criticalGaps.push('Good example is a copy of your criteria, not a bot response.');
  }

  const badOffensive = detectOffensiveContent(badExample);
  if (badOffensive.isOffensive && result.scores.badExample.score > 2) {
    result.scores.badExample = {
      score: 1,
      feedback: `Your bad example contains offensive language ("${badOffensive.flaggedText}"). Even bad examples should avoid profanity — show realistic failures instead.`,
    };
    result.criticalGaps.push('Bad example contains offensive language.');
  }

  const criteriaOffensive = detectOffensiveContent(criteria);
  if (criteriaOffensive.isOffensive) {
    result.scores.specificity = {
      score: 1,
      feedback: `Your criteria contains offensive language ("${criteriaOffensive.flaggedText}"). Please use professional language.`,
    };
    result.criticalGaps.push('Criteria contains offensive language.');
  }

  if (wordSimilarity(goodExample, badExample) > 0.85 && result.scores.goodExample.score > 2) {
    result.scores.goodExample = {
      ...result.scores.goodExample,
      feedback: result.scores.goodExample.feedback + " Warning: Your 'good' example looks very similar to your 'bad' example.",
    };
  }

  const scores = result.scores;
  const avgScore = Math.round(
    (scores.specificity.score + scores.relevance.score + scores.completeness.score +
     scores.goodExample.score + scores.badExample.score) / 5
  );
  result.overallScore = Math.min(result.overallScore, avgScore);
  result.passed = result.overallScore >= 3;

  return result;
}

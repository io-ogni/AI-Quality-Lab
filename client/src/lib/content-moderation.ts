import type { CriteriaEvaluation, ExampleValidationWarning } from './types';

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

  if (result.scores.goodExample.meetsUserCriteria === false && result.scores.goodExample.score > 2) {
    result.scores.goodExample = {
      ...result.scores.goodExample,
      score: 1,
      feedback: result.scores.goodExample.feedback || 'Your good example does not meet your criteria.',
    };
  }

  if (result.scores.badExample.violatesUserCriteria === false && result.scores.badExample.score > 2) {
    result.scores.badExample = {
      ...result.scores.badExample,
      score: 1,
      feedback: result.scores.badExample.feedback || 'Your bad example meets your criteria instead of violating them.',
    };
  }

  if (result.scores.badExample.isRealisticFailure === false && result.scores.badExample.score > 1) {
    const alignmentNote = result.scores.badExample.scenarioAlignment
      ? ` ${result.scores.badExample.scenarioAlignment}`
      : '';
    result.scores.badExample = {
      ...result.scores.badExample,
      score: 1,
      feedback: `This is actually correct behavior for this bot type — it's not a realistic failure.${alignmentNote} A bad example should show how the bot could realistically fail, not what it should actually say.`,
    };
    if (!result.criticalGaps.some(g => g.includes('realistic failure'))) {
      result.criticalGaps.push('Your bad example is actually correct behavior for this scenario — it should show a realistic failure instead.');
    }
  }

  if (result.scores.goodExample.criteriaCheck && result.scores.goodExample.criteriaCheck.length > 0) {
    const anyNotMet = result.scores.goodExample.criteriaCheck.some(cc => !cc.met);
    if (anyNotMet && result.scores.goodExample.score > 2) {
      const failedCriteria = result.scores.goodExample.criteriaCheck
        .filter(cc => !cc.met)
        .map(cc => cc.criterion)
        .join(', ');
      result.scores.goodExample = {
        ...result.scores.goodExample,
        score: 1,
        meetsUserCriteria: false,
        feedback: `Your good example violates your own criteria (${failedCriteria}). A good example must meet ALL your criteria.`,
      };
      if (!result.criticalGaps.some(g => g.includes('good example') && g.includes('violat'))) {
        result.criticalGaps.push('Your good example violates your criteria — it should demonstrate what a correct response looks like.');
      }
    }
  }

  if (result.scores.badExample.criteriaCheck && result.scores.badExample.criteriaCheck.length > 0) {
    const allMet = result.scores.badExample.criteriaCheck.every(cc => cc.met);
    if (allMet && result.scores.badExample.score > 2) {
      result.scores.badExample = {
        ...result.scores.badExample,
        score: 1,
        violatesUserCriteria: false,
        feedback: `Your bad example actually meets all your criteria. A bad example should VIOLATE at least one criterion to show what a wrong response looks like.`,
      };
      if (!result.criticalGaps.some(g => g.includes('bad example') && g.includes('meets'))) {
        result.criticalGaps.push('Your bad example follows your criteria — it should demonstrate what a wrong response looks like.');
      }
    }
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

export function validateExampleLogic(
  criteria: string,
  goodExample: string,
  badExample: string
): ExampleValidationWarning[] {
  const warnings: ExampleValidationWarning[] = [];

  const advicePhrases = [
    /\bjust (do|go|try|get|buy|sell|invest)\b/i,
    /\byou should\b/i,
    /\bi('d| would) (say|suggest|recommend)\b/i,
    /\bgo for it\b/i,
    /\bmy advice\b/i,
    /\bi (think|believe) you should\b/i,
    /\bdefinitely (do|go|try|buy|sell|invest)\b/i,
  ];

  const noAdviceCriteria = /\b(don'?t|do not|never|avoid|must not|should not|shouldn'?t).{0,15}(give|offer|provide|make).{0,10}(advice|recommendation|suggestion)\b/i;

  if (noAdviceCriteria.test(criteria)) {
    for (const phrase of advicePhrases) {
      if (phrase.test(goodExample)) {
        warnings.push({
          field: 'good_example',
          issue: 'contains_advice',
          message: 'Your good example appears to give advice, but your criteria says not to. A good example should follow ALL your criteria.'
        });
        break;
      }
    }
  }

  const recommendProfessionalCriteria = /\brecommend.{0,15}(professional|expert|advisor|specialist|planner|counselor|therapist)\b/i;
  const professionalPhrases = [
    /\btalk to (a |an |someone |).*?(professional|expert|advisor|specialist|experienced|planner|counselor|therapist)\b/i,
    /\bseek (professional |expert |)?advice\b/i,
    /\bconsult (a |an |with )?(professional|expert|advisor|specialist|planner)\b/i,
    /\bspeak (to |with )(a |an )?(professional|expert|advisor|specialist|planner)\b/i,
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

  const dontBlameCriteria = /\b(don'?t|do not|never|avoid|must not|should not|shouldn'?t).{0,15}(blame|fault|accuse)\b/i;
  const blamePhrases = [
    /\bif you had\b/i,
    /\byou should have\b/i,
    /\bthat'?s your (fault|problem|mistake)\b/i,
    /\byou caused\b/i,
    /\byou'?re the one who\b/i,
  ];

  if (dontBlameCriteria.test(criteria)) {
    for (const phrase of blamePhrases) {
      if (phrase.test(goodExample)) {
        warnings.push({
          field: 'good_example',
          issue: 'contains_advice',
          message: 'Your good example appears to blame the user, but your criteria says not to. A good example should follow ALL your criteria.'
        });
        break;
      }
    }
  }

  return warnings;
}

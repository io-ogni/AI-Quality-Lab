import type { APISettings, ChallengeLevel, ChallengeResult, CriteriaEvaluation, SandboxScenario, QualityDimension } from './types';
import { getAPISettings } from './storage';
import { matchSynonyms } from './synonyms';
import { preValidateSandboxSubmission, postValidateLLMResponse } from './content-moderation';

function isGarbage(userInput: string): boolean {
  const trimmed = userInput.trim();
  if (trimmed.length < 10) return true;
  const letters = trimmed.replace(/[^a-zA-Z]/g, '').length;
  if (letters < trimmed.length * 0.5) return true;
  if (!trimmed.includes(' ')) return true;
  return false;
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const settings = getAPISettings();
  if (!settings) throw new Error('No API settings');

  if (settings.provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } else {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export async function testAPIConnection(settings: APISettings): Promise<{ success: boolean; message: string }> {
  try {
    if (settings.provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: settings.model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Connected successfully' };
      } else {
        return { success: false, message: 'Invalid key or connection error' };
      }
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Connected successfully' };
      } else {
        return { success: false, message: 'Invalid key or connection error' };
      }
    }
  } catch (error) {
    return { success: false, message: 'Connection failed' };
  }
}

export async function evaluateCriteria(
  dimensionId: QualityDimension,
  level: number,
  userCriteria: string,
  levelData: ChallengeLevel
): Promise<ChallengeResult> {
  if (isGarbage(userCriteria)) {
    return {
      garbageDetected: true,
      matches: [],
      missed: levelData.expertCriteria.map(c => c.text),
      vague: [],
      coverageScore: 0,
      specificityScore: 1,
      passed: false,
      feedback: 'Please enter actual evaluation criteria, not random text.',
    };
  }

  const deterministicMatches: { expertCriterion: string; userVersion: string; matchType: 'deterministic' | 'llm_validated' }[] = [];
  const needsLLMEval: typeof levelData.expertCriteria = [];

  for (const criterion of levelData.expertCriteria) {
    const result = matchSynonyms(dimensionId, level, criterion.id, userCriteria);
    if (result.matched && result.matchedPhrase) {
      deterministicMatches.push({
        expertCriterion: criterion.text,
        userVersion: result.matchedPhrase,
        matchType: 'deterministic',
      });
    } else {
      needsLLMEval.push(criterion);
    }
  }

  if (needsLLMEval.length === 0) {
    const coverageScore = deterministicMatches.length;
    const passed = coverageScore >= levelData.passThreshold;
    return {
      garbageDetected: false,
      matches: deterministicMatches,
      missed: [],
      vague: [],
      coverageScore,
      specificityScore: 4,
      passed,
      feedback: passed 
        ? `Great job! You identified all ${coverageScore} key criteria.`
        : `You identified ${coverageScore} of ${levelData.expertCriteria.length} criteria. Need ${levelData.passThreshold} to pass.`,
    };
  }

  const systemPrompt = `You are a STRICT evaluator comparing user-submitted criteria to expert criteria.

CRITICAL: NEVER HALLUCINATE. You can ONLY report matches for text that ACTUALLY EXISTS in the user's input.
The "user_version" field MUST be a direct quote or very close paraphrase from their actual input.
When in doubt, DO NOT claim a match — it's better to miss a match than to invent one.

EXAMPLES OF NON-MATCHES (DO NOT MATCH THESE):
- "be helpful" — too vague, doesn't match anything specific
- "respond nicely" — too vague
- "say something about revenue" vs "accurately cites the revenue figure" — VAGUE vs SPECIFIC, not a match
- "mention the date" vs "correctly states the founding date" — user didn't specify accuracy
- "talk about the context" vs "only uses information from context" — user didn't specify constraint
- "include numbers" vs "cites exact figures from the document" — user didn't require exactness

VAGUE MENTIONS ≠ SPECIFIC REQUIREMENTS:
If the expert criterion requires ACCURACY, EXACTNESS, or CONSTRAINT (e.g., "accurately cites", "correctly states", "only uses", "does not add"), the user's criterion must also imply that requirement. Phrases like "say something about", "mention", "include", "talk about" are too vague to match criteria requiring precision.

WHAT IS AND ISN'T VAGUE for the vague_criteria array:
VAGUE: "be good", "be helpful", "respond nicely", "do something"
NOT VAGUE (these mention specific attributes/actions/constraints):
- "the tone is formal, educational"
- "professional tone"
- "include examples"
- "keep it short"
- "don't use jargon"
Rule: If it mentions ANY specific attribute, action, or constraint, it is NOT vague — do NOT put it in vague_criteria.

SCENARIO:
- Bot type: ${levelData.scenario.botContext}
- System prompt: ${levelData.scenario.systemPrompt}
- Test input: ${levelData.scenario.testInput}
${levelData.scenario.contextDocument ? `- Context document: ${levelData.scenario.contextDocument}` : ''}

EXPERT CRITERIA TO CHECK (not already matched):
${needsLLMEval.map((c, i) => `${i + 1}. ${c.text}`).join('\n')}

CRITICAL RULE: MATCHES AND VAGUE ARE MUTUALLY EXCLUSIVE.
A user criterion is EITHER:
- A MATCH (it successfully matched an expert criterion) — goes in matches[]
- OR VAGUE (it didn't match anything and is too vague to count) — goes in vague_criteria[]
NEVER put the same text in both arrays. If a user criterion matched an expert criterion, it is NOT vague. Only put criteria in vague_criteria[] if they:
1. Did NOT match any expert criterion, AND
2. Are too vague to be useful (e.g., "be helpful", "respond nicely")

Respond in JSON format only:
{
  "matches": [
    {"expert_criterion": "exact text from expert criteria", "user_version": "quoted text from user input", "confidence": "high|medium"}
  ],
  "vague_criteria": ["any user criteria that are too vague to count"],
  "specificity_score": 1-5,
  "feedback": "brief constructive feedback"
}`;

  const userPrompt = `USER'S CRITERIA:
${userCriteria}

Evaluate how well the user's criteria match the expert criteria. Be strict but fair. Only report genuine matches.`;

  try {
    const response = await callLLM(systemPrompt, userPrompt);
    
    let parsed;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      return {
        garbageDetected: false,
        matches: [],
        missed: levelData.expertCriteria.map(c => c.text),
        vague: [],
        coverageScore: 0,
        specificityScore: 2,
        passed: false,
        feedback: 'Error parsing response. Please try again.',
      };
    }

    const llmMatches = (parsed.matches || []).filter((m: any) => {
      const claimedLower = (m.user_version || '').toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const actualLower = userCriteria.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const words = claimedLower.split(/\s+/).filter((w: string) => w.length > 2);
      if (words.length === 0) return false;
      const matchedWords = words.filter((w: string) => actualLower.includes(w));
      return matchedWords.length / words.length >= 0.5;
    }).map((m: any) => ({
      expertCriterion: m.expert_criterion,
      userVersion: m.user_version,
      matchType: 'llm_validated' as const,
    }));

    const allMatches = [...deterministicMatches, ...llmMatches];
    const matchedExperts = new Set(allMatches.map((m) => m.expertCriterion));
    const missed = levelData.expertCriteria
      .filter(c => !matchedExperts.has(c.text))
      .map(c => c.text);

    const matchedUserVersions = allMatches.map(m => m.userVersion.toLowerCase());
    const cleanedVagueCriteria = (parsed.vague_criteria || []).filter((vague: string) => {
      const vagueLower = vague.toLowerCase();
      return !matchedUserVersions.some((matched: string) =>
        matched.includes(vagueLower) || vagueLower.includes(matched)
      );
    });

    const coverageScore = allMatches.length;
    const specificityScore = parsed.specificity_score || 3;
    const passed = coverageScore >= levelData.passThreshold;

    return {
      garbageDetected: false,
      matches: allMatches,
      missed,
      vague: cleanedVagueCriteria,
      coverageScore,
      specificityScore,
      passed,
      feedback: passed 
        ? `Great job! You identified ${coverageScore} of ${levelData.expertCriteria.length} key criteria.`
        : `You identified ${coverageScore} of ${levelData.expertCriteria.length} criteria. ${levelData.passThreshold - coverageScore} more needed to pass. ${parsed.feedback || ''}`,
    };
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function evaluateSandboxCriteria(
  scenario: SandboxScenario,
  criteria: string,
  goodExample: string,
  badExample: string
): Promise<CriteriaEvaluation> {
  const preValidation = preValidateSandboxSubmission(criteria, goodExample, badExample);
  if (!preValidation.valid && preValidation.forcedResult) {
    return {
      garbageDetected: true,
      garbageReason: preValidation.errors.map(e => e.message).join(' '),
      safetyCheck: { isSensitiveTopic: scenario.isSensitive, safetyConcerns: '', isSafeDesign: true },
      scores: {
        specificity: { score: 1, feedback: 'Submission failed pre-validation checks.' },
        relevance: { score: 1, feedback: '' },
        completeness: { score: 1, feedback: '' },
        exampleQuality: { score: 1, feedback: '' },
        goodExample: { score: 1, feedback: preValidation.errors.find(e => e.field === 'good_example')?.message || '' },
        badExample: { score: 1, feedback: preValidation.errors.find(e => e.field === 'bad_example')?.message || '' },
      },
      overallScore: 1,
      passed: false,
      strengths: [],
      criticalGaps: preValidation.forcedResult.criticalGaps,
      suggestion: 'Fix the issues above and try again.',
    };
  }

  const systemPrompt = `You are a STRICT evaluator helping Product Managers learn to define quality criteria. Your job is to score harshly but fairly — low-effort or vague submissions should FAIL.

SCENARIO:
- Context: ${scenario.context}
- System Prompt: ${scenario.systemPrompt}
- Test Input: ${scenario.testInput}

${scenario.isSensitive ? `THIS IS A SENSITIVE TOPIC SCENARIO. Safety criteria must be prioritized.` : ''}

EVALUATION RULES:
1. AUTOMATIC FAIL (score 1-2) if:
   - Criteria is fewer than 3 distinct points
   - Criteria uses truly vague phrases without specifics
   - Good and bad examples are identical or nearly identical
   - Total submission is under 100 characters

2. Be STRICT with scoring:
   - 1: Garbage/vague ("do something", "be good")
   - 2: Generic ("be helpful" without specifics)
   - 3: Somewhat specific but missing details
   - 4: Specific and actionable
   - 5: Highly specific with measurable checkpoints

3. WHAT IS AND ISN'T VAGUE:
   VAGUE: "be good", "be helpful", "respond nicely", "do something"
   NOT VAGUE (these mention specific attributes/actions/constraints):
   - "the tone is formal, educational"
   - "professional tone"
   - "include examples"
   - "keep it short"
   - "don't use jargon"
   Rule: If it mentions ANY specific attribute, action, or constraint, it is NOT vague.

4. GOOD EXAMPLE QUALITY (1-5):
   - 1: Nonsense, single word, or doesn't relate to scenario
   - 5: Excellent — meets all criteria, realistic, could be a real bot response

5. BAD EXAMPLE QUALITY (1-5):
   - 1: Nonsense, identical to good example, or single word
   - 5: Excellent — clearly fails criteria, realistic failure mode

6. EXAMPLE FORMAT DETECTION (AUTOMATIC FAIL):
   - Examples must look like BOT RESPONSES, not criteria lists
   - If example contains bullet points (-, •, *) or numbered lists AND reads like criteria → score 1/5
   - If example is copy-pasted from the Criteria field → score 1/5

7. OFFENSIVE GOOD EXAMPLE (AUTOMATIC FAIL):
   - If "Good Example" contains insults, profanity, or hostile language → AUTOMATIC FAIL (score 1/5)
   - A "Good Example" that says offensive things is NEVER acceptable
   - Flag prominently in feedback, not just in "critical_gaps"

8. CROSS-FIELD VALIDATION:
   - Bad Example = criteria copy-pasted → score 1/5, feedback: "This is not an example"
   - Good Example = criteria copy-pasted → score 1/5
   - Good Example would realistically be a bad response → Flag: "Your 'good' example looks like a 'bad' example"

EXAMPLE OF OFFENSIVE GOOD EXAMPLE (should score 1/5):
- Criteria: "be empathic, offer refund, stay professional"
- Good example: "you are an idiot"
→ CRITICAL FAILURE. Cannot pass with offensive "good" example.

EXAMPLE OF COPY-PASTED CRITERIA (should score 1/5):
- Criteria: "- be empathic\n- offer refund"
- Bad example: "- be empathic\n- offer refund"
→ This is not an example — user pasted their criteria.

Respond in JSON format only:
{
  "garbage_detected": boolean,
  "garbage_reason": "if garbage, explain why",
  "safety_check": {
    "is_sensitive_topic": boolean,
    "safety_concerns": "describe any safety issues",
    "is_safe_design": boolean
  },
  "scores": {
    "criteria": {
      "specificity": {"score": 1-5, "feedback": "specific feedback"},
      "relevance": {"score": 1-5, "feedback": "specific feedback"},
      "completeness": {"score": 1-5, "feedback": "specific feedback"}
    },
    "good_example": {
      "score": 1-5,
      "meets_user_criteria": true/false,
      "is_good_for_scenario": true/false,
      "feedback": "specific feedback"
    },
    "bad_example": {
      "score": 1-5,
      "violates_user_criteria": true/false,
      "is_realistic_failure": true/false,
      "feedback": "specific feedback"
    },
    "safety": {"score": 1-5, "feedback": "if sensitive scenario"}
  },
  "overall_score": 1-5,
  "passed": boolean,
  "strengths": ["what they did well"],
  "critical_gaps": ["what's missing"],
  "suggestion": "one specific improvement"
}`;

  const userPrompt = `USER'S SUBMISSION:
- Success Criteria: ${criteria}
- Example Good Output: ${goodExample}
- Example Bad Output: ${badExample}

Evaluate the quality of their criteria definition.`;

  try {
    const response = await callLLM(systemPrompt, userPrompt);
    
    let parsed;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      const fallback = { score: 3, feedback: 'Unable to evaluate' };
      return {
        garbageDetected: false,
        safetyCheck: { isSensitiveTopic: scenario.isSensitive, safetyConcerns: '', isSafeDesign: true },
        scores: {
          specificity: fallback,
          relevance: fallback,
          completeness: fallback,
          exampleQuality: fallback,
          goodExample: { score: 3, feedback: 'Unable to evaluate' },
          badExample: { score: 3, feedback: 'Unable to evaluate' },
        },
        overallScore: 3,
        passed: false,
        strengths: [],
        criticalGaps: ['Error parsing evaluation. Please try again.'],
        suggestion: 'Try again with a clearer submission.',
      };
    }

    const criteriaScores = parsed.scores?.criteria || parsed.scores || {};
    const goodEx = parsed.scores?.good_example || {};
    const badEx = parsed.scores?.bad_example || {};

    const exampleQualityScore = Math.round(((goodEx.score || 3) + (badEx.score || 3)) / 2);

    const llmResult = {
      garbageDetected: parsed.garbage_detected || false,
      garbageReason: parsed.garbage_reason,
      safetyCheck: {
        isSensitiveTopic: parsed.safety_check?.is_sensitive_topic || scenario.isSensitive,
        safetyConcerns: parsed.safety_check?.safety_concerns || '',
        isSafeDesign: parsed.safety_check?.is_safe_design ?? true,
      },
      scores: {
        specificity: criteriaScores.specificity || { score: 3, feedback: '' },
        relevance: criteriaScores.relevance || { score: 3, feedback: '' },
        completeness: criteriaScores.completeness || { score: 3, feedback: '' },
        exampleQuality: { score: exampleQualityScore, feedback: '' },
        goodExample: {
          score: goodEx.score || 3,
          feedback: goodEx.feedback || '',
          meetsUserCriteria: goodEx.meets_user_criteria,
          isGoodForScenario: goodEx.is_good_for_scenario,
        },
        badExample: {
          score: badEx.score || 3,
          feedback: badEx.feedback || '',
          violatesUserCriteria: badEx.violates_user_criteria,
          isRealisticFailure: badEx.is_realistic_failure,
        },
        safety: scenario.isSensitive ? (parsed.scores?.safety || criteriaScores.safety) : undefined,
      },
      overallScore: parsed.overall_score || 3,
      passed: parsed.passed || false,
      strengths: parsed.strengths || [],
      criticalGaps: parsed.critical_gaps || [],
      suggestion: parsed.suggestion || '',
    };

    const postValidated = postValidateLLMResponse(llmResult, criteria, goodExample, badExample);
    return { ...llmResult, ...postValidated };
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export type QualityDimension = 
  | 'instruction-following'
  | 'format-compliance'
  | 'toxicity-detection'
  | 'relevance'
  | 'completeness'
  | 'tone-style'
  | 'consistency'
  | 'groundedness'
  | 'factual-accuracy'
  | 'refusal-handling'
  | 'adversarial-robustness';

export type DimensionGroup = 'eval-runtime' | 'eval-focused' | 'requires-system-design' | 'security';

export interface QualityDimensionInfo {
  id: QualityDimension;
  name: string;
  description: string;
  icon: string;
  group: DimensionGroup;
  isAdvanced?: boolean;
  advancedNote?: string;
}

export interface ExpertCriterion {
  id: string;
  text: string;
}

export interface ChallengeLevel {
  level: 1 | 2 | 3;
  title: string;
  scenario: {
    botContext: string;
    systemPrompt: string;
    testInput: string;
    contextDocument?: string;
  };
  hint: string;
  expertCriteria: ExpertCriterion[];
  passThreshold: number;
}

export interface Challenge {
  dimensionId: QualityDimension;
  about: string;
  levels: [ChallengeLevel, ChallengeLevel, ChallengeLevel];
}

export interface ChallengeProgress {
  dimensionId: QualityDimension;
  completedLevels: number[];
  attempts: {
    level: number;
    passed: boolean;
    score: number;
    timestamp: number;
  }[];
}

export interface UserProgress {
  challenges: Record<QualityDimension, ChallengeProgress>;
  totalCompleted: number;
  dimensionsMastered: number;
}

export interface APISettings {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model: string;
}

export const MODEL_OPTIONS: Record<'openai' | 'anthropic', { id: string; label: string; tier: 'fast' | 'performance' }[]> = {
  anthropic: [
    { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', tier: 'fast' },
    { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', tier: 'performance' },
  ],
  openai: [
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', tier: 'fast' },
    { id: 'gpt-4o', label: 'GPT-4o', tier: 'performance' },
  ],
};

export const DEFAULT_MODEL: Record<'openai' | 'anthropic', string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-4-5-20251001',
};

export interface SandboxScenario {
  id: string;
  name: string;
  context: string;
  systemPrompt: string;
  testInput: string;
  isSensitive: boolean;
  sensitiveNote?: string;
  failureModes?: string[];
}

export interface ExampleScore {
  score: number;
  feedback: string;
  isGoodForScenario?: boolean;
  isRealisticFailure?: boolean;
  failureModeMatched?: string | null;
}

export interface CriteriaEvaluation {
  garbageDetected: boolean;
  garbageReason?: string;
  safetyCheck: {
    isSensitiveTopic: boolean;
    safetyConcerns: string;
    isSafeDesign: boolean;
  };
  scores: {
    specificity: { score: number; feedback: string };
    relevance: { score: number; feedback: string };
    completeness: { score: number; feedback: string };
    exampleQuality: { score: number; feedback: string };
    goodExample: ExampleScore;
    badExample: ExampleScore;
    safety?: { score: number; feedback: string };
  };
  overallScore: number;
  passed: boolean;
  strengths: string[];
  criticalGaps: string[];
  suggestion: string;
}

export interface ChallengeResult {
  garbageDetected: boolean;
  wrongInputType?: boolean;
  matches: {
    expertCriterion: string;
    userVersion: string;
    matchType: 'deterministic' | 'llm_validated';
  }[];
  missed: string[];
  vague: string[];
  coverageScore: number;
  specificityScore: number;
  passed: boolean;
  feedback: string;
}

export interface SavedCriteria {
  scenarioId: string;
  criteria: string;
  goodExample: string;
  badExample: string;
  timestamp: number;
  lastScore?: number;
}

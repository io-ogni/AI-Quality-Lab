import type { UserProgress, APISettings, QualityDimension, SavedCriteria } from './types';

const PROGRESS_KEY = 'aiQualityLab_progress';
const CUSTOM_CHALLENGES_KEY = 'aiQualityLab_customChallenges';
const SAVED_CRITERIA_KEY = 'aiQualityLab_savedCriteria';

const API_KEY_KEY = 'aiQualityLab_apiKey';
const API_PROVIDER_KEY = 'aiQualityLab_provider';
const API_MODEL_KEY = 'aiQualityLab_model';
const DISCLAIMER_KEY = 'aiQualityLab_hasSeenDisclaimer';

export function getHasSeenDisclaimer(): boolean {
  return sessionStorage.getItem(DISCLAIMER_KEY) === 'true';
}

export function setHasSeenDisclaimer(): void {
  sessionStorage.setItem(DISCLAIMER_KEY, 'true');
}

export function getAPISettings(): APISettings | null {
  const apiKey = sessionStorage.getItem(API_KEY_KEY);
  const provider = sessionStorage.getItem(API_PROVIDER_KEY) as 'openai' | 'anthropic' | null;
  const model = sessionStorage.getItem(API_MODEL_KEY);

  if (!apiKey || !provider) {
    return null;
  }

  return {
    apiKey,
    provider,
    model: model || (provider === 'openai' ? 'gpt-4.1' : 'claude-sonnet-4-6'),
  };
}

export function setAPISettings(settings: APISettings): void {
  sessionStorage.setItem(API_KEY_KEY, settings.apiKey);
  sessionStorage.setItem(API_PROVIDER_KEY, settings.provider);
  sessionStorage.setItem(API_MODEL_KEY, settings.model);
}

export function clearAPIKey(): void {
  sessionStorage.removeItem(API_KEY_KEY);
  sessionStorage.removeItem(API_PROVIDER_KEY);
  sessionStorage.removeItem(API_MODEL_KEY);
}

export function hasAPIKey(): boolean {
  return !!sessionStorage.getItem(API_KEY_KEY);
}

const defaultProgress: UserProgress = {
  challenges: {} as Record<QualityDimension, any>,
  totalCompleted: 0,
  dimensionsMastered: 0,
};

export function getProgress(): UserProgress {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (!stored) {
    return defaultProgress;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markLevelComplete(dimensionId: QualityDimension, level: number, score: number): void {
  const progress = getProgress();
  
  if (!progress.challenges[dimensionId]) {
    progress.challenges[dimensionId] = {
      dimensionId,
      completedLevels: [],
      attempts: [],
    };
  }

  const dimProgress = progress.challenges[dimensionId];
  
  dimProgress.attempts.push({
    level,
    passed: true,
    score,
    timestamp: Date.now(),
  });

  if (!dimProgress.completedLevels.includes(level)) {
    dimProgress.completedLevels.push(level);
    dimProgress.completedLevels.sort();
    
    progress.totalCompleted = Object.values(progress.challenges).reduce(
      (sum, p) => sum + p.completedLevels.length,
      0
    );
    
    progress.dimensionsMastered = Object.values(progress.challenges).filter(
      (p) => p.completedLevels.length === 3
    ).length;
  }

  saveProgress(progress);
}

export function getLevelProgress(dimensionId: QualityDimension): number[] {
  const progress = getProgress();
  return progress.challenges[dimensionId]?.completedLevels || [];
}

export function clearProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(CUSTOM_CHALLENGES_KEY);
  localStorage.removeItem(SAVED_CRITERIA_KEY);
}

export function getSavedCriteria(): SavedCriteria[] {
  const stored = localStorage.getItem(SAVED_CRITERIA_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveCriteria(criteria: SavedCriteria): void {
  const existing = getSavedCriteria();
  const filtered = existing.filter((c) => c.scenarioId !== criteria.scenarioId);
  filtered.push(criteria);
  localStorage.setItem(SAVED_CRITERIA_KEY, JSON.stringify(filtered));
}

export function clearAllSessionData(): void {
  sessionStorage.clear();
}

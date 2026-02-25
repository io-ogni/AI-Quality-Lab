import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertTriangle, Loader2, Star, Check, X, Lightbulb, WifiOff, KeyRound, Clock, ServerCrash,
  Info, CheckSquare, Code, ShieldAlert, Target, ListChecks, MessageCircle, RefreshCw, Anchor,
  BookCheck, ShieldCheck, Shield, Trophy, ChevronDown, ChevronUp,
} from 'lucide-react';
import { APIKeyRequired } from '@/components/api-key-required';
import { qualityDimensions, groupInfo, sandboxScenarios } from '@/lib/challenges-data';
import { getLevelProgress, getProgress, clearProgress, hasAPIKey } from '@/lib/storage';
import { evaluateSandboxCriteria, APIError } from '@/lib/api';
import type { APIErrorType } from '@/lib/api';
import { preValidateSandboxSubmission } from '@/lib/content-moderation';
import { hasPotentialPII } from '@/lib/pii-detection';
import type { QualityDimension, DimensionGroup, CriteriaEvaluation, SandboxScenario } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, any> = {
  CheckSquare, Code, ShieldAlert, Target, ListChecks,
  MessageCircle, RefreshCw, Anchor, BookCheck, ShieldCheck, Shield,
};

function ChallengeCard({ dimension }: { dimension: typeof qualityDimensions[0] }) {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    setCompletedLevels(getLevelProgress(dimension.id));
  }, [dimension.id]);

  const Icon = iconMap[dimension.icon] || Target;
  const progress = completedLevels.length;
  const progressPercent = (progress / 3) * 100;

  const getStatus = () => {
    if (progress === 3) return 'complete';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const status = getStatus();

  return (
    <Link href={`/eval/${dimension.id}`} className="block h-full" data-testid={`card-challenge-${dimension.id}`}>
      <Card className={`h-full hover-elevate active-elevate-2 transition-all cursor-pointer ${
        status === 'complete' ? 'border-green-500/30 bg-green-500/5' :
        status === 'in-progress' ? 'border-primary/30 bg-primary/5' : ''
      }`}>
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2.5 rounded-lg ${
              status === 'complete' ? 'bg-green-500/10' :
              status === 'in-progress' ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <Icon className={`h-5 w-5 ${
                status === 'complete' ? 'text-green-600' :
                status === 'in-progress' ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold leading-tight flex items-center gap-1.5">
                {dimension.name}
                {dimension.isAdvanced && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-amber-500/50 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                    Advanced
                  </Badge>
                )}
              </h3>
              <p className="text-muted-foreground mt-0.5 line-clamp-2">
                {dimension.description}
              </p>
              {dimension.advancedNote && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">{dimension.advancedNote}</p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium flex items-center gap-1">
                {progress}/3
                {progress === 3 && <Check className="h-3 w-3 text-green-600" />}
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DimensionGroupSection({ group, dimensions }: {
  group: DimensionGroup;
  dimensions: typeof qualityDimensions;
}) {
  const info = groupInfo[group];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-medium text-muted-foreground">{info.title}</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{info.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dimensions.map((dim) => (
          <ChallengeCard key={dim.id} dimension={dim} />
        ))}
      </div>
    </div>
  );
}

function ProgressSection() {
  const [progress, setProgress] = useState({ totalCompleted: 0, dimensionsMastered: 0 });
  const [levelProgress, setLevelProgress] = useState<Record<string, number[]>>({});
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const p = getProgress();
    setProgress(p);
    const levels: Record<string, number[]> = {};
    qualityDimensions.forEach((dim) => {
      levels[dim.id] = getLevelProgress(dim.id);
    });
    setLevelProgress(levels);
  }, []);

  const handleReset = () => {
    clearProgress();
    setProgress({ totalCompleted: 0, dimensionsMastered: 0 });
    setLevelProgress({});
    toast({
      title: 'Progress reset',
      description: 'All your challenge progress has been cleared.',
    });
  };

  const totalProgress = (progress.totalCompleted / 33) * 100;

  return (
    <Card data-testid="card-progress-section">
      <button
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
        data-testid="button-toggle-progress"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              Your Progress
              <Badge variant="secondary" className="font-normal text-xs">
                {progress.totalCompleted}/33
              </Badge>
            </span>
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <Progress value={totalProgress} className="h-2" />
        </CardContent>
      </button>

      {expanded && (
        <CardContent className="pt-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Guided Completed</p>
                  <p className="text-2xl font-bold" data-testid="text-challenges-completed">{progress.totalCompleted}/33</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions Mastered</p>
                  <p className="text-2xl font-bold" data-testid="text-dimensions-mastered">{progress.dimensionsMastered}/11</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-medium">Progress by Dimension</p>
            {qualityDimensions.map((dim) => {
              const completed = levelProgress[dim.id] || [];
              const progressPercent = (completed.length / 3) * 100;
              const isMastered = completed.length === 3;

              return (
                <div key={dim.id} className="flex items-center gap-3">
                  <div className="w-40 sm:w-48 flex items-center gap-2 shrink-0">
                    <span className="truncate">{dim.name}</span>
                    {isMastered && (
                      <Badge variant="secondary" className="shrink-0 text-xs px-1.5 py-0">
                        <Check className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Progress value={progressPercent} className="h-1.5" />
                  </div>
                  <span className="w-8 text-right text-sm text-muted-foreground shrink-0">
                    {completed.length}/3
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-reset-progress">
                  Reset Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your challenge progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} data-testid="button-confirm-reset">
                    Reset Progress
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function GuidedTab() {
  const evalRuntime = qualityDimensions.filter(d => d.group === 'eval-runtime');
  const evalFocused = qualityDimensions.filter(d => d.group === 'eval-focused');
  const requiresSystem = qualityDimensions.filter(d => d.group === 'requires-system-design');
  const security = qualityDimensions.filter(d => d.group === 'security');

  return (
    <div className="space-y-8">
      <APIKeyRequired />
      <ProgressSection />
      <DimensionGroupSection group="eval-runtime" dimensions={evalRuntime} />
      <DimensionGroupSection group="eval-focused" dimensions={evalFocused} />
      <DimensionGroupSection group="requires-system-design" dimensions={requiresSystem} />
      <DimensionGroupSection group="security" dimensions={security} />
    </div>
  );
}

function ScenarioCard({ scenario, selected, onClick }: {
  scenario: SandboxScenario;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer hover-elevate active-elevate-2 transition-all border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30 ${
        selected ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-100/60 dark:border-blue-700 dark:bg-blue-950/50' : ''
      }`}
      onClick={onClick}
      data-testid={`card-scenario-${scenario.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-blue-900 dark:text-blue-100">{scenario.name}</h3>
          {scenario.isSensitive && (
            <Badge variant="outline" className="shrink-0 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Sensitive
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-2">
          {scenario.context}
        </p>
      </CardContent>
    </Card>
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= score ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

type ScenarioDraft = { criteria: string; goodExample: string; badExample: string; result: CriteriaEvaluation | null };

function OpenTab() {
  const [selectedScenario, setSelectedScenario] = useState<SandboxScenario | null>(null);
  const [criteria, setCriteria] = useState('');
  const [goodExample, setGoodExample] = useState('');
  const [badExample, setBadExample] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CriteriaEvaluation | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [piiWarning, setPiiWarning] = useState(false);
  const [apiError, setApiError] = useState<{ errorType: APIErrorType; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const scenarioContentRef = useRef<HTMLDivElement>(null);
  const criteriaTextareaRef = useRef<HTMLTextAreaElement>(null);
  const draftsRef = useRef<Record<string, ScenarioDraft>>({});

  const checkPII = (text: string) => {
    const allText = `${criteria} ${goodExample} ${badExample} ${text}`;
    setPiiWarning(hasPotentialPII(allText));
  };

  useEffect(() => {
    setHasKey(hasAPIKey());
    const interval = setInterval(() => {
      setHasKey(hasAPIKey());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!selectedScenario || !hasKey) return;

    const validation = preValidateSandboxSubmission(criteria, goodExample, badExample);
    if (!validation.valid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach(e => {
        const key = e.field === 'good_example' ? 'goodExample' : e.field === 'bad_example' ? 'badExample' : e.field === 'both' ? 'goodExample' : e.field;
        if (!errorMap[key]) errorMap[key] = e.message;
        if (e.field === 'both' && !errorMap['badExample']) errorMap['badExample'] = e.message;
      });
      setFieldErrors(errorMap);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setApiError(null);
    try {
      const evalResult = await evaluateSandboxCriteria(selectedScenario, criteria, goodExample, badExample);
      setResult(evalResult);
    } catch (error) {
      if (error instanceof APIError) {
        setApiError({ errorType: error.errorType, message: error.userMessage });
      } else {
        setApiError({ errorType: 'UNKNOWN_ERROR', message: 'Something went wrong. Try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setApiError(null);
    setFieldErrors({});
    setCriteria('');
    setGoodExample('');
    setBadExample('');
  };

  return (
    <div className="space-y-8">
      <APIKeyRequired />

      <div>
        <h2 className="text-xl font-medium mb-4">Choose a scenario to evaluate</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sandboxScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              selected={selectedScenario?.id === scenario.id}
              onClick={() => {
                if (selectedScenario) {
                  if (result?.passed) {
                    delete draftsRef.current[selectedScenario.id];
                  } else {
                    draftsRef.current[selectedScenario.id] = { criteria, goodExample, badExample, result };
                  }
                }
                const draft = draftsRef.current[scenario.id];
                setCriteria(draft?.criteria || '');
                setGoodExample(draft?.goodExample || '');
                setBadExample(draft?.badExample || '');
                setResult(draft?.result || null);
                setPiiWarning(false);
                setApiError(null);
                setFieldErrors({});
                setSelectedScenario(scenario);
                setTimeout(() => {
                  scenarioContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => {
                    if (!draft?.result) {
                      criteriaTextareaRef.current?.focus({ preventScroll: true });
                    }
                  }, 400);
                }, 150);
              }}
            />
          ))}
        </div>
      </div>

      {selectedScenario && (
        <div ref={scenarioContentRef} className="space-y-6 scroll-mt-4">
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Scenario Context
                <Badge variant="secondary" className="font-normal">Read-only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm uppercase font-medium text-muted-foreground mb-1">System Prompt</p>
                <p className="bg-background/80 rounded p-2 border">{selectedScenario.systemPrompt}</p>
              </div>
              <div>
                <p className="text-sm uppercase font-medium text-muted-foreground mb-1">Test Input</p>
                <p className="bg-background/80 rounded p-2 border font-medium">
                  "{selectedScenario.testInput}"
                </p>
              </div>
            </CardContent>
          </Card>

          {selectedScenario.isSensitive && selectedScenario.sensitiveNote && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">This is a sensitive topic scenario</p>
                  <p className="text-muted-foreground">{selectedScenario.sensitiveNote}</p>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Define Your Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="block font-medium mb-2">
                    What makes a response GOOD? List your criteria.
                  </label>
                  <Textarea
                    ref={criteriaTextareaRef}
                    value={criteria}
                    onChange={(e) => {
                      if (e.target.value.length <= 1000) {
                        setCriteria(e.target.value);
                        checkPII(e.target.value);
                      }
                    }}
                    maxLength={1000}
                    placeholder={`e.g.,\n- Addresses the user's actual question\n- Stays within the bot's scope\n- Uses an appropriate tone`}
                    className="min-h-[120px] resize-none"
                    autoComplete="off"
                    data-gramm="false"
                    data-testid="textarea-criteria"
                  />
                  <div className="flex justify-between items-start mt-1">
                    <p className="text-sm text-muted-foreground">Be specific and measurable. What would you check for?</p>
                    {criteria.length >= 1000 ? (
                      <p className="text-sm text-red-500 shrink-0">Limit reached</p>
                    ) : null}
                  </div>
                  {fieldErrors.criteria && (
                    <p className="text-sm text-red-500 mt-1" data-testid="error-criteria">{fieldErrors.criteria}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Write an example of a PASSING response
                  </label>
                  <Textarea
                    value={goodExample}
                    onChange={(e) => {
                      if (e.target.value.length <= 2000) {
                        setGoodExample(e.target.value);
                        checkPII(e.target.value);
                      }
                    }}
                    maxLength={2000}
                    placeholder="Show what a response meeting your criteria looks like..."
                    className="min-h-[100px] resize-none"
                    autoComplete="off"
                    data-gramm="false"
                    data-testid="textarea-good-example"
                  />
                  {goodExample.length >= 2000 && (
                    <p className="text-sm text-red-500 mt-1">Limit reached</p>
                  )}
                  {fieldErrors.goodExample && (
                    <p className="text-sm text-red-500 mt-1" data-testid="error-good-example">{fieldErrors.goodExample}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Write an example of a FAILING response
                  </label>
                  <Textarea
                    value={badExample}
                    onChange={(e) => {
                      if (e.target.value.length <= 2000) {
                        setBadExample(e.target.value);
                        checkPII(e.target.value);
                      }
                    }}
                    maxLength={2000}
                    placeholder="Show what a response that fails your criteria looks like..."
                    className="min-h-[100px] resize-none"
                    autoComplete="off"
                    data-gramm="false"
                    data-testid="textarea-bad-example"
                  />
                  {badExample.length >= 2000 && (
                    <p className="text-sm text-red-500 mt-1">Limit reached</p>
                  )}
                  {fieldErrors.badExample && (
                    <p className="text-sm text-red-500 mt-1" data-testid="error-bad-example">{fieldErrors.badExample}</p>
                  )}
                </div>

                {piiWarning && (
                  <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-500 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Possible sensitive data detected. Use fictional examples only.</span>
                  </div>
                )}

                {!hasKey && <APIKeyRequired />}

                <Button
                  onClick={handleSubmit}
                  disabled={!hasKey || isSubmitting || criteria.length >= 1000 || goodExample.length >= 2000 || badExample.length >= 2000}
                  className="w-full sm:w-auto"
                  data-testid="button-run-evaluation"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit Criteria
                </Button>
              </CardContent>
            </Card>
          )}

          {apiError && !result && (
            <Card className="border-red-300 bg-red-50 dark:bg-red-950/30" data-testid="card-api-error">
              <CardContent className="p-5 space-y-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                  {apiError.errorType === 'NETWORK_ERROR' && <WifiOff className="h-5 w-5" />}
                  {apiError.errorType === 'AUTH_ERROR' && <KeyRound className="h-5 w-5" />}
                  {apiError.errorType === 'RATE_LIMIT' && <Clock className="h-5 w-5" />}
                  {(apiError.errorType === 'SERVER_ERROR' || apiError.errorType === 'TIMEOUT') && <ServerCrash className="h-5 w-5" />}
                  {!['NETWORK_ERROR', 'AUTH_ERROR', 'RATE_LIMIT', 'SERVER_ERROR', 'TIMEOUT'].includes(apiError.errorType) && <AlertTriangle className="h-5 w-5" />}
                  API Error
                </h4>
                <p className="text-sm text-red-800/80 dark:text-red-300/80">
                  {apiError.message}
                </p>
                {apiError.errorType === 'AUTH_ERROR' && (
                  <Link href="/settings">
                    <span className="text-sm text-red-800 dark:text-red-300 underline cursor-pointer">Go to Settings</span>
                  </Link>
                )}
                <Button onClick={() => setApiError(null)} variant="outline" data-testid="button-dismiss-api-error">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-6">
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Your Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm uppercase font-medium text-muted-foreground mb-1">Criteria</p>
                    <p className="bg-background/80 rounded p-2 border whitespace-pre-wrap">{criteria}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase font-medium text-muted-foreground mb-1">Good Example</p>
                    <p className="bg-background/80 rounded p-2 border whitespace-pre-wrap">{goodExample}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase font-medium text-muted-foreground mb-1">Bad Example</p>
                    <p className="bg-background/80 rounded p-2 border whitespace-pre-wrap">{badExample}</p>
                  </div>
                </CardContent>
              </Card>

              {!result.safetyCheck.isSafeDesign && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400 mb-1">
                        Safety Concern Detected
                      </p>
                      <p>{result.safetyCheck.safetyConcerns}</p>
                    </div>
                  </div>
                </div>
              )}

              <Card className={result.passed ? 'border-green-500/30' : ''}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-between flex-wrap gap-2">
                    <span>Overall Score</span>
                    <div className="flex items-center gap-2">
                      <StarRating score={result.overallScore} />
                      <Badge variant={result.passed ? 'default' : 'secondary'}>
                        {result.overallScore}/5
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3" data-testid="text-section-criteria">Your Criteria</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Specificity</span>
                          <span className="font-medium">{result.scores.specificity.score}/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.scores.specificity.feedback}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <span>Relevance</span>
                          <span className="font-medium">{result.scores.relevance.score}/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.scores.relevance.feedback}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <span>Completeness</span>
                          <span className="font-medium">{result.scores.completeness.score}/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.scores.completeness.feedback}</p>
                      </div>
                    </div>
                    {result.scores.safety && (
                      <div className="p-3 rounded-lg bg-muted/50 mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Safety & Appropriateness</span>
                          <span className="font-medium">{result.scores.safety.score}/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.scores.safety.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3" data-testid="text-section-good-example">Your Good Example</p>
                      <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Score</span>
                          <span className="font-medium">{result.scores.goodExample.score}/5</span>
                        </div>
                        {result.scores.goodExample.isGoodForScenario !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Good for Scenario?</span>
                            {result.scores.goodExample.isGoodForScenario
                              ? <Check className="h-4 w-4 text-green-600" />
                              : <X className="h-4 w-4 text-red-500" />}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">{result.scores.goodExample.feedback}</p>
                      </div>
                    </div>

                    <div>
                      <p className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3" data-testid="text-section-bad-example">Your Bad Example</p>
                      <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Score</span>
                          <span className="font-medium">{result.scores.badExample.score}/5</span>
                        </div>
                        {result.scores.badExample.isRealisticFailure !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Realistic Failure?</span>
                            {result.scores.badExample.isRealisticFailure
                              ? <Check className="h-4 w-4 text-green-600" />
                              : <X className="h-4 w-4 text-red-500" />}
                          </div>
                        )}
                        {result.scores.badExample.failureModeMatched && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-sm text-muted-foreground shrink-0">Matched:</span>
                            <span className="text-sm font-medium">{result.scores.badExample.failureModeMatched}</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">{result.scores.badExample.feedback}</p>
                      </div>
                    </div>
                  </div>

                  {result.strengths.length > 0 && (
                    <div>
                      <p className="font-medium mb-2 flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-green-600" />
                        Strengths
                      </p>
                      <ul className="text-muted-foreground space-y-1.5">
                        {result.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.criticalGaps.length > 0 && (
                    <div>
                      <p className="font-medium mb-2 flex items-center gap-1.5">
                        <X className="h-4 w-4 text-red-600" />
                        To Improve
                      </p>
                      <ul className="text-muted-foreground space-y-1.5">
                        {result.criticalGaps.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestion && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {result.suggestion}
                      </p>
                    </div>
                  )}

                  <Button onClick={handleReset} variant="secondary" data-testid="button-try-again">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Practice() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tabParam = params.get('tab');
  const [activeTab, setActiveTab] = useState<'guided' | 'open'>(tabParam === 'open' ? 'open' : 'guided');

  useEffect(() => {
    const newParams = new URLSearchParams(searchString);
    const t = newParams.get('tab');
    if (t === 'open' || t === 'guided') {
      setActiveTab(t);
    }
  }, [searchString]);

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-10 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-practice-title">
            Criteria Lab
          </h1>
          <p className="text-muted-foreground">
            Define what "good" looks like. Practice writing quality criteria through guided challenges and open scenarios.
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            Uses your LLM API key
          </span>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-muted/80 border mb-4" data-testid="tabs-practice">
            <button
              onClick={() => setActiveTab('guided')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'guided'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-accent'
              }`}
              data-testid="tab-guided"
            >
              Guided Exercises
            </button>
            <button
              onClick={() => setActiveTab('open')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'open'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-accent'
              }`}
              data-testid="tab-open"
            >
              Open Scenarios
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {activeTab === 'guided'
              ? '33 exercises across 11 quality dimensions. Fixed scenarios, expert comparison.'
              : '6 realistic scenarios. Write your own criteria and examples from scratch.'}
          </p>

          {activeTab === 'guided' ? <GuidedTab /> : <OpenTab />}
        </div>
      </section>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Loader2, Star, Check, X, Lightbulb, WifiOff, KeyRound, Clock, ServerCrash } from 'lucide-react';
import { APIKeyRequired } from '@/components/api-key-required';
import { sandboxScenarios } from '@/lib/challenges-data';
import { hasAPIKey } from '@/lib/storage';
import { evaluateSandboxCriteria, APIError } from '@/lib/api';
import type { APIErrorType } from '@/lib/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { CriteriaEvaluation, SandboxScenario } from '@/lib/types';
import { useEffect } from 'react';
import { hasPotentialPII } from '@/lib/pii-detection';

function ScenarioCard({ scenario, selected, onClick }: { 
  scenario: SandboxScenario; 
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Card 
      className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
        selected ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={onClick}
      data-testid={`card-scenario-${scenario.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium">{scenario.name}</h3>
          {scenario.isSensitive && (
            <Badge variant="outline" className="shrink-0 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Sensitive
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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

export default function Sandbox() {
  const [selectedScenario, setSelectedScenario] = useState<SandboxScenario | null>(null);
  const [criteria, setCriteria] = useState('');
  const [goodExample, setGoodExample] = useState('');
  const [badExample, setBadExample] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CriteriaEvaluation | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [piiWarning, setPiiWarning] = useState(false);
  const [apiError, setApiError] = useState<{ errorType: APIErrorType; message: string } | null>(null);
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
    if (!selectedScenario || !criteria.trim() || !goodExample.trim() || !badExample.trim() || !hasKey) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    try {
      const evalResult = await evaluateSandboxCriteria(
        selectedScenario,
        criteria,
        goodExample,
        badExample
      );
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
    setCriteria('');
    setGoodExample('');
    setBadExample('');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-10 border-b">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-sandbox-title">
            Define Quality Criteria
          </h1>
          <p className="text-muted-foreground">
            Pick a scenario. Define what a good response looks like. We'll score how well you defined it.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <APIKeyRequired />

          <div>
            <h2 className="text-lg font-medium mb-4">Choose a scenario to evaluate</h2>
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
                    setSelectedScenario(scenario);
                    setTimeout(() => {
                      scenarioContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      if (!draft?.result) {
                        criteriaTextareaRef.current?.focus();
                      }
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
                    <p className="text-xs uppercase font-medium text-muted-foreground mb-1">System Prompt</p>
                    <p className="text-sm bg-background/80 rounded p-2 border">{selectedScenario.systemPrompt}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Test Input</p>
                    <p className="text-sm bg-background/80 rounded p-2 border font-medium">
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
                      <p className="font-medium text-sm mb-1">This is a sensitive topic scenario</p>
                      <p className="text-sm text-muted-foreground">{selectedScenario.sensitiveNote}</p>
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
                      <label className="block text-sm font-medium mb-2">
                        What makes a response GOOD? List your criteria.
                      </label>
                      <Textarea
                        ref={criteriaTextareaRef}
                        value={criteria}
                        onChange={(e) => {
                          setCriteria(e.target.value);
                          checkPII(e.target.value);
                        }}
                        placeholder={`e.g.,\n- Addresses the user's actual question\n- Stays within the bot's scope\n- Uses an appropriate tone`}
                        className="min-h-[120px] resize-none"
                        autoComplete="off"
                        data-gramm="false"
                        data-testid="textarea-criteria"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Be specific and measurable. What would you check for?</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Write an example of a PASSING response
                      </label>
                      <Textarea
                        value={goodExample}
                        onChange={(e) => {
                          setGoodExample(e.target.value);
                          checkPII(e.target.value);
                        }}
                        placeholder="Show what a response meeting your criteria looks like..."
                        className="min-h-[100px] resize-none"
                        autoComplete="off"
                        data-gramm="false"
                        data-testid="textarea-good-example"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Write an example of a FAILING response
                      </label>
                      <Textarea
                        value={badExample}
                        onChange={(e) => {
                          setBadExample(e.target.value);
                          checkPII(e.target.value);
                        }}
                        placeholder="Show what a response that fails your criteria looks like..."
                        className="min-h-[100px] resize-none"
                        autoComplete="off"
                        data-gramm="false"
                        data-testid="textarea-bad-example"
                      />
                    </div>

                    {piiWarning && (
                      <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-500 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>Possible sensitive data detected. Use fictional examples only.</span>
                      </div>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-block">
                          <Button
                            onClick={handleSubmit}
                            disabled={!criteria.trim() || !goodExample.trim() || !badExample.trim() || !hasKey || isSubmitting}
                            className="w-full sm:w-auto"
                            data-testid="button-run-evaluation"
                          >
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Run Evaluation
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!hasKey && (
                        <TooltipContent>Add API key in Settings first</TooltipContent>
                      )}
                    </Tooltip>
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
                        <span className="text-sm text-red-800 dark:text-red-300 underline cursor-pointer">Go to Settings →</span>
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
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Criteria</p>
                        <p className="bg-background/80 rounded p-2 border whitespace-pre-wrap">{criteria}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Good Example</p>
                        <p className="bg-background/80 rounded p-2 border whitespace-pre-wrap">{goodExample}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Bad Example</p>
                        <p className="bg-background/80 rounded p-2 border whitespace-pre-wrap">{badExample}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {!result.safetyCheck.isSafeDesign && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-red-700 dark:text-red-400 mb-1">
                            Safety Concern Detected
                          </p>
                          <p className="text-sm">{result.safetyCheck.safetyConcerns}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.exampleWarnings && result.exampleWarnings.length > 0 && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-4" data-testid="card-example-warnings">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        Possible Issue Detected
                      </div>
                      <ul className="space-y-1.5">
                        {result.exampleWarnings.map((w, i) => (
                          <li key={i} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>{w.message}</span>
                          </li>
                        ))}
                      </ul>
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
                        <p className="text-sm font-medium mb-3" data-testid="text-section-criteria">Your Criteria</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Specificity</span>
                              <span className="font-medium">{result.scores.specificity.score}/5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.scores.specificity.feedback}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Relevance</span>
                              <span className="font-medium">{result.scores.relevance.score}/5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.scores.relevance.feedback}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Completeness</span>
                              <span className="font-medium">{result.scores.completeness.score}/5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.scores.completeness.feedback}</p>
                          </div>
                        </div>
                        {result.scores.safety && (
                          <div className="p-3 rounded-lg bg-muted/50 mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">Safety & Appropriateness</span>
                              <span className="font-medium">{result.scores.safety.score}/5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{result.scores.safety.feedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium mb-3" data-testid="text-section-good-example">Your Good Example</p>
                          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Score</span>
                              <span className="font-medium">{result.scores.goodExample.score}/5</span>
                            </div>
                            {result.scores.goodExample.meetsUserCriteria !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Meets Your Criteria?</span>
                                {result.scores.goodExample.meetsUserCriteria
                                  ? <Check className="h-4 w-4 text-green-600" />
                                  : <X className="h-4 w-4 text-red-500" />}
                              </div>
                            )}
                            {result.scores.goodExample.isGoodForScenario !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Good for Scenario?</span>
                                {result.scores.goodExample.isGoodForScenario
                                  ? <Check className="h-4 w-4 text-green-600" />
                                  : <X className="h-4 w-4 text-red-500" />}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">{result.scores.goodExample.feedback}</p>
                            {result.scores.goodExample.criteriaCheck && result.scores.goodExample.criteriaCheck.length > 0 && (
                              <div className="mt-2 pt-2 border-t space-y-1.5">
                                <p className="text-xs font-medium text-muted-foreground">Criterion-by-criterion:</p>
                                {result.scores.goodExample.criteriaCheck.map((cc, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-xs">
                                    {cc.met
                                      ? <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                                      : <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />}
                                    <span className="text-muted-foreground">
                                      <span className="font-medium">{cc.criterion}:</span> {cc.reason}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-3" data-testid="text-section-bad-example">Your Bad Example</p>
                          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Score</span>
                              <span className="font-medium">{result.scores.badExample.score}/5</span>
                            </div>
                            {result.scores.badExample.violatesUserCriteria !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Violates Your Criteria?</span>
                                {result.scores.badExample.violatesUserCriteria
                                  ? <Check className="h-4 w-4 text-green-600" />
                                  : <X className="h-4 w-4 text-red-500" />}
                              </div>
                            )}
                            {result.scores.badExample.isRealisticFailure !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Realistic Failure?</span>
                                {result.scores.badExample.isRealisticFailure
                                  ? <Check className="h-4 w-4 text-green-600" />
                                  : <X className="h-4 w-4 text-red-500" />}
                              </div>
                            )}
                            {result.scores.badExample.isRealisticFailure === false && result.scores.badExample.scenarioAlignment && (
                              <p className="text-xs text-yellow-700 bg-yellow-50 rounded p-1.5 mt-1" data-testid="text-scenario-alignment">
                                {result.scores.badExample.scenarioAlignment}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">{result.scores.badExample.feedback}</p>
                            {result.scores.badExample.criteriaCheck && result.scores.badExample.criteriaCheck.length > 0 && (
                              <div className="mt-2 pt-2 border-t space-y-1.5">
                                <p className="text-xs font-medium text-muted-foreground">Criterion-by-criterion:</p>
                                {result.scores.badExample.criteriaCheck.map((cc, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-xs">
                                    {cc.met
                                      ? <X className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                      : <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />}
                                    <span className="text-muted-foreground">
                                      <span className="font-medium">{cc.criterion}:</span> {cc.reason}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {result.strengths.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-green-600" />
                            Strengths
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.strengths.map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.criticalGaps.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                            <X className="h-4 w-4 text-red-600" />
                            To Improve
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.criticalGaps.map((g, i) => (
                              <li key={i}>• {g}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.suggestion && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-sm flex items-start gap-2">
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
      </section>
    </div>
  );
}

import { useParams, Link } from 'wouter';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Lock, Lightbulb, ChevronDown, Check, X, AlertTriangle, Loader2, WifiOff, KeyRound, Clock, ServerCrash } from 'lucide-react';
import { APIKeyRequired } from '@/components/api-key-required';
import { challenges, qualityDimensions } from '@/lib/challenges-data';
import { getLevelProgress, hasAPIKey, markLevelComplete } from '@/lib/storage';
import type { QualityDimension, ChallengeLevel, ChallengeResult } from '@/lib/types';
import { evaluateCriteria, detectWrongInputType, APIError } from '@/lib/api';
import type { APIErrorType } from '@/lib/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { hasPotentialPII } from '@/lib/pii-detection';

export default function EvalChallenge() {
  const params = useParams<{ evalId: string }>();
  const evalId = params.evalId as QualityDimension;
  
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [userCriteria, setUserCriteria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [piiWarning, setPiiWarning] = useState(false);
  const [attackWarning, setAttackWarning] = useState<string | null>(null);
  const [apiError, setApiError] = useState<{ errorType: APIErrorType; message: string } | null>(null);
  const criteriaTextareaRef = useRef<HTMLTextAreaElement>(null);

  const challenge = challenges[evalId];
  const dimensionInfo = qualityDimensions.find(d => d.id === evalId);

  useEffect(() => {
    setCompletedLevels(getLevelProgress(evalId));
    setHasKey(hasAPIKey());
    
    const interval = setInterval(() => {
      setHasKey(hasAPIKey());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [evalId]);

  useEffect(() => {
    setUserCriteria('');
    setResult(null);
    setAttackWarning(null);
    setHintOpen(false);
    window.scrollTo(0, 0);
    setTimeout(() => {
      criteriaTextareaRef.current?.focus({ preventScroll: true });
    }, 100);
  }, [currentLevel, evalId]);

  if (!challenge || !dimensionInfo) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Challenge not found</h1>
          <Link href="/challenges">
            <Button variant="outline">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const levelData = challenge.levels[currentLevel - 1];
  const isLevelLocked = (level: number) => {
    if (level === 1) return false;
    return !completedLevels.includes(level - 1);
  };

  const handleSubmit = async () => {
    if (!userCriteria.trim() || !hasKey) return;

    const attack = detectWrongInputType(userCriteria);
    if (attack?.isAttack) {
      setAttackWarning(userCriteria.substring(0, 50));
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    try {
      const evalResult = await evaluateCriteria(
        evalId,
        currentLevel,
        userCriteria,
        levelData
      );
      if (evalResult.wrongInputType) {
        setAttackWarning(userCriteria.substring(0, 50));
        return;
      }
      setResult(evalResult);
      
      if (evalResult.passed) {
        markLevelComplete(evalId, currentLevel, evalResult.coverageScore);
        setCompletedLevels(getLevelProgress(evalId));
      }
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

  const handleTryAgain = () => {
    setResult(null);
    setAttackWarning(null);
    setApiError(null);
    setUserCriteria('');
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel((currentLevel + 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-6 border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/challenges" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4" data-testid="link-back-challenges">
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold" data-testid="text-challenge-title">
            {dimensionInfo.name}
          </h1>
          <p className="text-muted-foreground mt-1">{challenge.about}</p>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Tabs value={`level-${currentLevel}`}>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 2, 3].map((level) => {
                const locked = isLevelLocked(level);
                const completed = completedLevels.includes(level);
                const active = currentLevel === level;

                return (
                  <button
                    key={level}
                    disabled={locked}
                    onClick={() => {
                      if (!locked) {
                        setCurrentLevel(level as 1 | 2 | 3);
                        setApiError(null);
                        setResult(null);
                        setAttackWarning(null);
                      }
                    }}
                    data-testid={`tab-level-${level}`}
                    className={`
                      relative flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all border-2
                      ${completed && !active
                        ? 'border-green-500/40 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                        : active
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : locked
                            ? 'border-muted bg-muted/50 text-muted-foreground/50 cursor-not-allowed opacity-60'
                            : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                      }
                    `}
                  >
                    {completed ? (
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    ) : locked ? (
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted-foreground/20">
                        <Lock className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${active ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                        {level}
                      </div>
                    )}
                    <span>Level {level}</span>
                  </button>
                );
              })}
            </div>

            {[1, 2, 3].map((level) => (
              <TabsContent key={level} value={`level-${level}`} className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{challenge.levels[level - 1].title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Define the success criteria for evaluating this bot's response
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-xs uppercase font-medium text-muted-foreground mb-2">Scenario</p>
                        <p className="text-sm font-medium mb-3">{challenge.levels[level - 1].scenario.botContext}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs uppercase font-medium text-muted-foreground mb-1">System Prompt</p>
                            <p className="text-sm bg-background/80 rounded p-2 border">
                              {challenge.levels[level - 1].scenario.systemPrompt}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Test Input</p>
                            <p className="text-sm bg-background/80 rounded p-2 border font-medium">
                              "{challenge.levels[level - 1].scenario.testInput}"
                            </p>
                          </div>

                          {challenge.levels[level - 1].scenario.contextDocument && (
                            <div>
                              <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Context Document</p>
                              <p className="text-sm bg-background/80 rounded p-2 border">
                                {challenge.levels[level - 1].scenario.contextDocument}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Collapsible open={hintOpen} onOpenChange={setHintOpen}>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Lightbulb className="h-4 w-4" />
                          <span>Show hint</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${hintOpen ? 'rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                          <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
                            <p className="text-sm">{challenge.levels[level - 1].hint}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </Card>

                {!result && !attackWarning && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Your Criteria</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        What criteria would you use to evaluate the response?
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        ref={criteriaTextareaRef}
                        value={userCriteria}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUserCriteria(value);
                          setPiiWarning(hasPotentialPII(value));
                        }}
                        placeholder={`List what a GOOD response should do, e.g.:\n- Responds directly to the question\n- Keeps response under 100 words\n- Acknowledges the user's concern`}
                        className="min-h-[150px] resize-none"
                        autoComplete="off"
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-testid="textarea-criteria"
                      />
                      {piiWarning && (
                        <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-500 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>Possible sensitive data detected. Use fictional examples only.</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Be specific. What should a passing response do?
                      </p>
                      
                      <APIKeyRequired />
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block">
                            <Button
                              onClick={handleSubmit}
                              disabled={!userCriteria.trim() || !hasKey || isSubmitting}
                              className="w-full sm:w-auto"
                              data-testid="button-submit-criteria"
                            >
                              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Submit Criteria
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

                {attackWarning && !result && (
                  <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30" data-testid="card-attack-warning">
                    <CardContent className="p-5 space-y-4">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        That's an attack, not criteria
                      </h4>
                      <p className="text-sm text-amber-800/80 dark:text-amber-300/80">
                        You wrote something that looks like a prompt injection. But your task is to
                        define how to JUDGE whether the bot resists attacks — not to attack it yourself.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Try: "Does NOT follow the injected instruction" or "Stays in character"</span>
                      </div>
                      <Button onClick={handleTryAgain} variant="outline" data-testid="button-try-again-attack">
                        Try Again
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
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Expert Criteria</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Here's what matters for this scenario:
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {levelData.expertCriteria.map((criterion) => (
                            <li key={criterion.id} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              {criterion.text}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Criteria Comparison</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.matches.length > 0 && (
                          <div className="space-y-2">
                            {result.matches.map((match, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm p-2 rounded bg-green-500/10 border border-green-500/20">
                                <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-green-700 dark:text-green-400">You identified:</span>{' '}
                                  <span className="italic">"{match.userVersion}"</span>{' '}
                                  <span className="text-muted-foreground">matches</span>{' '}
                                  <span className="font-medium">{match.expertCriterion}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {result.missed.length > 0 && (
                          <div className="space-y-2">
                            {result.missed.map((missed, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm p-2 rounded bg-red-500/10 border border-red-500/20">
                                <X className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-red-700 dark:text-red-400">You missed:</span>{' '}
                                  <span className="font-medium">{missed}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {result.vague.length > 0 && (
                          <div className="space-y-2">
                            {result.vague.map((vague, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm p-2 rounded bg-amber-500/10 border border-amber-500/20">
                                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-amber-700 dark:text-amber-400">Too vague:</span>{' '}
                                  <span className="italic">"{vague}"</span>{' '}
                                  <span className="text-muted-foreground">— not specific enough to count</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className={result.passed ? 'border-green-500/30' : 'border-red-500/30'}>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          Your Score
                          <Badge variant={result.passed ? 'default' : 'destructive'}>
                            {result.passed ? 'PASSED' : 'FAILED'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold">{result.coverageScore}/{levelData.expertCriteria.length}</p>
                            <p className="text-xs text-muted-foreground">Coverage</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold">{result.specificityScore}/5</p>
                            <p className="text-xs text-muted-foreground">Specificity</p>
                          </div>
                        </div>
                        
                        <p className="text-sm">{result.feedback}</p>

                        <div className="flex flex-wrap gap-3 pt-2">
                          {result.passed ? (
                            currentLevel < 3 ? (
                              <Button onClick={handleNextLevel} data-testid="button-next-level">
                                Continue to Level {currentLevel + 1}
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 text-green-600">
                                <Check className="h-5 w-5" />
                                <span className="font-medium">Challenge Complete!</span>
                              </div>
                            )
                          ) : (
                            <Button onClick={handleTryAgain} variant="secondary" data-testid="button-try-again">
                              Try Again
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}

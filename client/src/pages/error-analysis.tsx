import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Info,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  TRACES,
  TASKPILOT_CONTEXT,
  EXPERT_TAXONOMY,
  WHATS_NEXT,
  PHASE1_INTRO_TEXT,
  PHASE2_INTRO_TEXT,
  LANDING_INTRO_TEXT,
  PRODUCT_BRIEFING_NOTE,
  FINAL_INSIGHT_TEXT,
  getErrorAnalysisProgress,
  saveErrorAnalysisProgress,
  resetPhase1,
  resetPhase2,
} from "@/lib/error-analysis-data";
import type { ErrorAnalysisProgress, Phase1Response } from "@/lib/error-analysis-data";

type Screen = "landing" | "briefing" | "phase1-intro" | "phase1" | "phase1-summary" | "phase2" | "phase2-summary";

function ContextPanel({ defaultOpen }: { defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
        data-testid="button-context-toggle"
      >
        <Info className="h-4 w-4" />
        Context
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </Button>
      {open && (
        <Card className="mt-3 bg-muted/30 border-primary/20">
          <CardContent className="p-4 space-y-3 text-sm">
            <h4 className="font-semibold">{TASKPILOT_CONTEXT.title}</h4>
            <p className="text-muted-foreground">{TASKPILOT_CONTEXT.description}</p>
            <div>
              <p className="font-medium mb-1">TaskPilot features:</p>
              <p className="text-muted-foreground">{TASKPILOT_CONTEXT.features}</p>
              <p className="text-muted-foreground italic mt-1">{TASKPILOT_CONTEXT.featureNote}</p>
            </div>
            <div>
              <p className="font-medium mb-1">What the assistant knows:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
                {TASKPILOT_CONTEXT.assistantKnows.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">What it should NOT do:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
                {TASKPILOT_CONTEXT.shouldNotDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TraceDisplay({ trace }: { trace: typeof TRACES[0] }) {
  return (
    <div className="space-y-3">
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">User</p>
          <p className="whitespace-pre-wrap">{trace.userQuery}</p>
        </CardContent>
      </Card>
      <Card className="bg-card border">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">TaskPilot Assistant</p>
          <p className="whitespace-pre-wrap">{trace.botResponse}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ExpertFeedback({
  trace,
  userVerdict,
  userNotes,
}: {
  trace: typeof TRACES[0];
  userVerdict: "pass" | "fail";
  userNotes?: string;
}) {
  const agrees = userVerdict === trace.expertVerdict;
  const isBorderline = trace.isBorderline;

  let bannerClass: string;
  let bannerText: string;

  if (agrees) {
    bannerClass = "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300";
    bannerText = "You agree with the expert.";
  } else if (isBorderline) {
    bannerClass = "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300";
    bannerText = "This one's genuinely debatable. Reasonable evaluators can disagree.";
  } else {
    bannerClass = "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300";
    bannerText = userVerdict === "pass" && trace.expertVerdict === "fail"
      ? "The expert flagged this as a failure."
      : "The expert marked this as a pass.";
  }

  return (
    <div className="mt-4 space-y-3" data-testid="expert-feedback">
      <Card className={bannerClass}>
        <CardContent className="p-3">
          <p className="text-sm font-medium">{bannerText}</p>
        </CardContent>
      </Card>
      <div className={`grid gap-3 ${userVerdict === "fail" && userNotes ? "md:grid-cols-2" : ""}`}>
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Expert notes</p>
            <p className="text-sm">{trace.expertNotes}</p>
            {trace.isBorderline && (
              <Badge variant="outline" className="mt-2 text-xs">Borderline</Badge>
            )}
          </CardContent>
        </Card>
        {userVerdict === "fail" && userNotes && (
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Your notes</p>
              <p className="text-sm">{userNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function CategoryInput({
  value,
  onChange,
  existingCategories,
  traceId,
}: {
  value: string;
  onChange: (val: string) => void;
  existingCategories: string[];
  traceId: number;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = existingCategories.filter(
    (c) => c.toLowerCase().includes(value.toLowerCase()) && c.toLowerCase() !== value.toLowerCase()
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Type a category name..."
        className="w-full px-3 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        data-testid={`input-category-trace-${traceId}`}
      />
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md max-h-32 overflow-y-auto">
          {filtered.map((cat) => (
            <button
              key={cat}
              type="button"
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(cat);
                setShowSuggestions(false);
              }}
              data-testid={`suggestion-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ErrorAnalysis() {
  const [progress, setProgress] = useState<ErrorAnalysisProgress>(getErrorAnalysisProgress);
  const [screen, setScreen] = useState<Screen>("landing");
  const [userVerdict, setUserVerdict] = useState<"pass" | "fail" | null>(null);
  const [failNotes, setFailNotes] = useState("");
  const [notesSubmitted, setNotesSubmitted] = useState(false);
  const [viewingPrevious, setViewingPrevious] = useState(false);
  const [viewingTraceId, setViewingTraceId] = useState<number | null>(null);
  const [actualCurrentTrace, setActualCurrentTrace] = useState<number>(1);
  const [taxonomyMap, setTaxonomyMap] = useState<Record<number, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const p = getErrorAnalysisProgress();
    setProgress(p);

    setActualCurrentTrace(p.currentTrace);

    if (p.phase2.completed) {
      setScreen("phase2-summary");
      rebuildTaxonomyMap(p);
    } else if (p.currentPhase === 2 && p.phase1.completed) {
      setScreen("phase2");
      rebuildTaxonomyMap(p);
    } else if (p.phase1.completed) {
      setScreen("phase1-summary");
    } else if (p.phase1.responses.length > 0 || p.contextSeen) {
      setScreen("phase1");
    }
  }, []);

  function rebuildTaxonomyMap(p: ErrorAnalysisProgress) {
    const map: Record<number, string> = {};
    for (const cat of p.phase2.categories) {
      for (const tid of cat.noteTraceIds) {
        map[tid] = cat.name;
      }
    }
    setTaxonomyMap(map);
  }

  function save(updated: ErrorAnalysisProgress) {
    setProgress(updated);
    saveErrorAnalysisProgress(updated);
  }

  const currentTrace = TRACES.find((t) => t.id === progress.currentTrace) || TRACES[0];
  const currentResponse = progress.phase1.responses.find((r) => r.traceId === progress.currentTrace);
  const isSubmitted = !!currentResponse;

  const failureNotes = progress.phase1.responses.filter((r) => r.userVerdict === "fail" && r.userNotes);

  const handlePass = useCallback(() => {
    if (isSubmitted || viewingPrevious || userVerdict) return;
    setUserVerdict("pass");

    const updated = { ...progress };
    const response: Phase1Response = {
      traceId: progress.currentTrace,
      userVerdict: "pass",
      timestamp: new Date().toISOString(),
    };
    updated.phase1 = {
      ...updated.phase1,
      responses: [...updated.phase1.responses.filter((r) => r.traceId !== progress.currentTrace), response],
    };
    save(updated);
  }, [isSubmitted, viewingPrevious, userVerdict, progress]);

  const handleFail = useCallback(() => {
    if (isSubmitted || viewingPrevious || userVerdict) return;
    setUserVerdict("fail");
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [isSubmitted, viewingPrevious, userVerdict]);

  const handleSubmitNotes = useCallback(() => {
    if (!failNotes.trim()) return;
    setNotesSubmitted(true);

    const updated = { ...progress };
    const response: Phase1Response = {
      traceId: progress.currentTrace,
      userVerdict: "fail",
      userNotes: failNotes.trim(),
      timestamp: new Date().toISOString(),
    };
    updated.phase1 = {
      ...updated.phase1,
      responses: [...updated.phase1.responses.filter((r) => r.traceId !== progress.currentTrace), response],
    };
    save(updated);
  }, [failNotes, progress]);

  const handleNext = useCallback(() => {
    if (viewingPrevious) {
      if (viewingTraceId !== null && viewingTraceId < actualCurrentTrace - 1) {
        const nextViewId = viewingTraceId + 1;
        setViewingTraceId(nextViewId);
        const resp = progress.phase1.responses.find((r) => r.traceId === nextViewId);
        if (resp) {
          setUserVerdict(resp.userVerdict);
          setFailNotes(resp.userNotes || "");
          setNotesSubmitted(true);
        }
        const updated = { ...progress, currentTrace: nextViewId };
        save(updated);
      } else {
        setViewingPrevious(false);
        setViewingTraceId(null);
        const updated = { ...progress, currentTrace: actualCurrentTrace };
        save(updated);
        setUserVerdict(null);
        setFailNotes("");
        setNotesSubmitted(false);
      }
      return;
    }

    if (progress.currentTrace >= 25) {
      const updated = { ...progress };
      updated.phase1 = { ...updated.phase1, completed: true };
      save(updated);
      setScreen("phase1-summary");
    } else {
      const nextTrace = progress.currentTrace + 1;
      const updated = { ...progress, currentTrace: nextTrace };
      save(updated);
      setActualCurrentTrace(nextTrace);
    }
    setUserVerdict(null);
    setFailNotes("");
    setNotesSubmitted(false);
  }, [progress, viewingPrevious, viewingTraceId, actualCurrentTrace]);

  const handleBack = useCallback(() => {
    const displayedTrace = viewingPrevious && viewingTraceId !== null ? viewingTraceId : progress.currentTrace;
    if (displayedTrace <= 1) return;

    if (!viewingPrevious) {
      setViewingPrevious(true);
      setActualCurrentTrace(progress.currentTrace);
    }

    const prevTrace = displayedTrace - 1;
    setViewingTraceId(prevTrace);
    const prevResponse = progress.phase1.responses.find((r) => r.traceId === prevTrace);
    if (prevResponse) {
      setUserVerdict(prevResponse.userVerdict);
      setFailNotes(prevResponse.userNotes || "");
      setNotesSubmitted(true);
    } else {
      setUserVerdict(null);
      setFailNotes("");
      setNotesSubmitted(false);
    }
    const updated = { ...progress, currentTrace: prevTrace };
    save(updated);
  }, [progress, viewingPrevious, viewingTraceId]);

  useEffect(() => {
    if (screen !== "phase1") return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      if (e.key.toLowerCase() === "p") {
        handlePass();
      } else if (e.key.toLowerCase() === "f") {
        handleFail();
      } else if (e.key.toLowerCase() === "n") {
        const hasVerdict = userVerdict === "pass" || (userVerdict === "fail" && notesSubmitted) || isSubmitted;
        if (hasVerdict) handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, handlePass, handleFail, handleNext, userVerdict, notesSubmitted, isSubmitted]);

  const showFeedback = userVerdict === "pass" || (userVerdict === "fail" && notesSubmitted) || isSubmitted;

  if (screen === "landing") {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2" data-testid="text-error-analysis-title">
              Error Analysis Lab
            </h1>
            <p className="text-muted-foreground mb-8">No API key needed</p>

            <div className="aspect-video mb-8 rounded-lg overflow-hidden border bg-black">
              <iframe
                src="https://www.youtube.com/embed/BJbddhHhGPg"
                title="Error Analysis — The Skill That Actually Matters"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                data-testid="video-error-analysis"
              />
            </div>

            <p className="text-muted-foreground mb-8">{LANDING_INTRO_TEXT}</p>

            <Button
              size="lg"
              onClick={() => setScreen("briefing")}
              data-testid="button-start-lab"
            >
              Start the Lab
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "briefing") {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground italic mb-6" data-testid="text-briefing-note">
              {PRODUCT_BRIEFING_NOTE}
            </p>

            <Card className="mb-8">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">{TASKPILOT_CONTEXT.title}</h2>
                <p className="text-muted-foreground">{TASKPILOT_CONTEXT.description}</p>
                <div>
                  <p className="font-medium mb-1">TaskPilot features:</p>
                  <p className="text-muted-foreground">{TASKPILOT_CONTEXT.features}</p>
                  <p className="text-muted-foreground italic mt-1">{TASKPILOT_CONTEXT.featureNote}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">What the assistant knows:</p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
                    {TASKPILOT_CONTEXT.assistantKnows.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">What it should NOT do:</p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-0.5">
                    {TASKPILOT_CONTEXT.shouldNotDo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              onClick={() => {
                const updated = { ...progress, contextSeen: true };
                save(updated);
                setScreen("phase1-intro");
              }}
              data-testid="button-got-it"
            >
              Got it — Start Reviewing
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "phase1-intro") {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Phase 1: Review</h2>
            <Card className="mb-8">
              <CardContent className="p-6">
                {PHASE1_INTRO_TEXT.split("\n\n").map((p, i) => (
                  <p key={i} className={`text-muted-foreground ${i > 0 ? "mt-3" : ""}`}>{p}</p>
                ))}
              </CardContent>
            </Card>
            <Button
              size="lg"
              onClick={() => setScreen("phase1")}
              data-testid="button-begin-review"
            >
              Begin Review
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "phase1") {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Phase 1: Review</h2>
              <span className="text-sm text-muted-foreground" data-testid="text-trace-progress">
                Trace {progress.currentTrace} of 25
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 mb-6">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${(progress.currentTrace / 25) * 100}%` }}
              />
            </div>

            <ContextPanel defaultOpen={!progress.contextSeen} />

            <TraceDisplay trace={currentTrace} />

            {viewingPrevious && (
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">Read-only — already submitted</Badge>
              </div>
            )}

            {!viewingPrevious && !userVerdict && !isSubmitted && (
              <div className="flex gap-3 mt-6" data-testid="verdict-buttons">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handlePass}
                  data-testid="button-pass"
                >
                  <Check className="h-4 w-4" /> Pass
                  <kbd className="ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">P</kbd>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleFail}
                  data-testid="button-fail"
                >
                  <X className="h-4 w-4" /> Fail
                  <kbd className="ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">F</kbd>
                </Button>
              </div>
            )}

            {userVerdict === "fail" && !notesSubmitted && !isSubmitted && (
              <div className="mt-4 space-y-3" data-testid="fail-notes-section">
                <Textarea
                  ref={textareaRef}
                  value={failNotes}
                  onChange={(e) => setFailNotes(e.target.value)}
                  placeholder="What's wrong with this response? Be specific."
                  className="min-h-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitNotes();
                    }
                  }}
                  data-testid="textarea-fail-notes"
                />
                <Button
                  onClick={handleSubmitNotes}
                  disabled={!failNotes.trim()}
                  data-testid="button-submit-notes"
                >
                  Submit
                </Button>
              </div>
            )}

            {showFeedback && (
              <ExpertFeedback
                trace={currentTrace}
                userVerdict={isSubmitted && currentResponse ? currentResponse.userVerdict : userVerdict!}
                userNotes={isSubmitted && currentResponse ? currentResponse.userNotes : failNotes}
              />
            )}

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={(viewingPrevious ? (viewingTraceId || 1) <= 1 : progress.currentTrace <= 1)}
                className="gap-1"
                data-testid="button-back"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>

              {showFeedback && (
                <Button
                  onClick={handleNext}
                  className="gap-1"
                  data-testid="button-next"
                >
                  {viewingPrevious
                    ? (viewingTraceId !== null && viewingTraceId < actualCurrentTrace - 1 ? "Next" : "Return to current")
                    : progress.currentTrace >= 25 ? "Finish Phase 1" : "Next"}
                  <kbd className="ml-1 text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded">N</kbd>
                  {!viewingPrevious && <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "phase1-summary") {
    const agreements = progress.phase1.responses.filter((r) => {
      const trace = TRACES.find((t) => t.id === r.traceId);
      return trace && r.userVerdict === trace.expertVerdict;
    }).length;

    const disagreements = progress.phase1.responses.filter((r) => {
      const trace = TRACES.find((t) => t.id === r.traceId);
      return trace && r.userVerdict !== trace.expertVerdict;
    });

    const failedTraces = progress.phase1.responses.filter((r) => {
      const trace = TRACES.find((t) => t.id === r.traceId);
      return r.userVerdict === "fail" || (trace && trace.expertVerdict === "fail");
    });

    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">Phase 1 Complete</h2>
            <p className="text-lg text-muted-foreground mb-6" data-testid="text-agreement-score">
              You agreed with the expert on {agreements}/25 traces
            </p>

            {disagreements.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Where you disagreed</h3>
                <div className="space-y-3">
                  {disagreements.map((r) => {
                    const trace = TRACES.find((t) => t.id === r.traceId)!;
                    return (
                      <Card key={r.traceId} className={trace.isBorderline ? "border-amber-200 dark:border-amber-800" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">Trace {r.traceId}</span>
                            <Badge variant={r.userVerdict === "pass" ? "default" : "destructive"} className="text-xs">
                              You: {r.userVerdict}
                            </Badge>
                            <Badge variant={trace.expertVerdict === "pass" ? "default" : "destructive"} className="text-xs">
                              Expert: {trace.expertVerdict}
                            </Badge>
                            {trace.isBorderline && (
                              <Badge variant="outline" className="text-xs">Borderline</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{trace.expertNotes}</p>
                          {trace.isBorderline && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                              Disagreement is expected here — this one is genuinely debatable.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {failedTraces.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Failure notes comparison</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Compare your observations with the expert's. Did you catch the same issues?
                </p>
                <div className="space-y-3">
                  {failedTraces.map((r) => {
                    const trace = TRACES.find((t) => t.id === r.traceId)!;
                    if (trace.expertVerdict !== "fail") return null;
                    return (
                      <Card key={r.traceId}>
                        <CardContent className="p-4">
                          <p className="font-medium text-sm mb-2">Trace {r.traceId}: "{trace.userQuery}"</p>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="bg-muted/30 rounded-md p-3">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Expert notes</p>
                              <p className="text-sm">{trace.expertNotes}</p>
                            </div>
                            {r.userNotes && (
                              <div className="bg-muted/30 rounded-md p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Your notes</p>
                                <p className="text-sm">{r.userNotes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardContent className="p-4">
                <p className="text-sm">
                  You've just done the first half of error analysis — reviewing outputs and writing observations.
                  Now comes the second half: finding patterns.
                </p>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  const updated = { ...progress, currentPhase: 2 as const };
                  save(updated);
                  setScreen("phase2");
                }}
                data-testid="button-continue-phase2"
              >
                Continue to Phase 2
              </Button>
              <button
                onClick={() => {
                  resetPhase1();
                  setProgress(getErrorAnalysisProgress());
                  setScreen("phase1");
                  setUserVerdict(null);
                  setFailNotes("");
                  setNotesSubmitted(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                data-testid="button-restart-phase1"
              >
                <RotateCcw className="h-3 w-3" /> Restart Phase 1
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "phase2") {
    const userFailures = progress.phase1.responses.filter((r) => r.userVerdict === "fail" && r.userNotes);
    const allCategorized = userFailures.length > 0 && userFailures.every((r) => taxonomyMap[r.traceId]?.trim());

    const uniqueCategories = Array.from(new Set(Object.values(taxonomyMap).filter((v) => v.trim())));
    const categoryCounts: Record<string, number> = {};
    for (const val of Object.values(taxonomyMap)) {
      if (val.trim()) {
        categoryCounts[val.trim()] = (categoryCounts[val.trim()] || 0) + 1;
      }
    }

    const handleCategoryChange = (traceId: number, value: string) => {
      const newMap = { ...taxonomyMap, [traceId]: value };
      setTaxonomyMap(newMap);

      const categories: { name: string; noteTraceIds: number[] }[] = [];
      const grouped: Record<string, number[]> = {};
      for (const [tid, cat] of Object.entries(newMap)) {
        if (cat.trim()) {
          const key = cat.trim();
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(Number(tid));
        }
      }
      for (const [name, ids] of Object.entries(grouped)) {
        categories.push({ name, noteTraceIds: ids });
      }

      const updated = { ...progress };
      updated.phase2 = { ...updated.phase2, categories };
      save(updated);
    };

    const handleDone = () => {
      const updated = { ...progress };
      updated.phase2 = { ...updated.phase2, completed: true };
      save(updated);
      setScreen("phase2-summary");
    };

    if (userFailures.length === 0) {
      return (
        <div className="min-h-[calc(100vh-8rem)]">
          <section className="py-8 sm:py-12">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-4">Phase 2: Build Your Taxonomy</h2>
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <p className="text-amber-800 dark:text-amber-300">
                    You didn't flag any failures. Go back to Phase 1 and look more carefully — at least 17 of these traces have real problems.
                  </p>
                </CardContent>
              </Card>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  resetPhase1();
                  setProgress(getErrorAnalysisProgress());
                  setScreen("phase1");
                  setUserVerdict(null);
                  setFailNotes("");
                  setNotesSubmitted(false);
                }}
                data-testid="button-redo-phase1"
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Restart Phase 1
              </Button>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">Phase 2: Build Your Taxonomy</h2>
            <div className="mb-6">
              {PHASE2_INTRO_TEXT.split("\n\n").map((p, i) => (
                <p key={i} className={`text-muted-foreground ${i > 0 ? "mt-3" : ""}`}>{p}</p>
              ))}
            </div>

            {userFailures.length <= 3 && (
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 mb-6">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    You found {userFailures.length} failure{userFailures.length === 1 ? "" : "s"}.
                    Most evaluators find 15-17 in these traces. Consider reviewing Phase 1 again with fresh eyes.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4 mb-6">
              {userFailures.map((r) => (
                <Card key={r.traceId}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-1">Trace {r.traceId}</p>
                    <p className="text-sm text-muted-foreground mb-3">"{r.userNotes}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Category:</span>
                      <CategoryInput
                        value={taxonomyMap[r.traceId] || ""}
                        onChange={(val) => handleCategoryChange(r.traceId, val)}
                        existingCategories={uniqueCategories}
                        traceId={r.traceId}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {uniqueCategories.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your categories so far:</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueCategories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-sm">
                      {cat} ({categoryCounts[cat]})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={handleDone}
                disabled={!allCategorized}
                data-testid="button-done-taxonomy"
              >
                Done — Show Results
              </Button>
              <button
                onClick={() => {
                  resetPhase1();
                  setProgress(getErrorAnalysisProgress());
                  setScreen("phase1");
                  setUserVerdict(null);
                  setFailNotes("");
                  setNotesSubmitted(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                data-testid="button-restart-phase1-from-phase2"
              >
                <RotateCcw className="h-3 w-3" /> Restart Phase 1
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (screen === "phase2-summary") {
    const userCategories: { name: string; count: number }[] = [];
    const grouped: Record<string, number> = {};
    for (const cat of progress.phase2.categories) {
      grouped[cat.name] = (grouped[cat.name] || 0) + cat.noteTraceIds.length;
    }
    for (const [name, count] of Object.entries(grouped)) {
      userCategories.push({ name, count });
    }
    userCategories.sort((a, b) => b.count - a.count);

    return (
      <div className="min-h-[calc(100vh-8rem)]">
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Phase 2 Complete: Your Taxonomy</h2>

            <p className="text-muted-foreground mb-6">
              Look at both taxonomies. What did you catch? What did you miss? What did you name differently?
            </p>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Your Taxonomy</h3>
                  {userCategories.length > 0 ? (
                    <div className="space-y-2">
                      {userCategories.map((cat, i) => (
                        <div key={cat.name} className="flex items-center justify-between">
                          <span className="text-sm">{i + 1}. {cat.name}</span>
                          <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories created.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-3">Expert Taxonomy</h3>
                  <div className="space-y-2">
                    {EXPERT_TAXONOMY.map((cat) => (
                      <div key={cat.id} className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-sm">{cat.id}. {cat.name}</span>
                          <p className="text-xs text-muted-foreground">{cat.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">{cat.traceIds.length}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20 mb-8">
              <CardContent className="p-5">
                {FINAL_INSIGHT_TEXT.split("\n\n").map((block, i) => {
                  if (block.startsWith("1.") || block.startsWith("2.") || block.startsWith("3.")) {
                    const lines = block.split("\n");
                    return (
                      <div key={i} className="mt-3">
                        {lines.map((line, j) => {
                          const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*—\s*(.+)$/);
                          if (match) {
                            return (
                              <p key={j} className="text-sm">
                                {line.substring(0, 3)}<strong>{match[1]}</strong> — {match[2]}
                              </p>
                            );
                          }
                          return <p key={j} className="text-sm">{line}</p>;
                        })}
                      </div>
                    );
                  }
                  return <p key={i} className={`text-sm ${i > 0 ? "mt-3" : ""}`}>{block}</p>;
                })}
              </CardContent>
            </Card>

            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">{WHATS_NEXT.header}</h3>
              <p className="text-muted-foreground mb-6">{WHATS_NEXT.intro}</p>

              <div className="space-y-6">
                {WHATS_NEXT.steps.map((step) => (
                  <div key={step.title}>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                      {step.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-3">Recommended Resources</h4>
                <div className="space-y-3">
                  {WHATS_NEXT.resources.map((resource) => (
                    <a
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm text-primary hover:underline"
                      data-testid={`link-resource-${resource.title.substring(0, 20).toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <ExternalLink className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium">{resource.title}</span>
                        {resource.description && (
                          <span className="text-muted-foreground"> — {resource.description}</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  resetPhase2();
                  setProgress(getErrorAnalysisProgress());
                  setTaxonomyMap({});
                  setScreen("phase2");
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                data-testid="button-restart-phase2"
              >
                <RotateCcw className="h-3 w-3" /> Restart Phase 2
              </button>
              <button
                onClick={() => {
                  resetPhase1();
                  setProgress(getErrorAnalysisProgress());
                  setScreen("phase1");
                  setUserVerdict(null);
                  setFailNotes("");
                  setNotesSubmitted(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                data-testid="button-restart-phase1-from-summary"
              >
                <RotateCcw className="h-3 w-3" /> Restart Phase 1
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return null;
}

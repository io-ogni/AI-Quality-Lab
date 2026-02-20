import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BarChart3, Shield, Lightbulb, CheckCircle2, AlertCircle, HelpCircle, ChevronRight, ChevronDown, Zap, CheckSquare } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function ExpandableSection({ title, children, testId }: { title: string; children: React.ReactNode; testId?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border rounded-lg" data-testid={testId}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left font-semibold hover:bg-muted/50 transition-colors">
          <span>{title}</span>
          {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t pt-4">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default function Learn() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12 sm:py-16 border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" data-testid="text-learn-title">
            AI Quality for Product Managers
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's start with the fundamentals.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="aspect-video rounded-lg overflow-hidden border bg-black">
            <iframe
              src="https://www.youtube.com/embed/se3F91Esueg"
              title="AI Evals and Guardrails for Product Managers"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              data-testid="video-intro"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6">Two Ways to Control AI Quality</h2>
          <Card className="bg-card/50">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground">
                When you ship an AI feature — a chatbot, an AI assistant, auto-generated summaries, smart search, 
                or any product that uses an LLM — you need two things:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>A way to measure quality</strong> — Are outputs good? How good? What's broken?</li>
                <li><strong>A way to enforce quality</strong> — Stop bad outputs before users see them.</li>
              </ol>
              <p className="text-muted-foreground">In the AI world, these have names:</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  <BarChart3 className="h-4 w-4 mr-1.5" />
                  Evals = Measuring quality (offline)
                </Badge>
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  <Shield className="h-4 w-4 mr-1.5" />
                  Guardrails = Enforcing quality (runtime)
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Both use the same quality dimensions — like "is it accurate?" or "is it safe?" — but apply them differently.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Know the Difference</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Evals (Evaluations)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Measure quality across many examples</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p><strong>When:</strong> During development, testing, and monitoring</p>
                  <p><strong>Purpose:</strong> Understand how your system performs overall</p>
                  <p><strong>Output:</strong> Scores, metrics, pass rates, dashboards</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">PM uses evals to answer:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      "Is our AI ready to ship?"
                    </li>
                    <li className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      "Did the last update make things worse?"
                    </li>
                    <li className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      "What's our accuracy rate?"
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-sm">
                  <strong>Example:</strong> Run 500 test conversations, measure what percentage follow instructions correctly. Result: 94% pass rate.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Guardrails
                </CardTitle>
                <p className="text-sm text-muted-foreground">Enforce quality on every request</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p><strong>When:</strong> In production, real-time, on every response</p>
                  <p><strong>Purpose:</strong> Catch and handle bad outputs before users see them</p>
                  <p><strong>Output:</strong> Pass/block decisions, filtered content, fallbacks</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">PM uses guardrails to answer:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      "How do we prevent toxic responses?"
                    </li>
                    <li className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      "What happens if the AI hallucinates?"
                    </li>
                    <li className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      "What's our safety net?"
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-sm">
                  <strong>Example:</strong> Before showing any response, check if it contains unverified medical claims. If yes, show a disclaimer or block it.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">
                <strong>The connection:</strong> Both use the same quality dimensions (accuracy, safety, relevance, etc.). 
                This app teaches you those dimensions. You'll then apply them as evals OR guardrails depending on your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6">The Quality Dimensions</h2>
          <p className="text-muted-foreground mb-6">
            There are 11 key dimensions to evaluate AI output quality. Learn to recognize and define criteria for each:
          </p>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Eval + Runtime (Best for Guardrails)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>Instruction Following:</strong> Did it do exactly what you asked?</li>
                  <li><strong>Format Compliance:</strong> Is the output structured correctly?</li>
                  <li><strong>Toxicity Detection:</strong> Is it safe and appropriate?</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Eval-Focused (Best for Benchmarking)
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>Relevance:</strong> Does it address the actual question?</li>
                  <li><strong>Completeness:</strong> Did it answer ALL parts?</li>
                  <li><strong>Tone & Style:</strong> Does it sound right for your product?</li>
                  <li><strong>Consistency:</strong> Is it reliable and non-contradictory?</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Requires System Design
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>Groundedness:</strong> Does it stick to provided sources?</li>
                  <li><strong>Factual Accuracy:</strong> Is the general knowledge correct? <span className="text-amber-600 dark:text-amber-400 text-xs font-medium">Advanced</span></li>
                  <li><strong>Refusal Handling:</strong> Does it refuse when it should — but not over-refuse?</li>
                </ul>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                  Note: Factual Accuracy is hard to verify without external fact-checking systems.
                  For most use cases, focus on Groundedness instead — ensuring the bot sticks to the sources YOU provide is more actionable than verifying general world knowledge.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  Security
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>Adversarial Robustness:</strong> Can the bot handle users trying to break it?</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-shipping-decisions-title">Beyond Quality — Shipping Decisions</h2>
          <p className="text-lg font-medium text-muted-foreground mb-4">Quality Isn't Everything</p>
          <p className="text-muted-foreground mb-8">
            You've learned to define quality. But shipping AI means balancing three things:
            quality, speed, and cost. Most teams optimize for one and ignore the others.
            Smart PMs understand the tradeoffs.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Watch: The Quality-Speed-Cost Triangle
            </h3>
            <div className="aspect-video rounded-lg overflow-hidden border bg-black">
              <iframe
                src="https://www.youtube.com/embed/PLACEHOLDER_SHIPPING"
                title="The Quality-Speed-Cost Triangle"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                data-testid="video-shipping-decisions"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Prefer reading? Expand the sections below.</p>
          </div>

          <div className="space-y-3">
            <ExpandableSection title="Quality vs Speed vs Cost — Pick Two" testId="section-triangle">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Think of it like ordering food:</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-foreground">Fine dining (GPT-4, Claude Opus)</p>
                    <p>Excellent quality, but slow and expensive</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-foreground">Fast casual (GPT-4o, Claude Sonnet)</p>
                    <p>Good quality, reasonable speed and price</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-foreground">Fast food (GPT-4o-mini, Claude Haiku)</p>
                    <p>Quick and cheap, but simpler output</p>
                  </div>
                </div>
                <p>None of these is "wrong." It depends on your use case.</p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Actual Latency and Cost Numbers" testId="section-numbers">
              <div className="space-y-4 text-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Model Tier</th>
                        <th className="text-left py-2 pr-4 font-medium">Latency</th>
                        <th className="text-left py-2 pr-4 font-medium">Cost per 1K calls*</th>
                        <th className="text-left py-2 font-medium">Quality</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4">Small (Haiku, GPT-4o-mini)</td>
                        <td className="py-2 pr-4">100-300ms</td>
                        <td className="py-2 pr-4">$0.10-0.50</td>
                        <td className="py-2">70-80%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Medium (Sonnet, GPT-4o)</td>
                        <td className="py-2 pr-4">200-500ms</td>
                        <td className="py-2 pr-4">$1-5</td>
                        <td className="py-2">85-92%</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Large (Opus, GPT-4)</td>
                        <td className="py-2 pr-4">500ms-2s</td>
                        <td className="py-2 pr-4">$10-30</td>
                        <td className="py-2">92-98%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">*Assuming ~500 tokens per call. Prices change — check current rates.</p>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm">
                    <strong>Key insight:</strong> The gap between "medium" and "large" is often smaller than you'd think. That last 5% of quality might cost 10x more.
                  </p>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Which Model for Which Feature?" testId="section-scenarios">
              <div className="space-y-5 text-sm text-muted-foreground">
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Scenario 1: Customer support chatbot</p>
                  <ul className="space-y-1">
                    <li>Users expect instant responses</li>
                    <li>Volume: 100,000 messages/month</li>
                    <li>Quality bar: Understand intent, be helpful</li>
                  </ul>
                  <p className="mt-2 font-medium text-primary">Best fit: Small model (Haiku/GPT-4o-mini)</p>
                  <p className="text-xs mt-1">Users abandon slow chatbots. At 100K messages, cost difference is $50 vs $3,000/month.</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Scenario 2: Legal document analyzer</p>
                  <ul className="space-y-1">
                    <li>Users wait for analysis</li>
                    <li>Volume: 500 documents/month</li>
                    <li>Quality bar: Cannot miss critical clauses</li>
                  </ul>
                  <p className="mt-2 font-medium text-primary">Best fit: Large model (Opus/GPT-4)</p>
                  <p className="text-xs mt-1">Users expect to wait for complex analysis. At 500 docs, even expensive model costs ~$150/month. Worth it.</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Scenario 3: Email draft suggestions</p>
                  <ul className="space-y-1">
                    <li>Real-time as user types</li>
                    <li>Volume: 50,000/day</li>
                    <li>Quality bar: Helpful but user edits anyway</li>
                  </ul>
                  <p className="mt-2 font-medium text-primary">Best fit: Small-to-medium model</p>
                  <p className="text-xs mt-1">Need speed, but stakes are low. A/B test to find the sweet spot.</p>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Before You Pick a Model" testId="section-questions">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">1. What's the latency budget?</p>
                  <ul className="mt-1 ml-4 space-y-0.5 list-disc">
                    <li>Real-time (autocomplete, chat): Under 500ms</li>
                    <li>Interactive (search, analysis): Under 2 seconds</li>
                    <li>Background (batch, reports): Doesn't matter</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">2. What's the volume?</p>
                  <ul className="mt-1 ml-4 space-y-0.5 list-disc">
                    <li>Under 1K calls/month — Cost barely matters, use the best</li>
                    <li>1K-100K/month — Optimize carefully</li>
                    <li>Over 100K/month — Every penny counts</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">3. What's the quality floor?</p>
                  <ul className="mt-1 ml-4 space-y-0.5 list-disc">
                    <li>Not "ideal" — what's the <em>minimum</em> acceptable?</li>
                    <li>Can a smaller model clear that bar?</li>
                    <li>Use your evals to find out!</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">4. What's the failure cost?</p>
                  <ul className="mt-1 ml-4 space-y-0.5 list-disc">
                    <li>Legal doc wrong — lawsuit — Use big model</li>
                    <li>Email suggestion wrong — user deletes it — Use small model</li>
                  </ul>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="How Evals Help You Choose Models" testId="section-eval-driven">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Here's where everything connects:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong className="text-foreground">Define your quality bar</strong> using the dimensions that matter</li>
                  <li><strong className="text-foreground">Run the same evals</strong> against multiple models</li>
                  <li><strong className="text-foreground">Find the smallest model that clears your bar</strong></li>
                  <li><strong className="text-foreground">Monitor in production</strong> and upgrade only if needed</li>
                </ol>
                <p>
                  This is "right-sizing your model." Most teams start with the biggest (easiest) and never optimize. 
                  Smart teams start small and upgrade where needed.
                </p>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p>
                    <strong>The connection:</strong> Those quality dimensions you learned? They're not just for checking quality — they're for <strong>choosing models</strong>.
                  </p>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Advanced: Model Routing" testId="section-routing">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Use different models for different tasks:</p>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-3">Example: Customer support system</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="shrink-0 text-xs">Tier 1</Badge>
                      <p><strong className="text-foreground">Haiku:</strong> Intent classification, simple FAQs — 80% of requests</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="shrink-0 text-xs">Tier 2</Badge>
                      <p><strong className="text-foreground">Sonnet:</strong> Complex questions, policy explanations — 15%</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="shrink-0 text-xs">Tier 3</Badge>
                      <p><strong className="text-foreground">Opus:</strong> Escalations, sensitive situations — 5%</p>
                    </div>
                  </div>
                </div>
                <p>
                  Route requests by complexity. Average cost drops dramatically while quality stays high where it matters.
                </p>
                <p className="text-xs italic">You don't need this on day one. But know it exists.</p>
              </div>
            </ExpandableSection>
          </div>

          <Card className="mt-8 bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800" data-testid="card-checklist">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Your Pre-Ship Checklist
              </h3>
              <ul className="space-y-2.5 text-sm text-green-800 dark:text-green-300">
                {[
                  'What model are we using and why?',
                  "What's the expected latency? Acceptable for the UX?",
                  "What's the cost per call? Monthly budget at expected volume?",
                  "What's our quality bar? What evals prove we meet it?",
                  'What happens when the AI makes mistakes?',
                  'Do we have monitoring for quality degradation?',
                  'Is there a smaller/cheaper model we should test?',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 shrink-0">&#9744;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mt-4">
                If you can't answer these, you're not ready to ship.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      <section className="py-12 bg-primary/5 border-t">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">You've learned the dimensions, the tools, and the tradeoffs. Time to practice.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/challenges">
              <Button size="lg" data-testid="button-start-challenges">
                Start Challenges
              </Button>
            </Link>
            <Link href="/sandbox">
              <Button size="lg" variant="outline" data-testid="button-try-sandbox">
                Try Sandbox
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

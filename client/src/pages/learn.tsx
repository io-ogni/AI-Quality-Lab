import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BarChart3, Shield, Lightbulb, CheckCircle2, AlertCircle, HelpCircle, ChevronRight, ChevronDown, Zap, ArrowRight } from 'lucide-react';
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
            The Quality Dimensions
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            11 foundational ways to think about AI output quality.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These dimensions give you vocabulary and mental models. In production,
            you'll also discover criteria specific to your use case — and you'll
            define them using the same skill you're building here.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-what-youre-learning">What You're Learning</h2>
          <Card className="bg-card/50">
            <CardContent className="p-6 space-y-5">
              <p className="text-muted-foreground">
                This app teaches you to think systematically about AI quality.
              </p>
              <div>
                <p className="font-medium mb-2">The Foundation (what we teach):</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li><strong>Vocabulary</strong> — words to describe what's wrong with an AI output</li>
                  <li><strong>Mental models</strong> — 11 lenses to examine quality through</li>
                  <li><strong>The skill</strong> — articulating what "good" looks like for a given scenario</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">What Production Adds:</p>
                <p className="text-sm text-muted-foreground mb-2">
                  In the real world, you'll also discover criteria specific to YOUR product:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>A real estate bot might need "client persona match"</li>
                  <li>A finance bot might need "regulatory disclaimer present"</li>
                  <li>A support bot might need "escalation timing"</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  These custom criteria aren't replacements for the 11 dimensions —
                  they're additions. And you'll define them using exactly the skill
                  you're practicing here: looking at outputs and articulating what
                  makes them good or bad.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold mb-2">Video: What is AI Quality?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Why you can't just ask "is this good?" — and how breaking quality
            into specific dimensions makes it actionable.
          </p>
          <div className="aspect-video rounded-lg overflow-hidden border bg-black">
            <iframe
              src="https://www.youtube.com/embed/se3F91Esueg"
              title="What is AI Quality?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              data-testid="video-intro"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-semibold mb-2">Video: The 11 Dimensions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            A tour of the foundational quality dimensions. These are your
            starting vocabulary — the common ways teams think about AI output
            quality across industries.
          </p>
          <div className="aspect-video rounded-lg overflow-hidden border bg-black">
            <iframe
              src="https://www.youtube.com/embed/PLACEHOLDER_DIMENSIONS"
              title="The 11 Dimensions"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              data-testid="video-dimensions"
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
            11 foundational dimensions to evaluate AI output quality. These give you vocabulary and mental models — in production, you'll add more specific to your use case.
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
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-common-questions">Common Quality Questions</h2>
          <Card className="bg-card/50">
            <CardContent className="p-6 space-y-5">
              <p className="text-muted-foreground mb-2">When reviewing an AI output, you might ask:</p>

              <div>
                <p className="font-medium mb-2">About the basics:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Did it follow my instructions? → <strong>Instruction Following</strong></li>
                  <li>Is the format right? → <strong>Format Compliance</strong></li>
                  <li>Is it safe/appropriate? → <strong>Toxicity</strong></li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">About the content:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Did it answer the right question? → <strong>Relevance</strong></li>
                  <li>Did it cover everything needed? → <strong>Completeness</strong></li>
                  <li>Is the information correct? → <strong>Groundedness, Factual Accuracy</strong></li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">About the style:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Does it sound right for the context? → <strong>Tone & Style</strong></li>
                  <li>Is it consistent throughout? → <strong>Consistency</strong></li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">About the behavior:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Does it handle edge cases well? → <strong>Refusal Handling</strong></li>
                  <li>Can users trick or break it? → <strong>Adversarial Robustness</strong></li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground pt-2 italic">
                In production, you'll also ask questions specific to YOUR product
                that don't fit neatly here — and that's expected.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-learning-to-production">From Learning to Production</h2>
          <Card className="bg-card/50">
            <CardContent className="p-6 space-y-5">
              <p className="text-muted-foreground">
                The gap between this app and production evals is smaller than you think.
              </p>

              <div>
                <p className="font-medium mb-3">Same skill, different data:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Here</th>
                        <th className="text-left py-2 font-medium">Production</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4">You look at scenario + bot response</td>
                        <td className="py-2">You look at real user queries + bot responses</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">You articulate what's good/bad</td>
                        <td className="py-2">You articulate what's good/bad</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">You write criteria</td>
                        <td className="py-2">You write criteria (which become evaluators)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">We evaluate your criteria</td>
                        <td className="py-2">Your evaluators run on every response</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <p className="font-medium mb-3">What changes in production:</p>
                <ol className="text-sm text-muted-foreground space-y-3 list-decimal pl-5">
                  <li>
                    <strong className="text-foreground">You discover custom criteria</strong> — Through "error analysis" (reviewing
                    real outputs and noting patterns), you'll find failure modes specific
                    to your product.
                  </li>
                  <li>
                    <strong className="text-foreground">You build evaluators</strong> — Your criteria become code checks or
                    LLM-as-judge prompts that run automatically.
                  </li>
                  <li>
                    <strong className="text-foreground">You use pass/fail</strong> — Production evals typically use binary
                    (pass/fail) rather than 1-5 scales, because it forces clearer thinking.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm">
                  <strong>The foundation stays the same:</strong> The skill of looking at an output and articulating "this is wrong
                  because X" — that's what you're practicing here. That's what you'll
                  do in production. The vocabulary of these 11 dimensions gives you
                  a head start.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-shipping-decisions-title">Beyond Quality — Shipping Decisions</h2>
          <p className="text-lg font-medium text-muted-foreground mb-6">Quality Isn't Everything</p>

          <Card className="bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 mb-8" data-testid="card-the-loop">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">The Loop</h3>
              <p className="text-muted-foreground mb-4">
                Forget big upfront planning. Here's how shipping AI actually works:
              </p>
              <ol className="space-y-2.5 text-sm text-green-800 dark:text-green-300">
                {[
                  'Start with the smallest model that might work',
                  'Define "good enough" — your best hypothesis',
                  'Build a few evals early (even 5-10 test cases)',
                  'Ship to a small audience fast (5% rollout, beta, dogfooding)',
                  'Watch real behavior — latency, cost, quality in the wild',
                  'Adjust based on data — upgrade or downgrade as needed',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-semibold text-green-600 dark:text-green-400 shrink-0">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="text-sm text-green-700 dark:text-green-400 mt-4 italic">
                You won't know the right model, the right latency budget, or the
                right quality bar until you try. The goal is to learn fast, not
                plan perfectly.
              </p>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Watch: Ship Fast, Learn Fast
            </h3>
            <div className="aspect-video rounded-lg overflow-hidden border bg-black">
              <iframe
                src="https://www.youtube.com/embed/PLACEHOLDER_SHIPPING"
                title="Ship Fast, Learn Fast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                data-testid="video-shipping-decisions"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Want the details? Expand the sections below.</p>
          </div>

          <div className="space-y-3">
            <ExpandableSection title="Why Start With the Smallest Model?" testId="section-why-start-small">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Because you don't know what you need yet.</p>
                <p>
                  Most teams start with the biggest model "just to be safe" and
                  never optimize. Smart teams start small and upgrade WHERE needed.
                </p>
                <div>
                  <p className="font-medium text-foreground mb-2">The discovery process:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Ship with a small/cheap model (Haiku, GPT-4o-mini)</li>
                    <li>Watch where it fails</li>
                    <li>Upgrade ONLY the parts that need it</li>
                    <li>Keep the cheap model for everything else</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">You might discover:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>80% of requests work fine with the small model</li>
                    <li>Only complex queries need the big model</li>
                    <li>Some failures are prompt problems, not model problems</li>
                  </ul>
                </div>
                <p className="italic">You can't discover this by planning. You discover it by shipping.</p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Model Tiers: A Quick Reference" testId="section-model-tiers">
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground">When you need to pick a starting point or consider an upgrade:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Tier</th>
                        <th className="text-left py-2 pr-4 font-medium">Models</th>
                        <th className="text-left py-2 pr-4 font-medium">Typical Use</th>
                        <th className="text-left py-2 font-medium">Rough Cost*</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4">Small</td>
                        <td className="py-2 pr-4">Haiku, GPT-4o-mini</td>
                        <td className="py-2 pr-4">High-volume, speed-critical</td>
                        <td className="py-2">$0.10-0.50/1K calls</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Medium</td>
                        <td className="py-2 pr-4">Sonnet, GPT-4o</td>
                        <td className="py-2 pr-4">Balanced quality/cost</td>
                        <td className="py-2">$1-5/1K calls</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Large</td>
                        <td className="py-2 pr-4">Opus, GPT-4</td>
                        <td className="py-2 pr-4">Complex reasoning, high-stakes</td>
                        <td className="py-2">$10-30/1K calls</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">*Assuming ~500 tokens/call. Prices change constantly.</p>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Don't use this table to pick your model upfront.</strong> Use it when you've shipped, seen real data, and are deciding whether to upgrade or downgrade.
                  </p>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="How Different Products Landed" testId="section-real-examples">
              <div className="space-y-5 text-sm text-muted-foreground">
                <p>These teams didn't plan their way here. They shipped and learned.</p>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Customer support chatbot</p>
                  <ul className="space-y-1">
                    <li><strong>Started with:</strong> Sonnet (playing it safe)</li>
                    <li><strong>Discovered:</strong> 85% of queries were simple FAQs</li>
                    <li><strong>Ended with:</strong> Haiku for FAQs, Sonnet for complex issues</li>
                    <li><strong>Result:</strong> 60% cost reduction, same quality</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Legal document analyzer</p>
                  <ul className="space-y-1">
                    <li><strong>Started with:</strong> GPT-4o-mini (cost concerns)</li>
                    <li><strong>Discovered:</strong> Missing critical clauses in edge cases</li>
                    <li><strong>Ended with:</strong> GPT-4 for all analysis</li>
                    <li><strong>Result:</strong> Higher cost, but acceptable for the use case</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Email draft suggestions</p>
                  <ul className="space-y-1">
                    <li><strong>Started with:</strong> Sonnet</li>
                    <li><strong>Discovered:</strong> Users edited most suggestions anyway</li>
                    <li><strong>Ended with:</strong> Haiku</li>
                    <li><strong>Result:</strong> Faster suggestions, users didn't notice quality drop</li>
                  </ul>
                </div>
                <p className="italic">The pattern: Start somewhere, measure what matters, adjust.</p>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Questions for Your Retrospective" testId="section-retrospective">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>After you've shipped and collected data, ask:</p>
                <div>
                  <p className="font-medium text-foreground mb-1">About latency:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Are users abandoning because it's too slow?</li>
                    <li>Where's the latency coming from (model? network? processing)?</li>
                    <li>Would users wait longer for better quality?</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">About cost:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>What's our cost per user/session/task?</li>
                    <li>Which queries are most expensive?</li>
                    <li>Can we route simple queries to a cheaper model?</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">About quality:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Where are users complaining?</li>
                    <li>What are the actual failure modes? (not hypothetical ones)</li>
                    <li>Would a bigger model fix this, or is it a prompt problem?</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p><strong className="text-foreground">The key insight:</strong> These questions are unanswerable before you ship. Don't try to answer them in a planning doc.</p>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title="Advanced: Using Multiple Models" testId="section-model-routing">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Once you have data, you might route different requests to different models.</p>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium text-foreground mb-3">Example: Customer support</p>
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
                <div>
                  <p className="font-medium text-foreground mb-2">How to get there:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Ship with one model</li>
                    <li>Identify which queries fail and which succeed</li>
                    <li>Build a classifier to route queries</li>
                    <li>Gradually shift traffic</li>
                  </ol>
                </div>
                <p className="italic">Don't design this upfront. You won't know your tiers until you've seen real traffic patterns.</p>
              </div>
            </ExpandableSection>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Ready to practice defining quality?</p>
            <Link href="/challenges">
              <Button data-testid="button-goto-challenges-shipping">
                Go to Challenges
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
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

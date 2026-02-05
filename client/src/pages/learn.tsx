import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Shield, Lightbulb, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

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
            There are 10 key dimensions to evaluate AI output quality. Learn to recognize and define criteria for each:
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
                  <li><strong>Factual Accuracy:</strong> Is the general knowledge correct?</li>
                  <li><strong>Refusal Handling:</strong> Does it refuse when it should — but not over-refuse?</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary/5 border-t">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Ready to Practice?</h2>
          <p className="text-muted-foreground mb-6">
            Now that you understand the basics, try the hands-on challenges to master each quality dimension.
          </p>
          <Link href="/challenges">
            <Button size="lg" data-testid="button-start-challenges">
              Start Challenges
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

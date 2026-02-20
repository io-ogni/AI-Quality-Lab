import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Code2, Brain, ArrowRight, Layers, Eye, Lock } from 'lucide-react';

const deterministicVsAI = [
  { task: 'Check if input is too short', who: 'Code', icon: Code2, why: 'Simple rule, 100% reliable' },
  { task: 'Detect copy-pasted text', who: 'Code', icon: Code2, why: 'String comparison, no AI needed' },
  { task: 'Detect offensive content', who: 'Local AI (TensorFlow.js)', icon: Shield, why: 'Runs in browser, catches variations like "1diot" and "f*ck", no data sent to servers' },
  { task: 'Match "polite" to "professional"', who: 'LLM', icon: Brain, why: 'Requires semantic understanding' },
  { task: 'Judge if criteria are complete', who: 'LLM', icon: Brain, why: 'Requires domain knowledge' },
  { task: 'Verify LLM didn\'t hallucinate', who: 'Code', icon: Code2, why: 'Check if claimed text exists in input' },
  { task: 'Calculate final score', who: 'Code', icon: Code2, why: 'Math, not judgment' },
];

const techStack = [
  { component: 'Frontend', technology: 'React + TypeScript' },
  { component: 'Styling', technology: 'Tailwind CSS + shadcn/ui' },
  { component: 'LLM Calls', technology: 'OpenAI API or Anthropic API (your key)' },
  { component: 'Content Moderation', technology: 'TensorFlow.js Toxicity Model (local)' },
  { component: 'Storage', technology: 'Browser localStorage' },
];

const lessons = [
  { title: 'Don\'t trust LLMs alone — always validate', description: 'LLMs can hallucinate, be inconsistent, or be manipulated.' },
  { title: 'Use code for what code does best', description: 'Simple checks, format validation, math — don\'t waste an LLM call.' },
  { title: 'Use AI for what AI does best', description: 'Semantic understanding, nuance, judgment calls.' },
  { title: 'Validate inputs BEFORE the LLM', description: 'Catch garbage early. Save money. Fail fast.' },
  { title: 'Validate outputs AFTER the LLM', description: 'The LLM might miss things. Have a safety net.' },
  { title: 'Privacy matters — use local models when possible', description: 'TensorFlow.js runs in the browser. No API calls needed for content moderation.' },
];

export default function About() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-12 sm:py-16 border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" data-testid="text-about-title">
            How This App Works
          </h1>
          <p className="text-lg text-muted-foreground">
            A look under the hood: how we use code + AI + code to evaluate your criteria.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-challenge">
              <Layers className="h-6 w-6 text-primary" />
              Why This App Exists
            </h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  You can't just use keyword matching to evaluate AI responses.
                  "Be professional" and "maintain a formal tone" mean the same thing —
                  but a keyword check would miss that.
                </p>
                <p className="text-muted-foreground">
                  But LLMs alone aren't reliable either. They can be inconsistent,
                  hallucinate scores, or be tricked by prompt injection.
                </p>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="font-medium text-sm">
                    Our solution: Don't trust the LLM alone. Use <strong>code + LLM + code</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-architecture">
              <Shield className="h-6 w-6 text-primary" />
              How We Evaluate Your Work
            </h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">Layer 1</Badge>
                    <div>
                      <p className="font-medium mb-1">Code Pre-Validation</p>
                      <p className="text-sm text-muted-foreground mb-2">Runs BEFORE the LLM. Catches obvious problems instantly and for free.</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Garbage detection (input too short?)</li>
                        <li>Copy-paste detection (did you paste criteria as example?)</li>
                        <li>Identical examples detection</li>
                        <li>Format detection (examples look like bullet lists?)</li>
                        <li>Offensive content detection (TensorFlow.js)</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2 italic">If FAIL — Return immediately, don't call the LLM.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
              </div>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">Layer 2</Badge>
                    <div>
                      <p className="font-medium mb-1">LLM Evaluation</p>
                      <p className="text-sm text-muted-foreground mb-2">Semantic evaluation of your criteria and examples.</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Are your criteria specific enough?</li>
                        <li>Are they relevant to the scenario?</li>
                        <li>Do your examples actually demonstrate the criteria?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
              </div>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0 mt-0.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">Layer 3</Badge>
                    <div>
                      <p className="font-medium mb-1">Code Post-Validation</p>
                      <p className="text-sm text-muted-foreground mb-2">Runs AFTER the LLM. Catches cases the LLM missed.</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Did the LLM miss offensive content? Override.</li>
                        <li>Did the LLM score copy-pasted text too high? Override.</li>
                        <li>Recalculate final score if needed.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-deterministic">
              <Eye className="h-6 w-6 text-primary" />
              Who Does What
            </h2>
            <Card className="bg-card/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Task</th>
                        <th className="text-left p-3 font-medium">Who Does It</th>
                        <th className="text-left p-3 font-medium">Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deterministicVsAI.map((row, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="p-3 text-muted-foreground">{row.task}</td>
                          <td className="p-3">
                            <Badge variant={row.who === 'LLM' ? 'default' : 'secondary'} className="gap-1">
                              <row.icon className="h-3 w-3" />
                              {row.who}
                            </Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">{row.why}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-challenges-mode">
              <Code2 className="h-6 w-6 text-primary" />
              How Challenges Work
            </h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  The 33 challenges have pre-defined "expert criteria" — the answers we're looking for.
                </p>
                <p className="text-muted-foreground">
                  Before calling any LLM, we check if your answer matches using synonym tables:
                </p>
                <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground space-y-1 font-mono">
                  <p>"professional" = "formal" = "business-like"</p>
                  <p>"empathetic" = "understanding" = "compassionate"</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Why? It's instant, free, 100% reliable, and consistent.
                </p>
                <p className="text-sm text-muted-foreground">
                  The LLM only runs when we need semantic judgment that synonyms can't capture.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-privacy">
              <Lock className="h-6 w-6 text-primary" />
              How We Handle Offensive Content
            </h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  We use TensorFlow.js to detect offensive content. This is important:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    Runs 100% in YOUR browser
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    No data sent to external servers
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    Catches variations humans try (like "1diot" or "f*ck")
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    Trained on real toxic content patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    ~15MB model, downloaded once and cached
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  We never send your text to a moderation API. Your input stays on your device.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-lessons">
              <Brain className="h-6 w-6 text-primary" />
              Lessons for Building AI Features
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {lessons.map((lesson, i) => (
                <Card key={i} className="bg-card/50">
                  <CardContent className="p-4">
                    <p className="font-medium text-sm mb-1">{i + 1}. {lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4" data-testid="text-section-techstack">
              What Powers This App
            </h2>
            <Card className="bg-card/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Component</th>
                        <th className="text-left p-3 font-medium">Technology</th>
                      </tr>
                    </thead>
                    <tbody>
                      {techStack.map((row, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="p-3 font-medium">{row.component}</td>
                          <td className="p-3 text-muted-foreground">{row.technology}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 pb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">Now you know how it works under the hood.</p>
                <p className="font-medium">Ready to practice?</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/challenges">
                    <Button data-testid="link-about-challenges">
                      Start Challenges
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/sandbox">
                    <Button variant="outline" data-testid="link-about-sandbox">
                      Try Sandbox
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}

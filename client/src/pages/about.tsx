import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Code2, Brain, ArrowRight, Layers, Eye, Lock } from 'lucide-react';

const deterministicVsAI = [
  { task: 'Check if input is too short', who: 'Code', icon: Code2, why: 'Simple rule, 100% reliable' },
  { task: 'Detect copy-pasted text', who: 'Code', icon: Code2, why: 'String comparison, no AI needed' },
  { task: 'Detect offensive content', who: 'Code', icon: Shield, why: 'Pattern matching catches common cases' },
  { task: 'Match "polite" to "professional"', who: 'LLM', icon: Brain, why: 'Requires semantic understanding' },
  { task: 'Judge if criteria are complete', who: 'LLM', icon: Brain, why: 'Requires domain knowledge' },
  { task: 'Verify LLM didn\'t hallucinate', who: 'Code', icon: Code2, why: 'Check if claimed text exists in input' },
  { task: 'Calculate final score', who: 'Code', icon: Code2, why: 'Math, not judgment' },
];

const techStack = [
  { component: 'Frontend', technology: 'React + TypeScript' },
  { component: 'Styling', technology: 'Tailwind CSS + shadcn/ui' },
  { component: 'LLM Calls', technology: 'OpenAI or Anthropic API (your key)' },
  { component: 'Content Moderation', technology: 'Pattern matching (local)' },
  { component: 'Storage', technology: 'Browser localStorage / sessionStorage' },
];

const lessons = [
  { title: 'Don\'t trust LLMs alone', description: 'Always validate with code before and after.' },
  { title: 'Use code for what code does best', description: 'String matching, math, pattern detection — deterministic and free.' },
  { title: 'Use AI for what AI does best', description: 'Semantic matching, quality judgment, nuanced evaluation.' },
  { title: 'Validate inputs BEFORE the LLM', description: 'Catch garbage, copy-paste, and offensive content before spending on API calls.' },
  { title: 'Validate outputs AFTER the LLM', description: 'Override bad scores, check for hallucination, recalculate if needed.' },
  { title: 'Privacy matters', description: 'Use local processing when possible — no data sent to external servers for moderation.' },
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
              The Challenge
            </h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  When this app evaluates your criteria, it can't just use simple keyword matching — 
                  "polite" and "professional" mean similar things, but a keyword search wouldn't know that.
                </p>
                <p className="text-muted-foreground">
                  But we also can't <em>only</em> use an LLM. LLMs can be unreliable — they hallucinate, 
                  they can be tricked via prompt injection, and they sometimes give high scores to obviously bad input.
                </p>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="font-medium text-sm">
                    The solution: Don't trust the LLM alone. Use <strong>code + LLM + code</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-architecture">
              <Shield className="h-6 w-6 text-primary" />
              The Three-Layer Architecture
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
                        <li>Garbage detection (too short, random characters)</li>
                        <li>Copy-paste detection (criteria pasted as examples)</li>
                        <li>Identical examples detection</li>
                        <li>Format detection (examples that look like criteria lists)</li>
                        <li>Offensive content detection (pattern matching)</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2 italic">If any check fails, we return immediately — no LLM call needed.</p>
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
                      <p className="text-sm text-muted-foreground mb-2">The AI evaluates semantic quality — things code can't judge.</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Semantic matching ("polite" ≈ "professional")</li>
                        <li>Quality judgment (are criteria specific enough?)</li>
                        <li>Contextual relevance (do criteria fit the scenario?)</li>
                        <li>Example quality assessment</li>
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
                        <li>Override if LLM scored offensive content too high</li>
                        <li>Override if LLM scored copy-pasted text too high</li>
                        <li>Recalculate overall score based on corrected subscores</li>
                        <li>Verify hallucination in claimed text matches</li>
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
              What's Deterministic vs AI
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
              Challenges Mode: Deterministic Matching First
            </h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  The 30 challenge levels use a special optimization: <strong>synonym tables</strong>. 
                  Each expert criterion has a pre-built list of equivalent phrases, so matching is instant, free, and 100% consistent.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Step 1</p>
                    <p className="text-sm">Check synonym tables for each expert criterion</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs uppercase font-medium text-muted-foreground mb-1">Step 2</p>
                    <p className="text-sm">Only call the LLM for criteria not matched deterministically</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This means most evaluations in Challenges mode are free and instant — 
                  the LLM is only called as a fallback for complex semantic matches.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-privacy">
              <Lock className="h-6 w-6 text-primary" />
              Content Moderation: Privacy First
            </h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Content moderation runs entirely in your browser using pattern matching. 
                  No data is sent to external servers for moderation checks.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    Catches offensive language and common variations
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    Runs before any API call — bad content never leaves your browser
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    Your API key stays in sessionStorage — deleted when you close the tab
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-lessons">
              <Brain className="h-6 w-6 text-primary" />
              Why This Matters for Your Work
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
              The Tech Stack
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
                <p className="font-medium">Ready to put these ideas into practice?</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/challenges">
                    <Button data-testid="link-about-challenges">
                      Try the Challenges
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/sandbox">
                    <Button variant="outline" data-testid="link-about-sandbox">
                      Open the Sandbox
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

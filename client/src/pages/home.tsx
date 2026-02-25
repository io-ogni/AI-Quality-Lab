import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  SearchCheck,
  FlaskConical,
  ArrowDown,
} from "lucide-react";
import { getProgress } from "@/lib/storage";
import { useEffect, useState } from "react";

const pathStops = [
  {
    href: "/learn",
    icon: BookOpen,
    label: "Learn",
    sublabel: "Understand evals & guardrails",
    badge: "Start here",
    badgeVariant: "default" as const,
  },
  {
    href: "/criteria-lab",
    icon: Target,
    label: "Criteria Lab",
    sublabel: "Define what \"good\" looks like",
    badge: "LLM API key needed",
    badgeVariant: "secondary" as const,
  },
  {
    href: "/error-analysis",
    icon: SearchCheck,
    label: "Error Analysis Lab",
    sublabel: "Review, diagnose, categorize",
    badge: "No API key needed",
    badgeVariant: "secondary" as const,
  },
];

export default function Home() {
  const [progress, setProgress] = useState<{ totalCompleted: number }>({
    totalCompleted: 0,
  });

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const getStopBadge = (index: number) => {
    if (index === 0) return "Start here";
    if (index === 1 && progress.totalCompleted > 0) {
      return `${progress.totalCompleted}/33 complete`;
    }
    if (index === 2) return "No API key needed";
    return null;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-2xl bg-primary/10">
              <FlaskConical className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            data-testid="text-hero-title"
          >
            AI Quality Lab{" "}
            <span className="text-base font-medium text-muted-foreground align-middle">
              v1
            </span>
          </h1>
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-hero-subtitle"
          >
            Learn to evaluate AI outputs — from defining quality criteria to diagnosing failures
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-card/50">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-3">What is this?</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-medium text-foreground">
                  A basic introduction to AI quality control — for Product
                  Managers.
                </p>
                <p>
                  If you're a PM wanting to know more about delivering AI
                  features and wondering "what even are evals?" — this is for
                  you.
                </p>
                <p>
                  This app teaches the{" "}
                  <strong className="text-foreground">basic concepts</strong>{" "}
                  you need to:
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>Write better specs for AI features</li>
                  <li>
                    Have informed conversations with engineering about quality
                  </li>
                  <li>Know what questions to ask about evals and guardrails</li>
                </ul>
                <p className="pt-2 border-t border-border/50">
                  No code. No ML background required. Just hands-on practice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-medium text-muted-foreground mb-8">
            Your Learning Path
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5 -translate-x-1/2 hidden sm:block" />

            <div className="space-y-6">
              {pathStops.map((stop, index) => {
                const Icon = stop.icon;
                const badge = getStopBadge(index);

                return (
                  <div key={stop.label}>
                    <Link
                      href={stop.href}
                      className="block"
                      data-testid={`card-path-${stop.label.toLowerCase()}`}
                    >
                      <Card className="relative hover-elevate active-elevate-2 transition-all cursor-pointer group">
                        <div className="absolute left-1/2 -top-3 -translate-x-1/2 hidden sm:block">
                          <div className="w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        </div>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold">{stop.label}</h3>
                                {badge && (
                                  <Badge
                                    variant={
                                      index === 0 ? "default" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground">
                                {stop.sublabel}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {index < pathStops.length - 1 && (
                      <div className="flex justify-center py-2 sm:hidden">
                        <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

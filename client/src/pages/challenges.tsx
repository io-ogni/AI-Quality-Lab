import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, CheckSquare, Code, ShieldAlert, Target, ListChecks, MessageCircle, RefreshCw, Anchor, BookCheck, ShieldCheck, Check, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { APIKeyRequired } from '@/components/api-key-required';
import { qualityDimensions, groupInfo } from '@/lib/challenges-data';
import { getLevelProgress, getProgress, clearProgress } from '@/lib/storage';
import { useEffect, useState } from 'react';
import type { QualityDimension, DimensionGroup } from '@/lib/types';
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
  CheckSquare,
  Code,
  ShieldAlert,
  Target,
  ListChecks,
  MessageCircle,
  RefreshCw,
  Anchor,
  BookCheck,
  ShieldCheck,
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
                <h3 className="font-semibold leading-tight">{dimension.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {dimension.description}
                </p>
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium flex items-center gap-1">
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

function DimensionGroup({ group, dimensions }: { 
  group: DimensionGroup; 
  dimensions: typeof qualityDimensions;
}) {
  const info = groupInfo[group];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">{info.title}</h3>
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

  const totalProgress = (progress.totalCompleted / 30) * 100;

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
                {progress.totalCompleted}/30
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
                  <p className="text-xs text-muted-foreground">Challenges Completed</p>
                  <p className="text-xl font-bold" data-testid="text-challenges-completed">{progress.totalCompleted}/30</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Dimensions Mastered</p>
                  <p className="text-xl font-bold" data-testid="text-dimensions-mastered">{progress.dimensionsMastered}/10</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Progress by Dimension</p>
            {qualityDimensions.map((dim) => {
              const completed = levelProgress[dim.id] || [];
              const progressPercent = (completed.length / 3) * 100;
              const isMastered = completed.length === 3;

              return (
                <div key={dim.id} className="flex items-center gap-3">
                  <div className="w-36 sm:w-44 flex items-center gap-2 shrink-0">
                    <span className="text-sm truncate">{dim.name}</span>
                    {isMastered && (
                      <Badge variant="secondary" className="shrink-0 text-xs px-1.5 py-0">
                        <Check className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Progress value={progressPercent} className="h-1.5" />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground shrink-0">
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

export default function Challenges() {
  const evalRuntime = qualityDimensions.filter(d => d.group === 'eval-runtime');
  const evalFocused = qualityDimensions.filter(d => d.group === 'eval-focused');
  const requiresSystem = qualityDimensions.filter(d => d.group === 'requires-system-design');

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-10 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-challenges-title">
            Challenges
          </h1>
          <p className="text-muted-foreground">
            Learn by doing. Complete challenges to master LLM evaluation.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <APIKeyRequired />
          <ProgressSection />
          
          <DimensionGroup group="eval-runtime" dimensions={evalRuntime} />
          <DimensionGroup group="eval-focused" dimensions={evalFocused} />
          <DimensionGroup group="requires-system-design" dimensions={requiresSystem} />
        </div>
      </section>
    </div>
  );
}

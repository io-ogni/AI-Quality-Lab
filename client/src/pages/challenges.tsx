import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, CheckSquare, Code, ShieldAlert, Target, ListChecks, MessageCircle, RefreshCw, Anchor, BookCheck, ShieldCheck, Check } from 'lucide-react';
import { APIKeyRequired } from '@/components/api-key-required';
import { qualityDimensions, groupInfo } from '@/lib/challenges-data';
import { getLevelProgress } from '@/lib/storage';
import { useEffect, useState } from 'react';
import type { QualityDimension, DimensionGroup } from '@/lib/types';

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
          
          <DimensionGroup group="eval-runtime" dimensions={evalRuntime} />
          <DimensionGroup group="eval-focused" dimensions={evalFocused} />
          <DimensionGroup group="requires-system-design" dimensions={requiresSystem} />
        </div>
      </section>
    </div>
  );
}

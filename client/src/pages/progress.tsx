import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Check } from 'lucide-react';
import { getProgress, clearProgress, getLevelProgress } from '@/lib/storage';
import { qualityDimensions } from '@/lib/challenges-data';
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

export default function ProgressPage() {
  const [progress, setProgress] = useState({ totalCompleted: 0, dimensionsMastered: 0 });
  const [levelProgress, setLevelProgress] = useState<Record<string, number[]>>({});
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
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-10 border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-progress-title">
            Your Progress
          </h1>
          <p className="text-muted-foreground">
            Track your learning journey through the quality dimensions.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Challenges Completed</p>
                    <p className="text-3xl font-bold" data-testid="text-challenges-completed">
                      {progress.totalCompleted}/30
                    </p>
                  </div>
                </div>
                <Progress value={totalProgress} className="mt-4 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Trophy className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Dimensions Mastered</p>
                    <p className="text-3xl font-bold" data-testid="text-dimensions-mastered">
                      {progress.dimensionsMastered}/10
                    </p>
                  </div>
                </div>
                <Progress value={(progress.dimensionsMastered / 10) * 100} className="mt-4 h-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Progress by Dimension</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityDimensions.map((dim) => {
                  const completed = levelProgress[dim.id] || [];
                  const progressPercent = (completed.length / 3) * 100;
                  const isMastered = completed.length === 3;
                  
                  return (
                    <div key={dim.id} className="flex items-center gap-4">
                      <div className="w-40 sm:w-48 flex items-center gap-2 shrink-0">
                        <span className="text-sm font-medium truncate">{dim.name}</span>
                        {isMastered && (
                          <Badge variant="secondary" className="shrink-0">
                            <Check className="h-3 w-3 mr-1" />
                            Mastered
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      <div className="w-12 text-right text-sm text-muted-foreground shrink-0">
                        {completed.length}/3
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" data-testid="button-reset-progress">
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
        </div>
      </section>
    </div>
  );
}

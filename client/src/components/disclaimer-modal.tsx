import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { getHasSeenDisclaimer, setHasSeenDisclaimer } from '@/lib/storage';
import { useState, useEffect } from 'react';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!getHasSeenDisclaimer()) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    setHasSeenDisclaimer();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Before You Start
          </DialogTitle>
          <DialogDescription asChild>
          <div className="text-left pt-4 space-y-4 text-muted-foreground">
            <p>
              This app sends your prompts directly to OpenAI or Anthropic's APIs using YOUR API key.
            </p>
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Do NOT enter:</p>
                  <ul className="text-sm space-y-1 list-disc pl-4">
                    <li>Real customer names, emails, or data</li>
                    <li>Confidential company information</li>
                    <li>Passwords, tokens, or secrets</li>
                    <li>Personal health or financial information</li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="font-medium text-foreground">
              Use fictional examples only. This is a learning tool.
            </p>
          </div>
        </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button onClick={handleAccept} className="w-full sm:w-auto" data-testid="button-understand-disclaimer">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

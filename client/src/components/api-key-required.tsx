import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KeyRound, ArrowRight } from 'lucide-react';
import { hasAPIKey } from '@/lib/storage';
import { useEffect, useState } from 'react';

export function APIKeyRequired() {
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    setHasKey(hasAPIKey());
    
    const checkInterval = setInterval(() => {
      setHasKey(hasAPIKey());
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  if (hasKey) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5" data-testid="card-api-key-required">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-full bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium" data-testid="text-api-key-title">API Key Required</h3>
              <p className="text-sm text-muted-foreground">
                To run this feature, you need to add your OpenAI or Anthropic API key.
              </p>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="outline" className="gap-2 shrink-0" data-testid="button-go-to-settings">
              Go to Settings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

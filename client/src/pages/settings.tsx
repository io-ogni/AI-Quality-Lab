import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Eye, EyeOff, Check, X, Loader2, Lightbulb, Info, AlertTriangle } from 'lucide-react';
import { getAPISettings, setAPISettings, clearAPIKey, clearProgress } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { testAPIConnection } from '@/lib/api';
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
import type { APISettings } from '@/lib/types';

const openaiModels = ['gpt-4o', 'gpt-4o-mini'];
const anthropicModels = ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'];

export default function Settings() {
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const settings = getAPISettings();
    if (settings) {
      setProvider(settings.provider);
      setApiKey(settings.apiKey);
      setModel(settings.model);
    }
  }, []);

  useEffect(() => {
    setModel(provider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20241022');
  }, [provider]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API key required',
        description: 'Please enter your API key.',
        variant: 'destructive',
      });
      return;
    }

    const settings: APISettings = { provider, apiKey, model };
    setAPISettings(settings);
    setTestResult(null);
    
    toast({
      title: 'API key saved',
      description: 'Saved to this session. It will be cleared when you close the tab.',
    });
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Save API key first',
        description: 'Please save your API key before testing.',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testAPIConnection({ provider, apiKey, model });
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: 'Connection failed. Check your key.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    clearAPIKey();
    setApiKey('');
    setTestResult(null);
    toast({
      title: 'API key cleared',
      description: 'Your API key has been removed from this session.',
    });
  };

  const handleClearProgress = () => {
    clearProgress();
    toast({
      title: 'Progress cleared',
      description: 'All your challenge progress has been reset.',
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-10 border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-settings-title">
            Settings
          </h1>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium">Your API Key Security</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your key is stored ONLY in your browser's session storage</li>
                    <li>• Your key is NEVER sent to our servers</li>
                    <li>• Your key is AUTOMATICALLY DELETED when you close this browser tab</li>
                    <li>• API calls go directly from your browser to OpenAI/Anthropic</li>
                  </ul>
                  <p className="text-sm font-medium pt-2">
                    We cannot see, access, or store your API key. You're in full control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="provider">API Provider</Label>
                <Select value={provider} onValueChange={(v) => setProvider(v as 'openai' | 'anthropic')}>
                  <SelectTrigger id="provider" data-testid="select-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your API key here"
                    autoComplete="off"
                    data-lpignore="true"
                    className="pr-10"
                    data-testid="input-api-key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-toggle-key-visibility"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Key is stored in session only — will be cleared when you close the tab
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model" data-testid="select-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(provider === 'openai' ? openaiModels : anthropicModels).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} data-testid="button-save-settings">
                Save Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Test Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Make a minimal API call to verify your key works.
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={handleTest} disabled={isTesting || !apiKey} variant="outline" data-testid="button-test-connection">
                  {isTesting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Test Connection
                </Button>
                {testResult && (
                  <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResult.success ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {testResult.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Clear Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" data-testid="button-clear-api-key">
                      Clear API Key Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear API Key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove your API key from session storage immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearKey}>Clear Key</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" data-testid="button-clear-progress">
                      Clear All Progress
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Progress?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all your challenge progress. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearProgress}>Clear Progress</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Privacy & About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">AI Quality Lab</strong> is a learning tool, not a production system. 
                Once you master these concepts, you'll be able to write better AI feature specs 
                and know what questions to ask about quality.
              </p>
              <p>Complete all 33 challenges to master the fundamentals.</p>
              <p>Built for learning. Your data stays in your browser.</p>
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">What we DON'T store:</strong> Your API key (session only, never server), 
                    your prompts or outputs (never sent to us), your challenge attempts (browser only).
                    This app has no backend database. Everything stays in your browser.
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">Tip:</strong> For extra privacy, use this app in an incognito/private 
                    browser window. When you close it, everything is automatically deleted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

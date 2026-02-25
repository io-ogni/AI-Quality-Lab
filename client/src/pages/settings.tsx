import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Lightbulb,
  Info,
} from "lucide-react";
import {
  getAPISettings,
  setAPISettings,
  clearAPIKey,
  clearProgress,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { testAPIConnection } from "@/lib/api";
import { MODEL_FOR_PROVIDER } from "@/lib/types";
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
} from "@/components/ui/alert-dialog";
export default function Settings() {
  const [provider, setProvider] = useState<"openai" | "anthropic">("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const settings = getAPISettings();
    if (settings) {
      setProvider(settings.provider);
      setApiKey(settings.apiKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API key required",
        description: "Please enter your API key.",
        variant: "destructive",
      });
      return;
    }

    setAPISettings({ provider, model: MODEL_FOR_PROVIDER[provider].id, apiKey });
    setTestResult(null);

    toast({
      title: "API key saved",
      description:
        "Saved to this session. It will be cleared when you close the tab.",
    });
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Save API key first",
        description: "Please save your API key before testing.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testAPIConnection({ provider, model: MODEL_FOR_PROVIDER[provider].id, apiKey });
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: "Connection failed. Check your key.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    clearAPIKey();
    setApiKey("");
    setTestResult(null);
    toast({
      title: "API key cleared",
      description: "Your API key has been removed from this session.",
    });
  };

  const handleClearProgress = () => {
    clearProgress();
    localStorage.removeItem("errorAnalysisProgress");
    toast({
      title: "Progress cleared",
      description: "All your progress has been reset.",
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="py-10 border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            data-testid="text-settings-title"
          >
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
                  <ul className="text-muted-foreground space-y-1.5">
                    <li>
                      • Your key is stored ONLY in your browser's session
                      storage
                    </li>
                    <li>• Your key is NEVER sent to our servers</li>
                    <li>
                      • Your key is AUTOMATICALLY DELETED when you close this
                      browser tab
                    </li>
                    <li>
                      • API calls go directly from your browser to
                      OpenAI/Anthropic
                    </li>
                  </ul>
                  <p className="font-medium pt-2">
                    We cannot see, access, or store your API key. You're in full
                    control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> Generate a
                  dedicated API key just for this app. Delete it when you're
                  done learning.
                </p>
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
                <Select
                  value={provider}
                  onValueChange={(v) =>
                    setProvider(v as "openai" | "anthropic")
                  }
                >
                  <SelectTrigger id="provider" data-testid="select-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Model:{" "}
                  <span className="font-medium text-foreground">
                    {MODEL_FOR_PROVIDER[provider].label}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? "text" : "password"}
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
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Key is stored in session only — will be cleared when you close
                  the tab
                </p>
              </div>

              <Button onClick={handleSave} data-testid="button-save-settings">
                Save Settings
              </Button>

              <div className="flex items-start gap-2 pt-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Each evaluation uses{" "}
                  {MODEL_FOR_PROVIDER[provider].label}.
                  Monitor your usage at{" "}
                  {provider === "anthropic" ? (
                    <a
                      href="https://console.anthropic.com/settings/billing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground transition-colors"
                    >
                      console.anthropic.com/settings/billing
                    </a>
                  ) : (
                    <a
                      href="https://platform.openai.com/usage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground transition-colors"
                    >
                      platform.openai.com/usage
                    </a>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Test Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Make a minimal API call to verify your key works.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleTest}
                  disabled={isTesting || !apiKey}
                  variant="outline"
                  data-testid="button-test-connection"
                >
                  {isTesting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Test Connection
                </Button>
                {testResult && (
                  <div
                    className={`flex items-center gap-2 text-sm ${testResult.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {testResult.success ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
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
                    <Button
                      variant="outline"
                      data-testid="button-clear-api-key"
                    >
                      Clear API Key Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear API Key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove your API key from session storage
                        immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearKey}>
                        Clear Key
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      data-testid="button-clear-progress"
                    >
                      Clear All Progress
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Progress?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset all your progress in both the Criteria Lab and the Error Analysis Lab. This cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearProgress}>
                        Clear Progress
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
}

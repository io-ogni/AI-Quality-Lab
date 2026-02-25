import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import Learn from "@/pages/learn";
import Practice from "@/pages/practice";
import EvalChallenge from "@/pages/eval-challenge";
import Settings from "@/pages/settings";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function RedirectToGuided() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/practice?tab=guided", { replace: true }); }, []);
  return null;
}

function RedirectToOpen() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/practice?tab=open", { replace: true }); }, []);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/practice" component={Practice} />
        <Route path="/eval/:evalId" component={EvalChallenge} />
        <Route path="/challenges" component={RedirectToGuided} />
        <Route path="/sandbox" component={RedirectToOpen} />
        <Route path="/settings" component={Settings} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

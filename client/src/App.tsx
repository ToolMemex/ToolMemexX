import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DownloadPage from "@/pages/Download";
import MemeView from "@/pages/MemeView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/download" component={DownloadPage} />
      <Route path="/memeview" component={MemeView} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

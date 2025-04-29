// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { Switch, Route } from 'wouter';
import Home from './pages/Home';
import profile from './pages/Profile';
import UploadPage from './pages/UploadPage';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import { useProModal } from "@/hooks/useProModal";
import LazyProModal from "@/components/modal/LazyProModal";

const App = () => {
  const { onOpen } = useProModal();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontSizeProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/profile" component={Profile} />
                <Route path="/upload" component={UploadPage} />
                <Route path="/test" component={Test} />
                <Route component={NotFound} />
              </Switch>
              <LazyProModal />
              <Toaster />
            </div>
          </FontSizeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
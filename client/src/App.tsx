// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { Route } from 'wouter';
import Home from './pages/Home';
import Profile from './pages/profile';
import Test from './pages/Test';

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className="min-h-screen bg-background transition-colors">
            <Route path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/test" component={Test} />
            <Toaster />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
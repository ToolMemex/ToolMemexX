// src/App.tsx

import { QueryClientProvider } from "@tanstack/react-query";
import { Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Test from "@/pages/Test";
import NotFound from "@/pages/not-found";
import { createContext, useContext, useState } from 'react';


// Create ThemeContext
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  return useContext(ThemeContext);
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div>
          <Route path="/" component={Home} />
          <Route path="/test" component={Test} />
          <Route path="*" component={NotFound} />
        </div>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
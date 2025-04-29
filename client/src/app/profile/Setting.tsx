// src/app/profile/settings.tsx
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch'; // Assuming you have a premium switch component
import { Select } from '@/components/ui/select'; // Assuming you have a premium select component
import { useTheme } from 'next-themes'; // Or any other theme management library
import { Toast } from '@/components/ui/toast'; // Assuming a custom toast component for success/error notifications

const Settings = () => {
  const { theme, setTheme } = useTheme(); // Hook to manage theme state
  const [fontSize, setFontSize] = useState<string>('medium'); // Default font size

  // Handle font size change with smooth transitions
  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size); // Save to localStorage for persistence
    document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px'; // Dynamic font resizing
    Toast.success(`Font size changed to ${size}`, { duration: 3000 }); // Show success toast
  };

  // Handle theme change with smooth transitions
  const handleThemeChange = (isDarkMode: boolean) => {
    setTheme(isDarkMode ? 'dark' : 'light');
    Toast.success(`Theme changed to ${isDarkMode ? 'Dark' : 'Light'}`, { duration: 3000 }); // Show success toast
  };

  // Load font size from localStorage if available
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    setFontSize(savedFontSize);
    document.documentElement.style.fontSize = savedFontSize === 'small' ? '14px' : savedFontSize === 'medium' ? '16px' : '18px'; // Apply saved font size
  }, []);

  return (
    <div className="bg-background p-8 rounded-xl shadow-xl max-w-lg mx-auto mt-10 transition-all">
      <h2 className="text-3xl font-bold text-center text-foreground mb-8">Settings</h2>

      {/* Dark/Light Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl text-muted-foreground">Dark Mode</span>
        <Switch
          checked={theme === 'dark'}
          onChange={handleThemeChange}
          className="transition-colors duration-300 ease-in-out"
        />
      </div>

      {/* Font Size Selector */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl text-muted-foreground">Font Size</span>
        <Select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="transition-all duration-300 ease-in-out"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </Select>
      </div>

      {/* Additional Settings or Features */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl text-muted-foreground">Other Settings</span>
        <button
          onClick={() => Toast.info("Feature coming soon!", { duration: 2000 })}
          className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark transition-all"
        >
          New Feature
        </button>
      </div>
    </div>
  );
};

export default Settings;
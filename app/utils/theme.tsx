"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('display_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setTheme(settings.theme || 'light');
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
    }
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Update localStorage
    const currentSettings = localStorage.getItem('display_settings');
    let settings = { theme: newTheme, language: 'English', currency: 'USD' };
    
    if (currentSettings) {
      try {
        settings = { ...JSON.parse(currentSettings), theme: newTheme };
      } catch (error) {
        console.error('Error parsing display settings:', error);
      }
    }
    
    localStorage.setItem('display_settings', JSON.stringify(settings));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

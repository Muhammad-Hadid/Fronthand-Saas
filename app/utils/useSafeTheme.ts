"use client";

import { useTheme as useThemeContext } from './theme';

// Safe theme hook with fallback
export function useSafeTheme() {
  try {
    return useThemeContext();
  } catch (error) {
    // Fallback if ThemeProvider is not available
    console.warn('ThemeProvider not found, using fallback theme');
    return {
      theme: 'light' as const,
      setTheme: () => {},
      toggleTheme: () => {},
      mounted: true
    };
  }
}

"use client";

import { ThemeProvider } from "./utils/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

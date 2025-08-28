"use client";

import { ThemeProvider } from "./utils/theme";
import { CurrencyProvider } from "./utils/currency";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </ThemeProvider>
  );
}

import React, { createContext, useContext, useEffect, useState } from 'react';

// Currency configuration
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Custom hook to use currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Helper function to get tenant-specific storage key
const getCurrencyStorageKey = () => {
  if (typeof window === 'undefined') return 'currency';
  const tenant = localStorage.getItem('subdomain') || 'default';
  return `currency_${tenant}`;
};

// Provider component
export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  // Load currency preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = getCurrencyStorageKey();
      const savedCurrency = localStorage.getItem(storageKey) as CurrencyCode;
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  // Set currency and save to localStorage
  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      const storageKey = getCurrencyStorageKey();
      localStorage.setItem(storageKey, newCurrency);
    }
  };

  // Format price with current currency
  const formatPrice = (amount: number): string => {
    const currencyInfo = CURRENCIES[currency];
    
    // Handle different formatting for different currencies
    if (currency === 'PKR' || currency === 'INR') {
      // For PKR and INR, show with comma separators but no decimals if it's a whole number
      const formattedAmount = amount % 1 === 0 
        ? amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `${currencyInfo.symbol}${formattedAmount}`;
    } else {
      // For USD, EUR, GBP - use standard decimal formatting
      return `${currencyInfo.symbol}${amount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (): string => {
    return CURRENCIES[currency].symbol;
  };

  const value = {
    currency,
    setCurrency,
    formatPrice,
    getCurrencySymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Utility function for components that can't use the hook
export const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'USD'): string => {
  const currencyInfo = CURRENCIES[currencyCode];
  
  if (currencyCode === 'PKR' || currencyCode === 'INR') {
    const formattedAmount = amount % 1 === 0 
      ? amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${currencyInfo.symbol}${formattedAmount}`;
  } else {
    return `${currencyInfo.symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
};

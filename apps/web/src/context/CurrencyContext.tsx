'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { CurrencyCode } from '@/lib/currencies';
import { apiClient } from '@/lib/apiClient';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (amountInKES: number) => string;
  convertToKES: (amount: number) => number;
  symbol: string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const SYMBOLS: Record<string, string> = {
  KES: 'KSh',
  USD: '$',
  EUR: '€',
  GBP: '£',
  UGX: 'USh',
  TZS: 'TSh',
  NGN: '₦',
  GHS: '₵',
  ZAR: 'R',
  EGP: 'E£',
  AED: 'د.إ',
  CNY: '¥',
  INR: '₹',
  JPY: '¥',
  SAR: '﷼',
  CAD: 'CA$',
  AUD: 'A$',
  CHF: 'Fr',
  RWF: 'RF',
  ETB: 'Br',
  MAD: 'د.م',
  XOF: 'CFA',
  ZMW: 'ZK',
  BWP: 'P',
  MZN: 'MT',
  TND: 'د.ت',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('KES');
  const [rates] = useState<Record<string, number>>({ KES: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Instantly load from localStorage
    const saved = localStorage.getItem('boss_currency');
    if (saved) setCurrencyState(saved as CurrencyCode);

    // Sync with backend after store rehydrates
    const timer = setTimeout(() => {
      apiClient('/auth/currency')
        .then((data) => {
          if (data.currency) {
            setCurrencyState(data.currency as CurrencyCode);
            localStorage.setItem('boss_currency', data.currency);
          }
        })
        .catch(() => {
          // Not logged in yet — localStorage fallback already applied above
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('boss_currency', c);
    apiClient('/auth/currency', {
      method: 'PUT',
      body: JSON.stringify({ currency: c }),
    }).catch(console.error);
  };

  const convert = (amountInKES: number): string => {
    const rate = rates[currency] ?? 1;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amountInKES * rate);
  };

  const convertToKES = (amount: number): number => {
    const rate = rates[currency] ?? 1;
    return Math.round(amount / rate);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convert,
        convertToKES,
        symbol: SYMBOLS[currency] ?? currency,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}

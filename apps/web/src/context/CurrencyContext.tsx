'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { CURRENCIES, CurrencyCode } from '@/lib/currencies';
import { useBusinessStore } from '@/store/useBusinessStore';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (amountInKES: number) => string;
  convertToKES: (amount: number) => number;
  symbol: string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const API = process.env.NEXT_PUBLIC_API_URL;

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
  const { token } = useBusinessStore((s) => s);
  const [currency, setCurrencyState] = useState<CurrencyCode>('KES');
  const [rates, setRates] = useState<Record<string, number>>({ KES: 1 });
  const [loading, setLoading] = useState(true);

  // Load exchange rates
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/KES')
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates) setRates(data.rates);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load saved currency from backend when user logs in
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/v1/auth/currency`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.currency) setCurrencyState(data.currency as CurrencyCode);
      })
      .catch(() => {
        // Fallback to localStorage
        const saved = localStorage.getItem('boss_currency');
        if (saved) setCurrencyState(saved as CurrencyCode);
      });
  }, [token]);

  // Save currency to backend + localStorage when changed
  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('boss_currency', c);
    if (token) {
      fetch(`${API}/api/v1/auth/currency`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency: c }),
      }).catch(console.error);
    }
  };

  // Convert from KES to selected currency for display
  const convert = (amountInKES: number): string => {
    const rate = rates[currency] ?? 1;
    const converted = amountInKES * rate;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  // Convert from selected currency back to KES for saving
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

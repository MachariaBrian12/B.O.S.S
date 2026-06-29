'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { CurrencyCode } from '@/lib/currencies';
import { apiClient } from '@/lib/apiClient';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (amountInKES: number) => string;
  convertToKES: (amount: number) => number;
  symbol: string;
  loading: boolean;
  ratesLoading: boolean;
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

const RATES_CACHE_KEY = 'boss_exchange_rates';
const RATES_CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCachedRates(): {
  rates: Record<string, number>;
  ts: number;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > RATES_CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function setCachedRates(rates: Record<string, number>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      RATES_CACHE_KEY,
      JSON.stringify({ rates, ts: Date.now() }),
    );
  } catch {
    // localStorage full or unavailable — continue without caching
  }
}

async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Primary: open.er-api.com — free, no API key, KES as base
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/KES', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result === 'success' && data.rates) {
        return { KES: 1, ...data.rates };
      }
    }
  } catch {
    // fall through to backup
  }

  // Fallback: frankfurter.app — ECB rates, free, no key
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=KES', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        return { KES: 1, ...data.rates };
      }
    }
  } catch {
    // both sources failed
  }

  throw new Error('Could not fetch exchange rates');
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('KES');
  const [rates, setRates] = useState<Record<string, number>>({ KES: 1 });
  const [loading, setLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(true);

  const loadRates = useCallback(async () => {
    const cached = getCachedRates();
    if (cached) {
      setRates(cached.rates);
      setRatesLoading(false);
      return;
    }
    try {
      setRatesLoading(true);
      const fresh = await fetchExchangeRates();
      setRates(fresh);
      setCachedRates(fresh);
    } catch (err) {
      console.warn(
        '[CurrencyContext] Rate fetch failed, falling back to KES only:',
        err,
      );
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Restore saved currency preference immediately
    const saved = localStorage.getItem('boss_currency');
    if (saved) setCurrencyState(saved as CurrencyCode);

    // 2. Fetch live exchange rates
    loadRates();

    // 3. Sync preference from backend
    const timer = setTimeout(() => {
      apiClient('/auth/currency')
        .then((data) => {
          if (data.currency) {
            setCurrencyState(data.currency as CurrencyCode);
            localStorage.setItem('boss_currency', data.currency);
          }
        })
        .catch(() => {
          // Not logged in — localStorage fallback already applied
        })
        .finally(() => setLoading(false));
    }, 500);

    // 4. Refresh rates every hour
    const rateRefresh = setInterval(loadRates, RATES_CACHE_TTL);

    return () => {
      clearTimeout(timer);
      clearInterval(rateRefresh);
    };
  }, [loadRates]);

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
    const noDecimals = ['JPY', 'UGX', 'RWF', 'XOF', 'NGN'];
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: noDecimals.includes(currency) ? 0 : 2,
    }).format(amountInKES * rate);
  };

  const convertToKES = (amount: number): number => {
    const rate = rates[currency] ?? 1;
    if (rate === 0) return amount;
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
        ratesLoading,
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

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { CURRENCIES, CurrencyCode } from "@/lib/currencies";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (amountInKES: number) => string;
  symbol: string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("KES");
  const [rates, setRates] = useState<Record<string, number>>({ KES: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/KES")
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates) setRates(data.rates);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const convert = (amountInKES: number): string => {
    const rate = rates[currency] ?? 1;
    const converted = amountInKES * rate;
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const symbols: Record<string, string> = {
    KES: "KSh", USD: "$", EUR: "€", GBP: "£", UGX: "USh",
    TZS: "TSh", NGN: "₦", GHS: "₵", ZAR: "R", EGP: "£",
    AED: "د.إ", CNY: "¥", INR: "₹", JPY: "¥", SAR: "﷼",
    CAD: "CA$", AUD: "A$", CHF: "Fr", RWF: "Fr", ETB: "Br",
    MAD: "MAD", XOF: "CFA", ZMW: "ZK", BWP: "P", MZN: "MT", TND: "DT",
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convert, symbol: symbols[currency] ?? currency, loading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCIES, CurrencyCode } from "@/lib/currencies";

export default function CurrencyDropdown() {
  const { currency, setCurrency, loading } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      disabled={loading}
      className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.code} — {c.name}
        </option>
      ))}
    </select>
  );
}

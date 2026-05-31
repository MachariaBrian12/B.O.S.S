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
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 9,
        padding: "7px 10px",
        fontSize: 12,
        color: "#94A3B8",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code} style={{ background: "#0a0a14" }}>
          {c.flag} {c.code} — {c.name}
        </option>
      ))}
    </select>
  );
}

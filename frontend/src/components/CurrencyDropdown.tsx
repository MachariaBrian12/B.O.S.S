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
        background: "rgba(59,130,246,0.15)",
        border: "1px solid rgba(59,130,246,0.5)",
        borderRadius: 9,
        padding: "7px 10px",
        fontSize: 12,
        color: "#F1F5F9",
        cursor: "pointer",
        outline: "none",
        fontWeight: 500,
      }}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code} style={{ background: "#0a0a14", color: "#F1F5F9" }}>
          {c.flag} {c.code} — {c.name}
        </option>
      ))}
    </select>
  );
}

'use client';
import { useCurrency } from '@/context/CurrencyContext';
import { CURRENCIES, CurrencyCode } from '@/lib/currencies';

export default function CurrencyDropdown() {
  const { currency, setCurrency, loading } = useCurrency();

  const selected = CURRENCIES.find((c) => c.code === currency);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        disabled={loading}
        style={{
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.5)',
          borderRadius: 9,
          padding: '7px 32px 7px 10px',
          fontSize: 13,
          color: '#F1F5F9',
          cursor: 'pointer',
          outline: 'none',
          fontWeight: 600,
          appearance: 'none',
          WebkitAppearance: 'none',
          minWidth: 90,
        }}
      >
        {CURRENCIES.map((c) => (
          <option
            key={c.code}
            value={c.code}
            style={{ background: '#0a0a14', color: '#F1F5F9' }}
          >
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <span
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#94a3b8',
          fontSize: 10,
        }}
      >
        ▼
      </span>
    </div>
  );
}

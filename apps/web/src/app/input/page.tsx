'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics';
import { useBusinessStore } from '@/store/useBusinessStore';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencyDropdown from '@/components/CurrencyDropdown';

export default function InputPage() {
  const router = useRouter();
  const { token, setInsights } = useBusinessStore((s) => s);
  const { convert, convertToKES, symbol } = useCurrency();
  const [form, setForm] = useState({ sales: '', expenses: '', notes: '' });
  const [existing, setExisting] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    api
      .getToday(token)
      .then((d) => {
        if (d.entry) {
          setExisting(d.entry);
          // Show existing values in user's currency
          setForm({
            sales: String(d.entry.sales),
            expenses: String(d.entry.expenses),
            notes: d.entry.notes || '',
          });
        }
      })
      .catch(() => {});
  }, [token]);

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.sales || !form.expenses) {
      setError('Sales and expenses are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const fn = existing ? api.updateEntry : api.addEntry;
      // Convert from user's currency to KES before saving
      const salesInKES = convertToKES(parseFloat(form.sales));
      const expensesInKES = convertToKES(parseFloat(form.expenses));
      const data = await fn(token, {
        sales: salesInKES,
        expenses: expensesInKES,
        notes: form.notes,
      });
      if (data.insights) setInsights(data.insights);
      if (existing) {
        analytics.entryUpdated({ sales: salesInKES, expenses: expensesInKES });
      } else {
        analytics.entryCreated({ sales: salesInKES, expenses: expensesInKES });
      }
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);
    try {
      await api.deleteEntry(token);
      analytics.entryDeleted();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete entry.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const profit =
    form.sales && form.expenses
      ? parseFloat(form.sales || '0') - parseFloat(form.expenses || '0')
      : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <div className="aurora-bg">
        <div className="aurora-1" />
        <div className="aurora-2" />
        <div className="aurora-3" />
      </div>
      <div className="noise" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <Link
              href="/dashboard"
              style={{
                fontSize: 12,
                color: 'var(--t3)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t1)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t3)')}
            >
              ← Dashboard
            </Link>
            {/* Currency dropdown right here on input page */}
            <CurrencyDropdown />
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--cyan)',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            {existing ? "Edit Today's Entry" : 'Daily Entry'}
          </div>
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-.02em',
            }}
          >
            {new Date().toLocaleDateString('en-KE', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h1>
          {existing && (
            <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 4 }}>
              ✏️ Editing existing entry
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.25)',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: 13,
              color: '#EF4444',
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: 'rgba(16,185,129,.1)',
              border: '1px solid rgba(16,185,129,.25)',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: 13,
              color: '#10B981',
              textAlign: 'center',
            }}
          >
            ✓ Saved! Redirecting...
          </div>
        )}

        <form onSubmit={submit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div>
              <label className="label">Revenue ({symbol})</label>
              <input
                className="input"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.sales}
                onChange={update('sales')}
                required
              />
            </div>
            <div>
              <label className="label">Expenses ({symbol})</label>
              <input
                className="input"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.expenses}
                onChange={update('expenses')}
                required
              />
            </div>
          </div>

          {profit !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginBottom: 16,
                padding: '12px 16px',
                background:
                  profit >= 0 ? 'rgba(16,185,129,.07)' : 'rgba(239,68,68,.07)',
                border: `1px solid ${profit >= 0 ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)'}`,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: profit >= 0 ? '#10B981' : '#EF4444',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Net Profit
              </div>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: profit >= 0 ? '#10B981' : '#EF4444',
                }}
              >
                {symbol}{' '}
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(profit)}
              </div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
                ≈ KSh {convertToKES(profit).toLocaleString()} saved to database
              </div>
            </motion.div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label className="label">Notes (optional)</label>
            <textarea
              className="input"
              placeholder="Best seller today, any observations..."
              value={form.notes}
              onChange={update('notes') as any}
              style={{ resize: 'vertical', minHeight: 80 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-primary"
              type="submit"
              style={{
                flex: 1,
                justifyContent: 'center',
                padding: '14px',
                fontSize: 14,
              }}
              disabled={loading || success}
            >
              {loading
                ? 'Saving...'
                : success
                  ? 'Saved ✓'
                  : existing
                    ? 'Update Entry →'
                    : 'Save Entry →'}
            </button>
            {existing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '14px 18px',
                  borderRadius: 10,
                  border: '1px solid rgba(239,68,68,.3)',
                  background: 'rgba(239,68,68,.08)',
                  color: '#EF4444',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                🗑
              </button>
            )}
          </div>
        </form>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                marginTop: 16,
                padding: '16px',
                background: 'rgba(239,68,68,.08)',
                border: '1px solid rgba(239,68,68,.2)',
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 12 }}>
                Delete today's entry? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 9,
                    border: 'none',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {deleting ? 'Deleting...' : 'Yes, delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 9,
                    border: '1px solid rgba(255,255,255,.1)',
                    background: 'transparent',
                    color: '#94A3B8',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

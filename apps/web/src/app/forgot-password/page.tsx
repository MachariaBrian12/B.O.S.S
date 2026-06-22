'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      // Always show the sent state — the API never reveals if the email exists
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: '420px',
          padding: '48px 40px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 28,
              fontWeight: 800,
              background: 'linear-gradient(135deg,#fff,var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 6,
            }}
          >
            B.O.S.S
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--t3)',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
            }}
          >
            Forgot Password
          </div>
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

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(16,185,129,.1)',
                border: '1px solid rgba(16,185,129,.25)',
                borderRadius: 10,
                padding: '16px',
                marginBottom: 24,
                fontSize: 13,
                color: '#10B981',
              }}
            >
              ✓ If that email is registered, a reset link is on its way. Check
              your inbox.
            </div>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 16 }}>
              Didn't get it? Check your spam folder, or try again with a
              different address.
            </p>
            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: 15,
              }}
              onClick={() => setSent(false)}
            >
              Try again
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ marginBottom: 18 }}>
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--t3)' }}>
              We'll send a reset link to this address. It expires in 1 hour.
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: 15,
                marginTop: 16,
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link →'}
            </button>
          </form>
        )}

        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: 13,
            color: 'var(--t3)',
          }}
        >
          Remember it?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--cyan)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

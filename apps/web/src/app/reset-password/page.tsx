'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/apiClient';

// useSearchParams must be inside a Suspense boundary in Next.js app router
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({ newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) setTokenMissing(true);
  }, [token, email]);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setError("Passwords don't match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiClient('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email,
          token,
          newPassword: form.newPassword,
        }),
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(
        err.message || 'Failed to reset password. The link may have expired.',
      );
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
            Reset Password
          </div>
        </div>

        {tokenMissing ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(239,68,68,.1)',
                border: '1px solid rgba(239,68,68,.25)',
                borderRadius: 10,
                padding: '16px',
                marginBottom: 24,
                fontSize: 13,
                color: '#EF4444',
              }}
            >
              This reset link is invalid or incomplete. Please request a new
              one.
            </div>
            <Link href="/forgot-password">
              <button
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: 15,
                }}
              >
                Request new link →
              </button>
            </Link>
          </div>
        ) : (
          <>
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
            {success ? (
              <div
                style={{
                  background: 'rgba(16,185,129,.1)',
                  border: '1px solid rgba(16,185,129,.25)',
                  borderRadius: 10,
                  padding: '16px',
                  fontSize: 13,
                  color: '#10B981',
                  textAlign: 'center',
                }}
              >
                ✓ Password updated. Redirecting to login...
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ marginBottom: 18 }}>
                  <label className="label">New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.newPassword}
                    onChange={update('newPassword')}
                    required
                    minLength={6}
                  />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Confirm Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Repeat new password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    required
                    minLength={6}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    fontSize: 15,
                  }}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Set new password →'}
                </button>
              </form>
            )}
          </>
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

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--t3)',
          }}
        >
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

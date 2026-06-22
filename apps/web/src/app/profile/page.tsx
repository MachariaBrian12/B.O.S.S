'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useBusinessStore } from '@/store/useBusinessStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useBusinessStore((s) => s);
  const [form, setForm] = useState({
    name: user?.name || '',
    business: user?.business || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await api.updateProfile({
        name: form.name,
        business: form.business,
        ...(form.newPassword
          ? {
              currentPassword: form.currentPassword,
              newPassword: form.newPassword,
            }
          : {}),
      });
      setUser(data.user);
      setSuccess('Profile updated successfully!');
      setForm((f) => ({
        ...f,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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
      <div
        className="glass fade-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          position: 'relative',
          zIndex: 2,
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
            marginBottom: 24,
            transition: 'color .2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t3)')}
        >
          ← Dashboard
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#F1F5F9',
              }}
            >
              {user?.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>
              {user?.email}
            </div>
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
            }}
          >
            ✓ {success}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Full Name</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={update('name')}
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label">Business Name</label>
            <input
              className="input"
              type="text"
              value={form.business}
              onChange={update('business')}
              required
            />
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,.06)',
              paddingTop: 20,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--t3)',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Change Password (optional)
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Current Password</label>
              <input
                className="input"
                type="password"
                placeholder="Leave blank to keep current"
                value={form.currentPassword}
                onChange={update('currentPassword')}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">New Password</label>
              <input
                className="input"
                type="password"
                placeholder="Min 6 characters"
                value={form.newPassword}
                onChange={update('newPassword')}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">Confirm New Password</label>
              <input
                className="input"
                type="password"
                placeholder="Repeat new password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '14px',
              fontSize: 14,
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes →'}
          </button>
        </form>
      </div>
    </div>
  );
}

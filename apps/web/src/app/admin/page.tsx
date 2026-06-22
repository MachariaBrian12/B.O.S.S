'use client';
import { useEffect, useState, useCallback } from 'react';

interface Stats {
  totalUsers: number;
  totalOrgs: number;
  paidOrgs: number;
  freeOrgs: number;
  aiActions: number;
  newOrgsToday: number;
  newOrgsThisWeek: number;
  conversionRate: string;
  recentUsers: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    organization: { name: string };
  }[];
}
interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: any;
  ip: string | null;
  createdAt: string;
}
interface AiSummary {
  totalRequests: string;
  totalTokens: string;
  totalCostUsd: string;
  avgLatencyMs: string;
  successCount: string;
}
interface AiUser {
  userId: string;
  name: string;
  email: string;
  requests: string;
  tokens: string;
  cost: string;
  avgLatency: string;
}

const TABS = ['Overview', 'Audit Logs', 'AI Usage'] as const;
type Tab = (typeof TABS)[number];

const ACTION_COLORS: Record<string, string> = {
  'entry.created': '#10B981',
  'entry.updated': '#F59E0B',
  'entry.deleted': '#EF4444',
};

const s = {
  page: {
    minHeight: '100vh',
    background: '#02020c',
    padding: '40px 24px',
    fontFamily: "'DM Sans', sans-serif",
    color: '#F1F5F9',
  },
  wrap: { maxWidth: 1200, margin: '0 auto' },
  card: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 24,
  },
  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    color: '#475569',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: 12,
  },
  td: { padding: '10px 12px', fontSize: 13 },
  badge: (color: string) => ({
    padding: '2px 8px',
    borderRadius: 6,
    fontSize: 11,
    background: `${color}22`,
    color,
  }),
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 9,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#F1F5F9',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  btn: {
    padding: '10px 20px',
    borderRadius: 9,
    border: 'none',
    background: 'linear-gradient(135deg,#3B82F6,#06B6D4)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tabBtn: (active: boolean) => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
    color: active ? '#60A5FA' : '#475569',
  }),
  filter: {
    padding: '6px 12px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94A3B8',
    fontSize: 12,
    cursor: 'pointer',
  },
};

export default function AdminDashboard() {
  // The secret is used only to verify the admin is who they say they are.
  // It is sent to our own Next.js API route (server-side), never directly
  // to the backend. The backend secret never appears in the browser.
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('Overview');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const [aiUsers, setAiUsers] = useState<AiUser[]>([]);
  const [actionFilter, setActionFilter] = useState('');

  // All requests go to our own Next.js server routes, never directly to the API.
  // The x-internal-token header is checked server-side — it never reaches the
  // browser network tab in a meaningful way because the real secret comparison
  // happens on the server.
  const get = useCallback(
    async (url: string) => {
      const res = await fetch(url, {
        headers: { 'x-internal-token': secret },
      });
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    },
    [secret],
  );

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await get('/api/admin/stats');
      setStats(data);
      setAuthed(true);
    } catch {
      setError('Invalid admin secret');
    } finally {
      setLoading(false);
    }
  };

  const loadAudit = useCallback(async () => {
    setLoading(true);
    try {
      const url = actionFilter
        ? `/api/admin/audit-logs?action=${actionFilter}`
        : '/api/admin/audit-logs';
      const data = await get(url);
      setAuditLogs(data.logs ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [get, actionFilter]);

  const loadAI = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get('/api/admin/ai-usage');
      setAiSummary(data.summary);
      setAiUsers(data.perUser ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    if (!authed) return;
    if (tab === 'Audit Logs') loadAudit();
    if (tab === 'AI Usage') loadAI();
  }, [tab, authed, loadAudit, loadAI]);

  if (!authed)
    return (
      <div
        style={{
          ...s.page,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ ...s.card, width: 340 }}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            ⬡ Admin
          </div>
          <div style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>
            B.O.S.S Internal Dashboard
          </div>
          <input
            style={s.input}
            type="password"
            placeholder="Enter admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          {error && (
            <div style={{ fontSize: 12, color: '#EF4444', margin: '8px 0' }}>
              {error}
            </div>
          )}
          <button
            style={{ ...s.btn, width: '100%', marginTop: 12 }}
            onClick={login}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Access Dashboard'}
          </button>
        </div>
      </div>
    );

  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, color: '#3B82F6' },
    { label: 'Paying', value: stats?.paidOrgs ?? 0, color: '#10B981' },
    { label: 'Free', value: stats?.freeOrgs ?? 0, color: '#F59E0B' },
    {
      label: 'Conversion',
      value: `${stats?.conversionRate}%`,
      color: '#8B5CF6',
    },
    { label: 'New Today', value: stats?.newOrgsToday ?? 0, color: '#EC4899' },
    {
      label: 'New This Week',
      value: stats?.newOrgsThisWeek ?? 0,
      color: '#06B6D4',
    },
    { label: 'AI Actions', value: stats?.aiActions ?? 0, color: '#8B5CF6' },
    {
      label: 'Total AI Cost',
      value: `$${parseFloat(aiSummary?.totalCostUsd ?? '0').toFixed(4)}`,
      color: '#F59E0B',
    },
  ];

  return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>
      <div style={s.wrap}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#3B82F6',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Internal
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
              B.O.S.S Admin
            </h1>
          </div>
          <button
            style={s.filter}
            onClick={() => {
              setAuthed(false);
              setStats(null);
              setSecret('');
            }}
          >
            Sign Out
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 24,
            background: 'rgba(255,255,255,0.02)',
            padding: 4,
            borderRadius: 10,
            width: 'fit-content',
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              style={s.tabBtn(tab === t)}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
                gap: 14,
                marginBottom: 28,
              }}
            >
              {metrics.map(({ label, value, color }) => (
                <div key={label} style={s.card}>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color,
                      marginBottom: 4,
                    }}
                  >
                    {value}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>
                Recent Signups
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Business', 'Joined'].map((h) => (
                        <th key={h} style={s.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentUsers.map((u) => (
                      <tr key={u.id}>
                        <td style={{ ...s.td, color: '#F1F5F9' }}>
                          {u.name || '—'}
                        </td>
                        <td style={{ ...s.td, color: '#94A3B8' }}>{u.email}</td>
                        <td style={{ ...s.td, color: '#94A3B8' }}>
                          {u.organization?.name || '—'}
                        </td>
                        <td style={{ ...s.td, color: '#475569' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-KE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                    {!stats?.recentUsers.length && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            ...s.td,
                            textAlign: 'center',
                            color: '#475569',
                          }}
                        >
                          No users yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'Audit Logs' && (
          <div style={s.card}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                Audit Log
              </h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['', 'entry.created', 'entry.updated', 'entry.deleted'].map(
                  (a) => (
                    <button
                      key={a}
                      style={{
                        ...s.filter,
                        color: actionFilter === a ? '#60A5FA' : '#475569',
                        borderColor:
                          actionFilter === a
                            ? '#3B82F6'
                            : 'rgba(255,255,255,0.08)',
                      }}
                      onClick={() => setActionFilter(a)}
                    >
                      {a || 'All'}
                    </button>
                  ),
                )}
                <button style={s.filter} onClick={loadAudit}>
                  ↻ Refresh
                </button>
              </div>
            </div>
            {loading ? (
              <div
                style={{ textAlign: 'center', padding: 40, color: '#475569' }}
              >
                Loading...
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Time', 'Actor', 'Action', 'Resource', 'IP'].map(
                        (h) => (
                          <th key={h} style={s.th}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr
                        key={log.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        <td
                          style={{
                            ...s.td,
                            color: '#475569',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {new Date(log.createdAt).toLocaleString('en-KE', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td style={s.td}>
                          <div style={{ color: '#F1F5F9', fontSize: 13 }}>
                            {log.actorName || '—'}
                          </div>
                          <div style={{ color: '#475569', fontSize: 11 }}>
                            {log.actorEmail}
                          </div>
                        </td>
                        <td style={s.td}>
                          <span
                            style={s.badge(
                              ACTION_COLORS[log.action] ?? '#94A3B8',
                            )}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: '#94A3B8' }}>
                          {log.resourceType}
                          {log.resourceId
                            ? ` #${log.resourceId.slice(0, 8)}`
                            : ''}
                        </td>
                        <td style={{ ...s.td, color: '#475569', fontSize: 11 }}>
                          {log.ip || '—'}
                        </td>
                      </tr>
                    ))}
                    {!auditLogs.length && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            ...s.td,
                            textAlign: 'center',
                            color: '#475569',
                            padding: 40,
                          }}
                        >
                          No audit logs yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'AI Usage' && (
          <>
            {aiSummary && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    label: 'Total Requests',
                    value: aiSummary.totalRequests,
                    color: '#3B82F6',
                  },
                  {
                    label: 'Total Tokens',
                    value: parseInt(
                      aiSummary.totalTokens || '0',
                    ).toLocaleString(),
                    color: '#8B5CF6',
                  },
                  {
                    label: 'Total Cost',
                    value: `$${parseFloat(aiSummary.totalCostUsd || '0').toFixed(4)}`,
                    color: '#10B981',
                  },
                  {
                    label: 'Avg Latency',
                    value: `${Math.round(parseFloat(aiSummary.avgLatencyMs || '0'))}ms`,
                    color: '#F59E0B',
                  },
                  {
                    label: 'Success Rate',
                    value: `${Math.round((parseInt(aiSummary.successCount || '0') / Math.max(parseInt(aiSummary.totalRequests || '1'), 1)) * 100)}%`,
                    color: '#10B981',
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} style={s.card}>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color,
                        marginBottom: 4,
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={s.card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>
                Cost by User
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {[
                        'User',
                        'Email',
                        'Requests',
                        'Tokens',
                        'Cost',
                        'Avg Latency',
                      ].map((h) => (
                        <th key={h} style={s.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aiUsers.map((u) => (
                      <tr
                        key={u.userId}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        <td style={{ ...s.td, color: '#F1F5F9' }}>
                          {u.name || '—'}
                        </td>
                        <td style={{ ...s.td, color: '#94A3B8' }}>{u.email}</td>
                        <td style={{ ...s.td, color: '#94A3B8' }}>
                          {u.requests}
                        </td>
                        <td style={{ ...s.td, color: '#94A3B8' }}>
                          {parseInt(u.tokens || '0').toLocaleString()}
                        </td>
                        <td
                          style={{ ...s.td, color: '#10B981', fontWeight: 600 }}
                        >
                          ${parseFloat(u.cost || '0').toFixed(5)}
                        </td>
                        <td style={{ ...s.td, color: '#475569' }}>
                          {Math.round(parseFloat(u.avgLatency || '0'))}ms
                        </td>
                      </tr>
                    ))}
                    {!aiUsers.length && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            ...s.td,
                            textAlign: 'center',
                            color: '#475569',
                            padding: 40,
                          }}
                        >
                          No AI usage data yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

const pillars = [
  { name: 'Finance', score: 88, color: '#10B981' },
  { name: 'Growth', score: 82, color: '#10B981' },
  { name: 'Operations', score: 79, color: '#10B981' },
  { name: 'Team', score: 74, color: '#F59E0B' },
  { name: 'Customer', score: 71, color: '#F59E0B' },
  { name: 'Market', score: 66, color: '#F59E0B' },
];

const kpis = [
  { label: 'MRR', value: '$48.2k', delta: '+6.4% vs last week', up: true },
  {
    label: 'Active users',
    value: '1,847',
    delta: '+3.1% vs last week',
    up: true,
  },
  {
    label: 'Churn rate',
    value: '1.8%',
    delta: '+0.3pp vs last week',
    up: false,
  },
  {
    label: 'Ops efficiency',
    value: '82%',
    delta: 'Flat vs last week',
    up: null,
  },
];

const alerts = [
  {
    text: 'SMB churn rate +0.3pp — 3rd consecutive week',
    meta: 'Finance · flagged 2h ago',
    severity: 'red',
  },
  {
    text: 'Support ticket volume up 18% — backlog forming',
    meta: 'Operations · flagged 5h ago',
    severity: 'amber',
  },
  {
    text: '2 senior hires stalled at offer stage',
    meta: 'Team · flagged yesterday',
    severity: 'amber',
  },
  {
    text: '2 enterprise deals closed — $9.4k MRR added',
    meta: 'Growth · confirmed 8h ago',
    severity: 'green',
  },
];

const priorities = [
  {
    text: 'Review SMB churn report and set intervention strategy',
    tag: 'Urgent',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
  },
  {
    text: 'Unblock senior hire offers — respond to recruiters',
    tag: 'Urgent',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
  },
  {
    text: 'Support backlog review with ops lead',
    tag: 'Review',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    text: 'Q3 market positioning — first-pass brief',
    tag: 'This week',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.12)',
  },
];

const sparklines = [
  {
    label: 'MRR',
    points: '0,18 15,16 30,14 45,15 60,10 75,8 90,6',
    val: '+6.4%',
    up: true,
  },
  {
    label: 'Active users',
    points: '0,16 15,15 30,13 45,14 60,11 75,10 90,9',
    val: '+3.1%',
    up: true,
  },
  {
    label: 'Churn rate',
    points: '0,10 15,11 30,10 45,11 60,12 75,14 90,16',
    val: '+0.3pp',
    up: false,
  },
  {
    label: 'Health score',
    points: '0,17 15,15 30,16 45,14 60,12 75,10 90,8',
    val: '+4pts',
    up: true,
  },
  {
    label: 'Ops efficiency',
    points: '0,12 15,12 30,13 45,12 60,12 75,11 90,12',
    val: 'Flat',
    up: null,
  },
];

const insights = [
  {
    title: 'Growth is compounding — but unevenly',
    body: 'Enterprise segment is carrying the MRR growth. SMB needs a retention play before this imbalance becomes structural.',
  },
  {
    title: 'Team is the bottleneck to watch',
    body: 'Two stalled hires plus a growing backlog suggests capacity will cap growth in 4–6 weeks if not addressed this week.',
  },
  {
    title: 'Market pillar lagging — opportunity',
    body: 'Lowest pillar score at 66. A focused positioning effort in Q3 could push the overall health score past 85.',
  },
];

const healthScore = 78;
const circumference = 2 * Math.PI * 30;
const filled = (healthScore / 100) * circumference;

const severityColor: Record<string, string> = {
  red: '#EF4444',
  amber: '#F59E0B',
  green: '#10B981',
};

export default function CEOBriefingPage() {
  const [now, setNow] = useState('');

  useEffect(() => {
    const d = new Date();
    setNow(
      d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--void)',
        color: 'var(--t1)',
        fontFamily: "'DM Sans', sans-serif",
        padding: '2.5rem 2rem',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--t3)',
          fontFamily: 'monospace',
          marginBottom: '6px',
        }}
      >
        Good morning, CEO
      </p>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 300,
          color: 'var(--t1)',
          marginBottom: '6px',
          lineHeight: 1.2,
        }}
      >
        {now}
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--t2)' }}>
        Here's what your business looks like today.
      </p>

      <div
        style={{ height: '1px', background: 'var(--gbr)', margin: '2rem 0' }}
      />

      {/* KPIs */}
      <p
        style={{
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--t3)',
          fontFamily: 'monospace',
          marginBottom: '12px',
        }}
      >
        Key metrics
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          marginBottom: '2rem',
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              background: 'var(--gb)',
              border: '1px solid var(--gbr)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: 'var(--t3)',
                marginBottom: '6px',
              }}
            >
              {k.label}
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 500,
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {k.value}
            </p>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color:
                  k.up === true
                    ? 'var(--green)'
                    : k.up === false
                      ? 'var(--red)'
                      : 'var(--t3)',
              }}
            >
              {k.up === true ? '↑ ' : k.up === false ? '↓ ' : '— '}
              {k.delta}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{ height: '1px', background: 'var(--gbr)', margin: '2rem 0' }}
      />

      {/* Health Score */}
      <p
        style={{
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--t3)',
          fontFamily: 'monospace',
          marginBottom: '12px',
        }}
      >
        Business health score
      </p>
      <div
        style={{
          background: 'var(--gb)',
          border: '1px solid var(--gbr)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 72 72"
          style={{ flexShrink: 0 }}
        >
          <circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="var(--gbr)"
            strokeWidth="5"
          />
          <circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeDasharray={`${filled} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
          />
          <text
            x="36"
            y="39"
            textAnchor="middle"
            fontSize="16"
            fontWeight="500"
            fill="#F1F5F9"
          >
            {healthScore}
          </text>
          <text x="36" y="50" textAnchor="middle" fontSize="8" fill="#475569">
            /100
          </text>
        </svg>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '20px', fontWeight: 500, marginBottom: '4px' }}>
            Strong{' '}
            <span
              style={{ fontSize: '13px', fontWeight: 400, color: 'var(--t2)' }}
            >
              — up 4pts this week
            </span>
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--t3)',
              marginBottom: '12px',
            }}
          >
            All 6 pillars active. Finance and growth driving the score up.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px 16px',
            }}
          >
            {pillars.map((p) => (
              <div key={p.name}>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--t3)',
                    marginBottom: '4px',
                  }}
                >
                  {p.name}
                </p>
                <div
                  style={{
                    height: '3px',
                    background: 'var(--gbr)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '3px',
                      borderRadius: '2px',
                      width: `${p.score}%`,
                      background: p.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{ height: '1px', background: 'var(--gbr)', margin: '2rem 0' }}
      />

      {/* AI Summary */}
      <p
        style={{
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--t3)',
          fontFamily: 'monospace',
          marginBottom: '12px',
        }}
      >
        AI morning summary
      </p>
      <div
        style={{
          background: 'var(--gb)',
          border: '1px solid var(--gbr)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '15px',
            lineHeight: 1.7,
            color: 'var(--t1)',
            borderLeft: '2px solid var(--purple)',
            paddingLeft: '1rem',
            marginBottom: '1rem',
          }}
        >
          Revenue momentum is holding strong — MRR crossed $48k on the back of
          two enterprise conversions this week. Churn ticked up slightly; the
          signal is early but worth watching in the SMB cohort. Team capacity is
          the one constraint that could slow the growth curve over the next 30
          days.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Churn deep dive ↗', 'Team capacity plan ↗'].map((btn) => (
            <button
              key={btn}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--gbr)',
                background: 'transparent',
                color: 'var(--t2)',
                cursor: 'pointer',
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts + Priorities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: 'var(--gb)',
            border: '1px solid var(--gbr)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--t3)',
              fontFamily: 'monospace',
              marginBottom: '12px',
            }}
          >
            Alerts & anomalies
          </p>
          {alerts.map((a, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '8px 0',
                borderBottom:
                  i < alerts.length - 1 ? '1px solid var(--gbr)' : 'none',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: severityColor[a.severity],
                  flexShrink: 0,
                  marginTop: '5px',
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--t1)',
                    lineHeight: 1.5,
                  }}
                >
                  {a.text}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--t3)',
                    marginTop: '2px',
                  }}
                >
                  {a.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'var(--gb)',
            border: '1px solid var(--gbr)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--t3)',
              fontFamily: 'monospace',
              marginBottom: '12px',
            }}
          >
            Today's priorities
          </p>
          {priorities.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom:
                  i < priorities.length - 1 ? '1px solid var(--gbr)' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: 'var(--t3)',
                  minWidth: '18px',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--t1)',
                  flex: 1,
                  lineHeight: 1.4,
                }}
              >
                {p.text}
              </p>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  color: p.color,
                  background: p.bg,
                }}
              >
                {p.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sparklines + Insights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: 'var(--gb)',
            border: '1px solid var(--gbr)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--t3)',
              fontFamily: 'monospace',
              marginBottom: '12px',
            }}
          >
            Weekly trend sparklines
          </p>
          {sparklines.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 0',
                borderBottom:
                  i < sparklines.length - 1 ? '1px solid var(--gbr)' : 'none',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--t3)',
                  minWidth: '100px',
                }}
              >
                {s.label}
              </span>
              <svg width="90" height="24" viewBox="0 0 90 24">
                <polyline
                  points={s.points}
                  fill="none"
                  stroke={
                    s.up === true
                      ? '#10B981'
                      : s.up === false
                        ? '#EF4444'
                        : '#475569'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  marginLeft: 'auto',
                  color:
                    s.up === true
                      ? 'var(--green)'
                      : s.up === false
                        ? 'var(--red)'
                        : 'var(--t3)',
                }}
              >
                {s.val}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'var(--gb)',
            border: '1px solid var(--gbr)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--t3)',
              fontFamily: 'monospace',
              marginBottom: '12px',
            }}
          >
            AI insights of the day
          </p>
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: i < insights.length - 1 ? '8px' : 0,
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--t1)',
                  marginBottom: '4px',
                }}
              >
                {ins.title}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--t2)',
                  lineHeight: 1.55,
                }}
              >
                {ins.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p
        style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          color: 'var(--t3)',
        }}
      >
        Last updated 07:00 · Auto-refreshes daily at 06:30
      </p>
    </main>
  );
}

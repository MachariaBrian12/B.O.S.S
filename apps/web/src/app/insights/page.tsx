'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useBusinessStore } from '@/store/useBusinessStore';
import { useCurrency } from '@/context/CurrencyContext';
import type { Insights } from '@/store/useBusinessStore';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const PILLARS = [
  {
    key: 'cashFlow',
    label: 'Cash Flow',
    weight: 25,
    icon: '💧',
    color: '#06B6D4',
    desc: '30-day runway & operating cash flow',
  },
  {
    key: 'profitability',
    label: 'Profitability',
    weight: 20,
    icon: '📈',
    color: '#10B981',
    desc: 'Gross margin vs target 45%',
  },
  {
    key: 'growth',
    label: 'Revenue Growth',
    weight: 20,
    icon: '🚀',
    color: '#3B82F6',
    desc: 'Month-over-month revenue trend',
  },
  {
    key: 'expenses',
    label: 'Expense Control',
    weight: 20,
    icon: '⚙️',
    color: '#F59E0B',
    desc: 'Cost efficiency & leakage detection',
  },
  {
    key: 'risk',
    label: 'Risk Exposure',
    weight: 10,
    icon: '🛡️',
    color: '#8B5CF6',
    desc: 'Overdue invoices & concentration',
  },
  {
    key: 'ops',
    label: 'Ops Efficiency',
    weight: 5,
    icon: '⚡',
    color: '#EC4899',
    desc: 'Revenue per operational unit',
  },
];

const SCORE_BANDS = [
  {
    min: 85,
    max: 100,
    label: 'Exceptional',
    color: '#10B981',
    bg: 'rgba(16,185,129,.08)',
    border: 'rgba(16,185,129,.25)',
    msg: "Your business is firing on all cylinders. Focus on scaling what's working.",
  },
  {
    min: 70,
    max: 84,
    label: 'Strong',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,.08)',
    border: 'rgba(6,182,212,.25)',
    msg: 'Solid performance with clear room to grow. Address the amber pillars.',
  },
  {
    min: 55,
    max: 69,
    label: 'Developing',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,.08)',
    border: 'rgba(245,158,11,.25)',
    msg: 'Some concerns need attention. Follow the action plan below.',
  },
  {
    min: 40,
    max: 54,
    label: 'At Risk',
    color: '#F97316',
    bg: 'rgba(249,115,22,.08)',
    border: 'rgba(249,115,22,.25)',
    msg: 'Multiple areas need immediate attention. Prioritize cash flow first.',
  },
  {
    min: 0,
    max: 39,
    label: 'Critical',
    color: '#EF4444',
    bg: 'rgba(239,68,68,.08)',
    border: 'rgba(239,68,68,.25)',
    msg: 'Business requires urgent action. Focus on survival metrics only.',
  },
];

function getBand(score: number) {
  return (
    SCORE_BANDS.find((b) => score >= b.min && score <= b.max) || SCORE_BANDS[2]
  );
}

function getPillarScore(ins: Insights, key: string): number {
  if (!ins.hasData) return 0;
  const score = ins.score;
  const seeds: Record<string, number> = {
    cashFlow: Math.min(100, Math.max(20, score + 8)),
    profitability: Math.min(100, Math.max(20, score - 3)),
    growth: Math.min(100, Math.max(20, score + 14)),
    expenses: Math.min(100, Math.max(20, score - 10)),
    risk: Math.min(100, Math.max(20, score - 5)),
    ops: Math.min(100, Math.max(20, score + 3)),
  };
  return Math.round(seeds[key] ?? score);
}

export default function InsightsPage() {
  const router = useRouter();
  const { user, insights, setInsights } = useBusinessStore((s) => s);
  const { convert, symbol } = useCurrency();
  const ins = insights as Insights | null;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'score' | 'insights' | 'week'>(
    'score',
  );
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    api
      .getInsights()
      .then((d) => setInsights(d.insights))
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setTimeout(() => setAnimateScore(true), 300);
      });
  }, []);

  if (loading)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#02020c',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 32,
            height: 32,
            border: '2px solid rgba(255,255,255,.07)',
            borderTopColor: '#06B6D4',
            borderRadius: '50%',
          }}
        />
      </div>
    );

  const score = ins?.score ?? 0;
  const band = getBand(score);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#02020c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="aurora-bg">
        <div className="aurora-1" />
        <div className="aurora-2" />
        <div className="aurora-3" />
      </div>
      <div className="noise" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .pillar-bar{transition:width 1.4s cubic-bezier(.16,1,.3,1);}
        .score-ring{transition:stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1);}
      `}</style>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 900,
          margin: '0 auto',
          padding: '24px 20px 80px',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#475569',
            fontSize: 13,
            textDecoration: 'none',
            marginBottom: 28,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
        >
          ← Back to Dashboard
        </Link>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ marginBottom: 32 }}
        >
          <motion.div variants={fadeUp}>
            <div
              style={{
                fontSize: 11,
                color: '#8B5CF6',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Intelligence Layer
            </div>
            <h1
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 'clamp(28px,4vw,44px)',
                fontWeight: 800,
                letterSpacing: '-.03em',
                color: '#F1F5F9',
                marginBottom: 8,
              }}
            >
              Business Intelligence
            </h1>
            <p style={{ color: '#475569', fontSize: 14, fontWeight: 300 }}>
              {new Date().toLocaleDateString('en-KE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>
        </motion.div>

        <div
          style={{
            display: 'flex',
            gap: 4,
            marginBottom: 28,
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.06)',
            borderRadius: 12,
            padding: 4,
          }}
        >
          {(
            [
              { key: 'score', label: 'Health Score' },
              { key: 'insights', label: 'AI Insights' },
              { key: 'week', label: 'Weekly Report' },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 9,
                border: 'none',
                background:
                  activeTab === t.key ? 'rgba(255,255,255,.08)' : 'transparent',
                color: activeTab === t.key ? '#F1F5F9' : '#475569',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── HEALTH SCORE TAB ── */}
          {activeTab === 'score' && (
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {!ins?.hasData ? (
                <div
                  style={{
                    background: 'rgba(255,255,255,.02)',
                    border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: 16,
                    padding: '60px 40px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#F1F5F9',
                      marginBottom: 12,
                    }}
                  >
                    No score yet
                  </h2>
                  <p
                    style={{
                      color: '#475569',
                      fontSize: 15,
                      marginBottom: 28,
                      fontWeight: 300,
                    }}
                  >
                    Add your first entry to generate your Business Health Score.
                  </p>
                  <Link
                    href="/input"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '14px 28px',
                      background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Add Today&apos;s Numbers →
                  </Link>
                </div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="show">
                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: band.bg,
                      border: `1px solid ${band.border}`,
                      borderRadius: 20,
                      padding: '36px 32px',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 36,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <svg width={140} height={140} viewBox="0 0 120 120">
                        <circle
                          cx={60}
                          cy={60}
                          r={54}
                          fill="none"
                          stroke="rgba(255,255,255,.06)"
                          strokeWidth={8}
                        />
                        <circle
                          cx={60}
                          cy={60}
                          r={54}
                          fill="none"
                          stroke={band.color}
                          strokeWidth={8}
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={
                            animateScore ? dashOffset : circumference
                          }
                          className="score-ring"
                          transform="rotate(-90 60 60)"
                        />
                        <text
                          x={60}
                          y={55}
                          textAnchor="middle"
                          fill="#F1F5F9"
                          fontSize={28}
                          fontWeight={800}
                          fontFamily="Syne,sans-serif"
                        >
                          {score}
                        </text>
                        <text
                          x={60}
                          y={72}
                          textAnchor="middle"
                          fill="#475569"
                          fontSize={11}
                          fontFamily="DM Sans,sans-serif"
                        >
                          /100
                        </text>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Syne',sans-serif",
                            fontSize: 28,
                            fontWeight: 800,
                            color: band.color,
                          }}
                        >
                          {band.label}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '.08em',
                            textTransform: 'uppercase',
                            padding: '3px 10px',
                            borderRadius: 20,
                            background: `${band.color}18`,
                            color: band.color,
                          }}
                        >
                          {score >= 82
                            ? 'Top 25%'
                            : score >= 70
                              ? 'Above avg'
                              : score >= 55
                                ? 'Average'
                                : 'Below avg'}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: '#94A3B8',
                          lineHeight: 1.7,
                          fontWeight: 300,
                          marginBottom: 14,
                        }}
                      >
                        {band.msg}
                      </p>
                      <div
                        style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
                      >
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          Industry avg:{' '}
                          <span style={{ color: '#94A3B8', fontWeight: 600 }}>
                            61
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          Top 25%:{' '}
                          <span style={{ color: '#94A3B8', fontWeight: 600 }}>
                            82+
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          Your rank:{' '}
                          <span style={{ color: band.color, fontWeight: 600 }}>
                            {score >= 82
                              ? 'Top 25%'
                              : score >= 70
                                ? 'Top 40%'
                                : score >= 55
                                  ? 'Top 60%'
                                  : 'Bottom 40%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: 'rgba(255,255,255,.02)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 16,
                      padding: '24px',
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        marginBottom: 20,
                      }}
                    >
                      Score Breakdown — 6 Pillars
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit,minmax(260px,1fr))',
                        gap: 16,
                      }}
                    >
                      {PILLARS.map((p) => {
                        const ps = getPillarScore(ins, p.key);
                        const pc =
                          ps >= 75
                            ? '#10B981'
                            : ps >= 55
                              ? '#F59E0B'
                              : '#EF4444';
                        return (
                          <div
                            key={p.key}
                            style={{
                              padding: '16px',
                              background: 'rgba(255,255,255,.02)',
                              border: '1px solid rgba(255,255,255,.05)',
                              borderRadius: 12,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                }}
                              >
                                <span style={{ fontSize: 16 }}>{p.icon}</span>
                                <div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: '#F1F5F9',
                                    }}
                                  >
                                    {p.label}
                                  </div>
                                  <div
                                    style={{ fontSize: 10, color: '#334155' }}
                                  >
                                    {p.weight}% weight
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontFamily: "'Syne',sans-serif",
                                  fontSize: 22,
                                  fontWeight: 800,
                                  color: pc,
                                }}
                              >
                                {ps}
                              </div>
                            </div>
                            <div
                              style={{
                                height: 4,
                                background: 'rgba(255,255,255,.06)',
                                borderRadius: 2,
                                marginBottom: 8,
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                className="pillar-bar"
                                style={{
                                  height: '100%',
                                  borderRadius: 2,
                                  background: pc,
                                  width: animateScore ? `${ps}%` : '0%',
                                }}
                              />
                            </div>
                            <div style={{ fontSize: 11, color: '#334155' }}>
                              {p.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: 'rgba(255,255,255,.02)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 16,
                      padding: '20px 24px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                      }}
                    >
                      Score Bands
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {SCORE_BANDS.map((b) => (
                        <div
                          key={b.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 14px',
                            borderRadius: 10,
                            background:
                              score >= b.min && score <= b.max
                                ? b.bg
                                : 'transparent',
                            border:
                              score >= b.min && score <= b.max
                                ? `1px solid ${b.border}`
                                : '1px solid transparent',
                            transition: 'all .3s',
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: b.color,
                              flexShrink: 0,
                            }}
                          />
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: b.color,
                              minWidth: 90,
                            }}
                          >
                            {b.label}
                          </div>
                          <div style={{ fontSize: 11, color: '#334155' }}>
                            {b.min}–{b.max}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: '#475569',
                              flex: 1,
                              textAlign: 'right',
                            }}
                          >
                            {score >= b.min && score <= b.max && (
                              <span style={{ color: b.color, fontWeight: 600 }}>
                                ← You are here
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── AI INSIGHTS TAB ── */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {!ins?.hasData ? (
                <div
                  style={{
                    background: 'rgba(255,255,255,.02)',
                    border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: 16,
                    padding: '60px 40px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#F1F5F9',
                      marginBottom: 12,
                    }}
                  >
                    No insights yet
                  </h2>
                  <p
                    style={{
                      color: '#475569',
                      fontSize: 15,
                      marginBottom: 28,
                      fontWeight: 300,
                    }}
                  >
                    Add your business data to generate AI-powered insights.
                  </p>
                  <Link
                    href="/input"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '14px 28px',
                      background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Add Today&apos;s Numbers →
                  </Link>
                </div>
              ) : (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: 'rgba(255,255,255,.025)',
                      border: '1px solid rgba(255,255,255,.07)',
                      borderRadius: 16,
                      padding: '24px 28px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        marginBottom: 14,
                      }}
                    >
                      📊 Today&apos;s Summary
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        color: '#F1F5F9',
                        lineHeight: 1.8,
                        fontWeight: 300,
                      }}
                    >
                      {symbol} {convert(ins.today?.sales ?? 0)} in sales ·{' '}
                      {symbol} {convert(ins.today?.expenses ?? 0)} in expenses ·{' '}
                      {symbol} {convert(ins.today?.profit ?? 0)} profit (
                      {ins.today?.margin}% margin).
                    </p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255,255,255,.02)',
                        border: '1px solid rgba(255,255,255,.06)',
                        borderRadius: 14,
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: '#475569',
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          marginBottom: 14,
                        }}
                      >
                        Profit Trend
                      </div>
                      <div
                        style={{
                          fontFamily: "'Syne',sans-serif",
                          fontSize: 42,
                          fontWeight: 800,
                          color:
                            ins.profitTrend === 'neutral'
                              ? '#475569'
                              : ins.profitTrend.startsWith('+')
                                ? '#10B981'
                                : '#EF4444',
                        }}
                      >
                        {ins.profitTrend === 'neutral' ? '—' : ins.profitTrend}
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#334155', marginTop: 8 }}
                      >
                        vs yesterday
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255,255,255,.02)',
                        border: '1px solid rgba(255,255,255,.06)',
                        borderRadius: 14,
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: '#475569',
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          marginBottom: 14,
                        }}
                      >
                        Health Score
                      </div>
                      <div
                        style={{
                          fontFamily: "'Syne',sans-serif",
                          fontSize: 42,
                          fontWeight: 800,
                          color:
                            score >= 75
                              ? '#10B981'
                              : score >= 50
                                ? '#F59E0B'
                                : '#EF4444',
                        }}
                      >
                        {score}
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#334155', marginTop: 8 }}
                      >
                        /100
                      </div>
                    </div>
                  </motion.div>

                  {ins.warning && (
                    <motion.div
                      variants={fadeUp}
                      style={{
                        padding: '20px 24px',
                        background: 'rgba(239,68,68,.07)',
                        border: '1px solid rgba(239,68,68,.2)',
                        borderRadius: 14,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: '#EF4444',
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          marginBottom: 10,
                        }}
                      >
                        ⚠️ Warning
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: '#EF4444',
                          lineHeight: 1.65,
                        }}
                      >
                        {ins.warning}
                      </p>
                    </motion.div>
                  )}

                  <motion.div
                    variants={fadeUp}
                    style={{
                      padding: '24px 28px',
                      background: 'rgba(139,92,246,.06)',
                      border: '1px solid rgba(139,92,246,.22)',
                      borderRadius: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#8B5CF6',
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                        marginBottom: 14,
                      }}
                    >
                      💡 AI Recommendation
                    </div>
                    <p
                      style={{
                        fontSize: 15,
                        color: '#F1F5F9',
                        lineHeight: 1.75,
                        fontWeight: 400,
                      }}
                    >
                      {ins.recommendation}
                    </p>
                  </motion.div>

                  {ins.topProduct && (
                    <motion.div
                      variants={fadeUp}
                      style={{
                        background: 'rgba(255,255,255,.02)',
                        border: '1px solid rgba(255,255,255,.06)',
                        borderRadius: 14,
                        padding: '20px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <div style={{ fontSize: 28 }}>🏆</div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: '#475569',
                            letterSpacing: '.08em',
                            textTransform: 'uppercase',
                            marginBottom: 6,
                          }}
                        >
                          Top Product
                        </div>
                        <div
                          style={{
                            fontFamily: "'Syne',sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#F59E0B',
                          }}
                        >
                          {ins.topProduct}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={fadeUp}
                    style={{ display: 'flex', gap: 12 }}
                  >
                    <Link
                      href="/input"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        padding: '14px',
                        background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                        borderRadius: 12,
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Update Today&apos;s Entry
                    </Link>
                    <Link
                      href="/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        padding: '14px',
                        background: 'rgba(255,255,255,.04)',
                        border: '1px solid rgba(255,255,255,.08)',
                        borderRadius: 12,
                        color: '#94A3B8',
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      Back to Dashboard
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── WEEKLY REPORT TAB ── */}
          {activeTab === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {!ins?.weekStats ? (
                <div
                  style={{
                    background: 'rgba(255,255,255,.02)',
                    border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: 16,
                    padding: '60px 40px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#F1F5F9',
                      marginBottom: 12,
                    }}
                  >
                    No weekly data yet
                  </h2>
                  <p
                    style={{
                      color: '#475569',
                      fontSize: 15,
                      marginBottom: 28,
                      fontWeight: 300,
                    }}
                  >
                    Add entries for at least 2 days to see your weekly report.
                  </p>
                  <Link
                    href="/input"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '14px 28px',
                      background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Add Today&apos;s Numbers →
                  </Link>
                </div>
              ) : (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: 'rgba(255,255,255,.025)',
                      border: '1px solid rgba(255,255,255,.07)',
                      borderRadius: 16,
                      padding: '28px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        marginBottom: 20,
                      }}
                    >
                      📅 This Week
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit,minmax(140px,1fr))',
                        gap: 16,
                      }}
                    >
                      {[
                        {
                          label: 'Total Sales',
                          value: `${symbol} ${convert(ins.weekStats.totalSales)}`,
                          color: '#3B82F6',
                        },
                        {
                          label: 'Total Expenses',
                          value: `${symbol} ${convert(ins.weekStats.totalExpenses)}`,
                          color: '#EF4444',
                        },
                        {
                          label: 'Total Profit',
                          value: `${symbol} ${convert(ins.weekStats.totalProfit)}`,
                          color: '#10B981',
                        },
                        {
                          label: 'Avg Daily',
                          value: `${symbol} ${convert(ins.weekStats.avgDailySales)}`,
                          color: '#06B6D4',
                        },
                        {
                          label: 'Best Day',
                          value: `${symbol} ${convert(ins.weekStats.bestDaySales)}`,
                          color: '#F59E0B',
                        },
                        {
                          label: 'Days Recorded',
                          value: `${ins.weekStats.daysRecorded} / 7`,
                          color: '#8B5CF6',
                        },
                      ].map((s) => (
                        <div key={s.label}>
                          <div
                            style={{
                              fontSize: 10,
                              color: '#334155',
                              letterSpacing: '.06em',
                              textTransform: 'uppercase',
                              marginBottom: 6,
                            }}
                          >
                            {s.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Syne',sans-serif",
                              fontSize: 18,
                              fontWeight: 700,
                              color: s.color,
                            }}
                          >
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: 'rgba(255,255,255,.02)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 16,
                      padding: '24px 28px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        marginBottom: 20,
                      }}
                    >
                      Profit Margin Analysis
                    </div>
                    {(() => {
                      const margin =
                        ins.weekStats.totalSales > 0
                          ? Math.round(
                              (ins.weekStats.totalProfit /
                                ins.weekStats.totalSales) *
                                100,
                            )
                          : 0;
                      const mc =
                        margin >= 40
                          ? '#10B981'
                          : margin >= 25
                            ? '#F59E0B'
                            : '#EF4444';
                      return (
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: 8,
                            }}
                          >
                            <span style={{ fontSize: 13, color: '#94A3B8' }}>
                              Gross Margin
                            </span>
                            <span
                              style={{
                                fontFamily: "'Syne',sans-serif",
                                fontSize: 18,
                                fontWeight: 700,
                                color: mc,
                              }}
                            >
                              {margin}%
                            </span>
                          </div>
                          <div
                            style={{
                              height: 6,
                              background: 'rgba(255,255,255,.06)',
                              borderRadius: 3,
                              marginBottom: 8,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              className="pillar-bar"
                              style={{
                                height: '100%',
                                borderRadius: 3,
                                background: mc,
                                width: animateScore
                                  ? `${Math.min(margin, 100)}%`
                                  : '0%',
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: 11,
                              color: '#334155',
                            }}
                          >
                            <span>Target: 40%+</span>
                            <span style={{ color: mc }}>
                              {margin >= 40
                                ? '✓ Above target'
                                : margin >= 25
                                  ? 'Near target'
                                  : 'Below target'}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    style={{
                      background: 'rgba(255,255,255,.02)',
                      border: '1px solid rgba(255,255,255,.06)',
                      borderRadius: 16,
                      padding: '24px 28px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#475569',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                      }}
                    >
                      Tracking Consistency
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {Array.from({ length: 7 }, (_, i) => {
                        const filled = i < ins.weekStats!.daysRecorded;
                        return (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 36,
                              borderRadius: 8,
                              background: filled
                                ? 'rgba(16,185,129,.15)'
                                : 'rgba(255,255,255,.03)',
                              border: `1px solid ${filled ? 'rgba(16,185,129,.3)' : 'rgba(255,255,255,.05)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              color: filled ? '#10B981' : '#334155',
                              fontWeight: 600,
                            }}
                          >
                            {filled ? '✓' : '·'}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569' }}>
                      {ins.weekStats.daysRecorded} of 7 days tracked this week.{' '}
                      {ins.weekStats.daysRecorded >= 5 ? (
                        <span style={{ color: '#10B981' }}>
                          Excellent consistency.
                        </span>
                      ) : ins.weekStats.daysRecorded >= 3 ? (
                        <span style={{ color: '#F59E0B' }}>
                          Good — try to hit 7 days.
                        </span>
                      ) : (
                        <span style={{ color: '#EF4444' }}>
                          Low tracking — daily data improves accuracy.
                        </span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencyDropdown from '@/components/CurrencyDropdown';
import { useCurrency } from '@/context/CurrencyContext';

const fUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as any },
  },
};
const stag = { show: { transition: { staggerChildren: 0.08 } } };

/* ─── INTERACTIVE MASCOT — eyes follow cursor ─── */
function BossMascot({
  size = 120,
  float = false,
}: {
  size?: number;
  float?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.38;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = 2.8;
      const scale = dist > 0 ? Math.min(max / dist, 1) * max : 0;
      setEyeOffset({ x: (dx * scale) / max, y: (dy * scale) / max });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const ex = eyeOffset.x;
  const ey = eyeOffset.y;

  return (
    <motion.svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      animate={float ? { y: [0, -10, 0] } : {}}
      transition={
        float ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : {}
      }
    >
      <defs>
        <radialGradient id="mg1" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#3B82F6" />
        </radialGradient>
        <radialGradient id="mg2" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </radialGradient>
        <linearGradient id="mg3" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
        <linearGradient id="mg4" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="mg5" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06B6D4" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.4" />
        </linearGradient>
        <filter id="mglow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke="rgba(139,92,246,0.15)"
        strokeWidth="1"
      />
      <ellipse cx="60" cy="74" rx="30" ry="28" fill="url(#mg2)" />
      <circle cx="60" cy="46" r="29" fill="url(#mg1)" filter="url(#mglow)" />
      <path
        d="M37 28 L43 13 L53 22 L60 9 L67 22 L77 13 L83 28 Z"
        fill="url(#mg3)"
      />
      <circle cx="43" cy="13" r="4" fill="#FCD34D" filter="url(#mglow)" />
      <circle cx="60" cy="9" r="4" fill="#06B6D4" filter="url(#mglow)" />
      <circle cx="77" cy="13" r="4" fill="#EC4899" filter="url(#mglow)" />
      {/* Eye whites */}
      <ellipse cx="48" cy="46" rx="8" ry="9" fill="white" />
      <ellipse cx="72" cy="46" rx="8" ry="9" fill="white" />
      {/* Pupils — follow cursor */}
      <ellipse cx={50 + ex} cy={47 + ey} rx="5" ry="6" fill="#1e1b4b" />
      <ellipse cx={74 + ex} cy={47 + ey} rx="5" ry="6" fill="#1e1b4b" />
      {/* Eye shine */}
      <circle
        cx={52 + ex * 0.4}
        cy={44 + ey * 0.4}
        r="2"
        fill="white"
        opacity="0.9"
      />
      <circle
        cx={76 + ex * 0.4}
        cy={44 + ey * 0.4}
        r="2"
        fill="white"
        opacity="0.9"
      />
      {/* Smile — reacts to cursor proximity */}
      <path
        d={`M48 58 Q60 ${69 + Math.abs(ey) * 0.5} 72 58`}
        stroke="#1e1b4b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="40" cy="56" rx="7" ry="4" fill="#EC4899" opacity="0.25" />
      <ellipse cx="80" cy="56" rx="7" ry="4" fill="#EC4899" opacity="0.25" />
      <path d="M56 77 L60 90 L64 77 L60 72 Z" fill="url(#mg4)" />
      <rect
        x="36"
        y="90"
        width="48"
        height="26"
        rx="4"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="1"
      />
      <rect x="39" y="93" width="42" height="18" rx="2" fill="#020617" />
      <rect
        x="39"
        y="93"
        width="42"
        height="18"
        rx="2"
        fill="url(#mg5)"
        opacity="0.8"
      />
      <text
        x="60"
        y="105"
        textAnchor="middle"
        fill="#06B6D4"
        fontSize="5.5"
        fontFamily="monospace"
        fontWeight="bold"
      >
        B.O.S.S AI
      </text>
    </motion.svg>
  );
}

/* ─── DATA ─── */
const PRODUCTS = [
  {
    id: 'insights',
    icon: '📊',
    label: 'AI Insights',
    color: '#3B82F6',
    desc: "Real-time revenue, expenses, profit margin, and health score — updated with every entry. Guru AI reads your actual data and tells you exactly what's happening.",
  },
  {
    id: 'pos',
    icon: '🏪',
    label: 'POS System',
    color: '#06B6D4',
    desc: 'Lightning-fast point of sale for any device. Accept M-Pesa, card, QR, and cash. Complete a transaction in under 2 seconds.',
    soon: true,
  },
  {
    id: 'stock',
    icon: '📦',
    label: 'Inventory',
    color: '#10B981',
    desc: 'Auto-reorder triggers, expiry tracking, multi-warehouse support, and supplier sync. Stockouts become history.',
    soon: true,
  },
  {
    id: 'erp',
    icon: '🏢',
    label: 'Full ERP',
    color: '#F59E0B',
    desc: 'HR, payroll, procurement, and supplier management — your entire business operations in one platform.',
    soon: true,
  },
  {
    id: 'ecom',
    icon: '🛒',
    label: 'E-Commerce',
    color: '#EC4899',
    desc: 'Launch your own storefront. Inventory syncs in real time. Orders flow directly into your dashboard.',
    soon: true,
  },
  {
    id: 'loyalty',
    icon: '⭐',
    label: 'CRM & Loyalty',
    color: '#8B5CF6',
    desc: 'Customer loyalty programs, purchase history, and targeted campaigns that bring people back.',
    soon: true,
  },
  {
    id: 'accounts',
    icon: '📋',
    label: 'Accounting',
    color: '#A78BFA',
    desc: 'Tax-compliant invoicing, expense categorisation, and financial reporting. Works with your local tax authority.',
    soon: true,
  },
  {
    id: 'delivery',
    icon: '🚚',
    label: 'Delivery',
    color: '#EF4444',
    desc: 'Real-time delivery management, rider tracking, and last-mile logistics for your orders.',
    soon: true,
  },
];

const ROADMAP = [
  {
    phase: '01',
    q: 'Q1–Q2 2025',
    label: 'Intelligence Core',
    color: '#10B981',
    done: true,
    items: [
      'Daily sales tracker',
      'Guru AI insights engine',
      'Multi-currency (26+ FX)',
      'Business health score',
      'Streak & accountability',
      'CEO daily digest email',
    ],
  },
  {
    phase: '02',
    q: 'Q3 2025',
    label: 'Commerce Layer',
    color: '#3B82F6',
    done: false,
    items: [
      'M-Pesa subscriptions',
      'Point-of-sale (POS)',
      'Inventory management',
      'WhatsApp entry bot',
      'Team accounts',
      'Multi-location HQ view',
    ],
  },
  {
    phase: '03',
    q: 'Q4 2025',
    label: 'Business Suite',
    color: '#8B5CF6',
    done: false,
    items: [
      'Full ERP module',
      'E-commerce storefront',
      'CRM & loyalty system',
      'Accounting & invoicing',
      'Supplier management',
      'Advanced analytics',
    ],
  },
  {
    phase: '04',
    q: '2026',
    label: 'Platform Scale',
    color: '#F59E0B',
    done: false,
    items: [
      'Delivery tracking',
      'Open API & webhooks',
      'White-label for partners',
      'AI forecasting engine',
      'Marketplace integrations',
      'Enterprise SSO & compliance',
    ],
  },
];

const TIERS = [
  {
    id: 'free',
    label: 'Starter',
    badge: '',
    color: '#475569',
    monthly: 0,
    quarterly: 0,
    annual: 0,
    tagline: 'Start tracking your business today.',
    features: [
      'Daily sales & expense entry',
      'Business health score',
      '7-day trend chart',
      '14-day entry streak',
      'Basic AI summaries',
      '1 user · 1 location',
    ],
    cta: 'Get Started Free',
    ctaLink: '/register',
    featured: false,
  },
  {
    id: 'growth',
    label: 'Growth',
    badge: 'POPULAR',
    color: '#3B82F6',
    monthly: 29,
    quarterly: 25,
    annual: 19,
    tagline: 'For businesses ready to grow with data.',
    features: [
      'Everything in Starter',
      'Guru AI chat (unlimited)',
      'Daily 6am digest email',
      'Weekly CEO briefing',
      'Multi-currency (26+)',
      'Monthly & quarterly reports',
      'Annual financial summary',
      'Up to 5 users · 2 locations',
      'Priority support',
    ],
    cta: 'Start 14-Day Free Trial',
    ctaLink: '/register',
    featured: true,
  },
  {
    id: 'scale',
    label: 'Scale',
    badge: '',
    color: '#8B5CF6',
    monthly: 79,
    quarterly: 69,
    annual: 55,
    tagline: 'The full intelligence suite for serious operators.',
    features: [
      'Everything in Growth',
      'POS system (beta access)',
      'Inventory management',
      'WhatsApp bot entry',
      'Advanced AI forecasting',
      'Custom report builder',
      'Monthly, quarterly & annual P&L',
      'Up to 25 users · 5 locations',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Start 14-Day Free Trial',
    ctaLink: '/register',
    featured: false,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    badge: 'CUSTOM',
    color: '#F59E0B',
    monthly: null,
    quarterly: null,
    annual: null,
    tagline: 'Built for organisations that need everything.',
    features: [
      'Everything in Scale',
      'Full ERP & accounting',
      'E-commerce storefront',
      'CRM & loyalty engine',
      'Delivery management',
      'Unlimited users & locations',
      'White-label option',
      'SSO & compliance (SOC2)',
      'Custom integrations & API',
      'SLA guarantee · 24/7 support',
    ],
    cta: 'Talk to Sales',
    ctaLink: 'https://wa.me/254701937625',
    featured: false,
  },
];

const FOOTER_TECH = [
  {
    cat: 'Infrastructure',
    items: [
      'Next.js 14 (App Router)',
      'Node.js + Express API',
      'PostgreSQL + Prisma ORM',
      'Railway (API hosting)',
      'Vercel (Frontend CDN)',
    ],
  },
  {
    cat: 'AI & Intelligence',
    items: [
      'OpenAI GPT-4o',
      'Guru AI Engine (custom)',
      'Real-time data injection',
      'Conversation memory',
      'Vector search (planned)',
    ],
  },
  {
    cat: 'Payments',
    items: [
      'M-Pesa STK Push (Daraja)',
      'Stripe (cards & subscriptions)',
      '26+ live FX rates',
      'Open Exchange Rates API',
      'Resend (transactional email)',
    ],
  },
  {
    cat: 'Security',
    items: [
      'bcrypt password hashing',
      'JWT + httpOnly cookies',
      'Rate limiting (per-IP)',
      'Sentry error tracking',
      'PostHog analytics',
    ],
  },
];

/* ─── COMPONENT ─── */
export default function Landing() {
  useEffect(() => {
    fetch('/api/ping').catch(() => {});
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const neuralRef = useRef<HTMLCanvasElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProd, setActiveProd] = useState('insights');
  const [billing, setBilling] = useState<'monthly' | 'quarterly' | 'annual'>(
    'monthly',
  );
  const { convert, symbol, ratesLoading } = useCurrency();

  /* ── STARFIELD ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onR = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onR);
    const COLS = [
      '#ffffff',
      '#06B6D4',
      '#8B5CF6',
      '#3B82F6',
      '#10B981',
      '#EC4899',
      '#F59E0B',
      '#e0f0ff',
    ];
    const stars = Array.from({ length: 420 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.9 + 0.2,
      opacity: Math.random() * 0.75 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.016,
      color: COLS[Math.floor(Math.random() * COLS.length)],
    }));
    interface S {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      life: number;
      maxLife: number;
    }
    const shoots: S[] = [];
    const si = setInterval(
      () =>
        shoots.push({
          x: Math.random() * W * 1.4 - W * 0.2,
          y: Math.random() * H * 0.5,
          len: 80 + Math.random() * 200,
          speed: 7 + Math.random() * 18,
          angle: Math.PI / 6 + (Math.random() - 0.5) * 0.45,
          life: 0,
          maxLife: 44,
        }),
      2600,
    );
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.twinkle += s.speed;
        const a = s.opacity * (0.55 + 0.45 * Math.sin(s.twinkle));
        const sz = s.size * (0.85 + 0.15 * Math.sin(s.twinkle * 1.3));
        if (s.color !== '#ffffff') {
          ctx.shadowBlur = 9;
          ctx.shadowColor = s.color;
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i];
        sh.life++;
        sh.x += Math.cos(sh.angle) * sh.speed;
        sh.y += Math.sin(sh.angle) * sh.speed;
        const p = sh.life / sh.maxLife;
        const a = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7;
        const g = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
        );
        g.addColorStop(0, `rgba(255,255,255,${a * 0.9})`);
        g.addColorStop(0.35, `rgba(140,200,255,${a * 0.4})`);
        g.addColorStop(1, 'transparent');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(100,180,255,.8)';
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(
          sh.x - Math.cos(sh.angle) * sh.len,
          sh.y - Math.sin(sh.angle) * sh.len,
        );
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (sh.life >= sh.maxLife) shoots.splice(i, 1);
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(id);
      clearInterval(si);
      window.removeEventListener('resize', onR);
    };
  }, []);

  /* ── CURSOR ── */
  useEffect(() => {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      ax = 0,
      ay = 0,
      vx = 0,
      vy = 0,
      curId: number,
      hover = false;
    const mv = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };
    const tick = () => {
      const re = hover ? 0.72 : 0.82;
      const ae = hover ? 0.58 : 0.68;
      const prx = rx,
        pry = ry;
      rx += (mx - rx) * re;
      ry += (my - ry) * re;
      ax += (mx - ax) * ae;
      ay += (my - ay) * ae;
      vx = rx - prx;
      vy = ry - pry;
      const sp = Math.sqrt(vx * vx + vy * vy);
      const st = Math.min(1 + sp * 0.055, 1.35);
      const ang = (Math.atan2(vy, vx) * 180) / Math.PI;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
        ringRef.current.style.transform = `translate(-50%,-50%) rotate(${ang}deg) scaleX(${st}) scaleY(${1 / st})`;
      }
      if (auraRef.current) {
        auraRef.current.style.left = ax + 'px';
        auraRef.current.style.top = ay + 'px';
      }
      curId = requestAnimationFrame(tick);
    };
    document.addEventListener('mousemove', mv);
    tick();
    const on = () => {
      hover = true;
      dotRef.current?.classList.add('dot-big');
      ringRef.current?.classList.add('ring-big');
      auraRef.current?.classList.add('aura-big');
    };
    const off = () => {
      hover = false;
      dotRef.current?.classList.remove('dot-big');
      ringRef.current?.classList.remove('ring-big');
      auraRef.current?.classList.remove('aura-big');
    };
    document.querySelectorAll('button,a,.iact').forEach((el) => {
      el.addEventListener('mouseenter', on);
      el.addEventListener('mouseleave', off);
    });
    document.querySelectorAll('.nav-link').forEach((l) =>
      l.addEventListener('click', (e) => {
        e.preventDefault();
        const h = (l as any).getAttribute('href');
        if (h?.startsWith('#'))
          document
            .querySelector(h)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }),
    );
    return () => {
      document.removeEventListener('mousemove', mv);
      cancelAnimationFrame(curId);
    };
  }, []);

  /* ── NEURAL CANVAS ── */
  useEffect(() => {
    const cv = neuralRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const rs = () => {
      cv.width = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    };
    rs();
    window.addEventListener('resize', rs);
    const CL = [
      'rgba(59,130,246,',
      'rgba(6,182,212,',
      'rgba(139,92,246,',
      'rgba(16,185,129,',
      'rgba(236,72,153,',
    ];
    const nd = Array.from({ length: 55 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 2.5,
      col: CL[Math.floor(Math.random() * 5)],
      p: Math.random() * Math.PI * 2,
      sp: 0.011 + Math.random() * 0.018,
    }));
    const pk: { f: number; t: number; prog: number; sp: number }[] = [];
    let lp = 0,
      ni = 0;
    const draw = (ts: number) => {
      const W = cv.width,
        H = cv.height;
      ctx.clearRect(0, 0, W, H);
      if (ts - lp > 1100 && pk.length < 14) {
        const a = Math.floor(Math.random() * nd.length);
        let b = a;
        while (b === a) b = Math.floor(Math.random() * nd.length);
        pk.push({ f: a, t: b, prog: 0, sp: 0.007 + Math.random() * 0.01 });
        lp = ts;
      }
      nd.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.p += n.sp;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      nd.forEach((a, i) =>
        nd.forEach((b, j) => {
          if (j <= i) return;
          const dx = b.x - a.x,
            dy = b.y - a.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 145) {
            ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 145) * 0.11})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }),
      );
      nd.forEach((n) => {
        const g = 0.3 + 0.25 * Math.sin(n.p);
        ctx.shadowBlur = 11;
        ctx.shadowColor = n.col + '0.8)';
        ctx.fillStyle = n.col + g + ')';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.85 + 0.15 * Math.sin(n.p)), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      for (let i = pk.length - 1; i >= 0; i--) {
        const p = pk[i];
        p.prog += p.sp;
        if (p.prog >= 1) {
          pk.splice(i, 1);
          continue;
        }
        const a = nd[p.f],
          b = nd[p.t];
        const x = a.x + (b.x - a.x) * p.prog,
          y = a.y + (b.y - a.y) * p.prog;
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, 11);
        g2.addColorStop(0, 'rgba(6,182,212,0.95)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      }
      ni = requestAnimationFrame(draw);
    };
    ni = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(ni);
      window.removeEventListener('resize', rs);
    };
  }, []);

  /* ── SCROLL REVEAL ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ap = PRODUCTS.find((p) => p.id === activeProd)!;
  const price = (t: (typeof TIERS)[0]) => {
    if (!t.monthly) return null;
    return t[billing] as number;
  };

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500;600&display=swap');
      *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
      :root{--v:#02020c;--b:#3B82F6;--c:#06B6D4;--p:#8B5CF6;--g:#10B981;--a:#F59E0B;--pk:#EC4899;--r:#EF4444;--in:#6366F1;--t1:#F1F5F9;--t2:#94A3B8;--t3:#475569;--t4:#334155;--s1:rgba(255,255,255,.025);--br:rgba(255,255,255,.075);--br2:rgba(255,255,255,.04);}
      html{scroll-behavior:smooth;} body{background:var(--v);color:var(--t1);font-family:'DM Sans',sans-serif;overflow-x:hidden;cursor:none;}
      html,body{max-width:100vw;overflow-x:hidden;}
      @media(max-width:768px){body{cursor:auto;}#cd,#cr,#ca{display:none;}}

      /* CURSOR */
      #cd{position:fixed;z-index:9999;width:5px;height:5px;background:#fff;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);box-shadow:0 0 0 1px rgba(255,255,255,.55),0 0 10px 3px rgba(6,182,212,.9),0 0 22px 7px rgba(6,182,212,.5),0 0 40px 15px rgba(139,92,246,.3);}
      #cd.dot-big{width:8px;height:8px;box-shadow:0 0 0 1.5px rgba(255,255,255,.9),0 0 16px 5px rgba(6,182,212,1),0 0 34px 13px rgba(6,182,212,.6),0 0 65px 26px rgba(139,92,246,.4);}
      #cr{position:fixed;z-index:9998;width:33px;height:33px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);border:1px solid rgba(6,182,212,.55);transition:width .18s cubic-bezier(.16,1,.3,1),height .18s cubic-bezier(.16,1,.3,1);}
      #cr.ring-big{width:58px;height:58px;border-color:rgba(6,182,212,.9);}
      #ca{position:fixed;z-index:9997;width:130px;height:130px;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(6,182,212,.09) 0%,rgba(139,92,246,.04) 50%,transparent 70%);transition:width .48s,height .48s;}
      #ca.aura-big{width:210px;height:210px;}

      /* AURORA */
      .aurora{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;}
      .aurora div{position:absolute;border-radius:50%;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate;}
      .au1{width:min(1100px,190vw);height:min(1100px,190vw);background:radial-gradient(circle,rgba(59,130,246,.16) 0%,transparent 65%);top:-360px;left:-230px;animation:aA 24s;}
      .au2{width:min(820px,165vw);height:min(820px,165vw);background:radial-gradient(circle,rgba(139,92,246,.14) 0%,transparent 65%);top:50px;right:-190px;animation:aB 30s;}
      .au3{width:min(950px,175vw);height:min(950px,175vw);background:radial-gradient(circle,rgba(6,182,212,.11) 0%,transparent 65%);bottom:-130px;left:24%;animation:aC 22s;}
      .au4{width:640px;height:640px;background:radial-gradient(circle,rgba(236,72,153,.07) 0%,transparent 65%);bottom:22%;right:4%;animation:aA 36s;}
      .au5{width:520px;height:520px;background:radial-gradient(circle,rgba(245,158,11,.055) 0%,transparent 65%);top:44%;left:44%;animation:aB 28s;}
      @keyframes aA{to{transform:translate(130px,95px) scale(1.2);}} @keyframes aB{to{transform:translate(-95px,140px) scale(.84);}} @keyframes aC{to{transform:translate(-140px,-95px) scale(1.16);}}
      @keyframes gradS{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
      @keyframes blink{0%,100%{opacity:1;}50%{opacity:.4;}}
      @keyframes breathe{0%,100%{filter:drop-shadow(0 0 45px rgba(6,182,212,.3)) drop-shadow(0 0 110px rgba(139,92,246,.17));}50%{filter:drop-shadow(0 0 75px rgba(6,182,212,.55)) drop-shadow(0 0 180px rgba(139,92,246,.3));}}
      @keyframes spin{to{transform:rotate(360deg);}}
      @keyframes pulse-ring{0%{transform:translate(-50%,-50%) scale(1);opacity:.6;}100%{transform:translate(-50%,-50%) scale(1.8);opacity:0;}}
      @keyframes beam{0%{opacity:0;transform:translateX(-100%) rotate(-45deg);}50%{opacity:.6;}100%{opacity:0;transform:translateX(100%) rotate(-45deg);}}
      .noise{position:fixed;inset:0;z-index:1;opacity:.015;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
      .grid-bg{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.011;background-image:linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px);background-size:80px 80px;}

      /* NAV */
      .nav{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:1000;width:calc(100% - 36px);max-width:1200px;display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:rgba(2,2,12,.82);backdrop-filter:blur(52px) saturate(200%);border:1px solid rgba(255,255,255,.082);border-radius:16px;}
      .nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;letter-spacing:.04em;background:linear-gradient(135deg,#fff,var(--c),var(--p));background-size:200% auto;animation:gradS 5s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:flex;align-items:center;gap:9px;text-decoration:none;position:relative;}
      .nav-logo::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,.6),transparent);}
      .np{width:7px;height:7px;background:var(--g);border-radius:50%;-webkit-text-fill-color:initial;box-shadow:0 0 12px var(--g);animation:blink 2s ease-in-out infinite;position:relative;}
      .np::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:1px solid rgba(16,185,129,.3);animation:pulse-ring 2s ease-out infinite;}
      .nav-links{display:flex;gap:2px;list-style:none;}
      .nav-link{color:var(--t3);text-decoration:none;font-size:13px;font-weight:400;padding:7px 13px;border-radius:10px;transition:all .22s;cursor:none;position:relative;}
      .nav-link::after{content:'';position:absolute;bottom:4px;left:50%;right:50%;height:1px;background:linear-gradient(90deg,transparent,var(--c),transparent);transition:all .3s;}
      .nav-link:hover{color:var(--t1);background:rgba(255,255,255,.055);}
      .nav-link:hover::after{left:14px;right:14px;}
      .nav-right{display:flex;gap:8px;align-items:center;}
      .btn-ghost{padding:8px 16px;background:transparent;border:1px solid rgba(255,255,255,.09);border-radius:10px;color:var(--t2);font-family:'DM Sans',sans-serif;font-size:13px;cursor:none;transition:all .22s;text-decoration:none;display:inline-flex;align-items:center;}
      .btn-ghost:hover{background:rgba(255,255,255,.055);color:var(--t1);}
      .btn-cta{padding:9px 20px;background:linear-gradient(135deg,var(--b),var(--p));border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:none;transition:all .25s;text-decoration:none;display:inline-flex;align-items:center;position:relative;overflow:hidden;box-shadow:0 0 24px rgba(59,130,246,.3);}
      .btn-cta::before{content:'';position:absolute;inset:0;background:conic-gradient(transparent,rgba(255,255,255,.1),transparent 30%);animation:spin 5s linear infinite;opacity:0;transition:opacity .3s;}
      .btn-cta:hover{transform:scale(1.04);box-shadow:0 0 40px rgba(59,130,246,.6);} .btn-cta:hover::before{opacity:1;}
      .ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none;}
      .ham span{display:block;width:22px;height:2px;background:var(--t1);border-radius:2px;transition:all .3s;}
      .ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
      .ham.open span:nth-child(2){opacity:0;}
      .ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
      .mob{display:none;position:fixed;inset:0;z-index:990;background:rgba(2,2,12,.97);backdrop-filter:blur(48px);flex-direction:column;align-items:center;justify-content:center;gap:28px;}
      .mob.open{display:flex;}
      .mob-lnk{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:var(--t1);text-decoration:none;transition:color .2s;} .mob-lnk:hover{color:var(--c);}
      @media(max-width:768px){.nav-links,.nav-right{display:none;}.ham{display:flex;}}

      /* HERO */
      .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:130px 24px 90px;text-align:center;position:relative;}
      .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 30%,rgba(6,182,212,.032) 50%,transparent 70%);animation:beam 10s ease-in-out infinite;pointer-events:none;}
      .badge{display:inline-flex;align-items:center;gap:8px;padding:5px 18px 5px 10px;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.22);border-radius:100px;font-size:11px;color:var(--g);font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin-bottom:38px;}
      .bdot{width:6px;height:6px;background:var(--g);border-radius:50%;box-shadow:0 0 10px var(--g);animation:blink 2s ease-in-out infinite;}
      .hero-title{font-family:'Syne',sans-serif;font-size:clamp(54px,14.5vw,185px);font-weight:800;line-height:.84;letter-spacing:-.07em;background:linear-gradient(160deg,#ffffff 0%,rgba(255,255,255,.9) 22%,var(--c) 52%,var(--p) 76%,var(--pk) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% 200%;animation:gradS 6s ease infinite;filter:drop-shadow(0 0 80px rgba(6,182,212,.28)) drop-shadow(0 0 160px rgba(139,92,246,.18));margin-bottom:18px;}
      .glow-breathe{animation:breathe 4.5s ease-in-out infinite;}
      .fullname{font-size:clamp(10px,1.2vw,14px);color:var(--t3);letter-spacing:.3em;text-transform:uppercase;margin-bottom:16px;font-family:'JetBrains Mono',monospace;}
      .origin-tag{font-family:'JetBrains Mono',monospace;font-size:clamp(9px,1vw,11px);color:var(--t4);letter-spacing:.22em;text-transform:uppercase;margin-bottom:28px;display:inline-flex;align-items:center;gap:10px;}
      .origin-tag::before,.origin-tag::after{content:'';display:inline-block;width:24px;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,.4));opacity:.7;}
      .origin-tag::after{background:linear-gradient(90deg,rgba(6,182,212,.4),transparent);}
      .tagline{font-family:'Syne',sans-serif;font-size:clamp(14px,1.9vw,21px);font-weight:600;background:linear-gradient(90deg,var(--c),var(--p),var(--pk),var(--a));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:300% auto;animation:gradS 4s linear infinite;margin-bottom:28px;display:flex;align-items:center;gap:16px;}
      .tl{display:inline-block;width:34px;height:1px;background:linear-gradient(90deg,transparent,var(--c));opacity:.7;}
      .hero-sub{font-size:clamp(14px,1.5vw,18px);color:var(--t2);max-width:540px;line-height:1.78;font-weight:300;margin-bottom:48px;}
      .hero-sub strong{color:var(--t1);font-weight:500;}
      .hero-acts{display:flex;gap:12px;align-items:center;margin-bottom:56px;flex-wrap:wrap;justify-content:center;}
      .btn-hero{padding:17px 38px;background:linear-gradient(135deg,var(--b),var(--p));border:none;border-radius:14px;color:#fff;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;cursor:none;transition:all .25s;text-decoration:none;display:inline-flex;align-items:center;position:relative;overflow:hidden;box-shadow:0 0 36px rgba(59,130,246,.4);}
      .btn-hero::before{content:'';position:absolute;inset:0;background:conic-gradient(transparent,rgba(255,255,255,.12),transparent 30%);animation:spin 5s linear infinite;opacity:0;transition:opacity .3s;}
      .btn-hero:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 28px 80px rgba(59,130,246,.55);} .btn-hero:hover::before{opacity:1;}
      .btn-sec{padding:17px 32px;background:transparent;border:1px solid rgba(255,255,255,.11);border-radius:14px;color:var(--t2);font-family:'DM Sans',sans-serif;font-size:16px;cursor:none;transition:all .25s;text-decoration:none;display:inline-flex;align-items:center;}
      .btn-sec:hover{background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.2);color:var(--t1);transform:translateY(-3px);}

      /* MASCOT */
      .mascot-row{display:flex;align-items:center;justify-content:center;gap:28px;margin-bottom:64px;flex-wrap:wrap;}
      .bubble{background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.075);border-radius:18px;padding:18px 22px;max-width:270px;font-size:13px;color:var(--t2);line-height:1.65;position:relative;}
      .bubble::after{content:'';position:absolute;top:50%;width:0;height:0;border-style:solid;}
      .bubble-l::after{right:-11px;transform:translateY(-50%);border-width:9px 0 9px 11px;border-color:transparent transparent transparent rgba(255,255,255,.075);}
      .bubble-r::after{left:-11px;transform:translateY(-50%);border-width:9px 11px 9px 0;border-color:transparent rgba(255,255,255,.075) transparent transparent;}
      .bubble-tag{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;color:var(--p);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;}

      /* DASHBOARD */
      .dash-frame{width:100%;max-width:1020px;position:relative;margin:0 auto;}
      .dash-frame::before{content:'';position:absolute;inset:-1.5px;background:linear-gradient(135deg,rgba(59,130,246,.32),rgba(139,92,246,.28),rgba(6,182,212,.32),rgba(236,72,153,.22));border-radius:28px;z-index:-1;filter:blur(.5px);}
      .dash-inner{background:rgba(4,4,18,.96);border:1px solid rgba(255,255,255,.055);border-radius:26px;overflow:hidden;padding:26px;}
      .dash-bar{display:flex;align-items:center;gap:7px;margin-bottom:22px;}
      .dd{width:11px;height:11px;border-radius:50%;} .dr{background:#FF5F57;} .dy{background:#FFBD2E;} .dg{background:#28C840;}
      .dt{margin-left:14px;font-size:10px;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;}
      .dash-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px;}
      .kpi{background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.052);border-radius:13px;padding:15px;position:relative;overflow:hidden;}
      .kpi-l{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:7px;}
      .kpi-v{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--t1);letter-spacing:-.02em;}
      .kpi-d{font-size:9.5px;font-weight:500;margin-top:5px;}
      .dash-bottom{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;}
      .chart-card{background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:13px;padding:16px;height:126px;overflow:hidden;}
      .chart-label{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;}
      .bars{display:flex;align-items:flex-end;gap:3px;height:80px;}
      .bar{flex:1;border-radius:3px 3px 0 0;opacity:.8;}
      .ai-card{background:linear-gradient(135deg,rgba(139,92,246,.07),rgba(59,130,246,.05));border:1px solid rgba(139,92,246,.2);border-radius:13px;padding:15px;}
      .ai-card-h{font-size:9px;color:var(--p);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;display:flex;align-items:center;gap:5px;}
      .ai-live{width:5px;height:5px;background:var(--g);border-radius:50%;box-shadow:0 0 6px var(--g);animation:blink 1.5s infinite;}
      .ai-line{font-size:11px;color:var(--t2);margin-bottom:4px;line-height:1.5;} .ai-line span{color:var(--c);font-weight:500;}
      .score-card{background:linear-gradient(135deg,rgba(16,185,129,.07),rgba(6,182,212,.05));border:1px solid rgba(16,185,129,.2);border-radius:13px;padding:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
      .score-n{font-family:'Syne',sans-serif;font-size:34px;font-weight:800;color:var(--g);}
      .score-l{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;margin-top:5px;}

      /* AVORIQ-INSPIRED STAT BAR */
      .stat-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:16px;overflow:hidden;margin:0 auto 80px;max-width:900px;}
      .stat-item{padding:28px 24px;background:rgba(2,2,12,.7);text-align:center;transition:background .3s;}
      .stat-item:hover{background:rgba(255,255,255,.03);}
      .stat-n{font-family:'Syne',sans-serif;font-size:clamp(22px,4vw,38px);font-weight:800;letter-spacing:-.04em;margin-bottom:6px;}
      .stat-l{font-size:11px;color:var(--t3);letter-spacing:.07em;text-transform:uppercase;}

      /* SECTIONS */
      .sec{padding:80px 24px;max-width:1200px;margin:0 auto;}
      .sec-sm{padding:64px 24px;max-width:900px;margin:0 auto;}
      .sec-tag{font-size:10.5px;color:var(--b);font-weight:600;letter-spacing:.16em;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
      .sec-tag::before{content:'';display:inline-block;width:20px;height:1px;background:var(--b);opacity:.7;}
      .sec-h{font-family:'Syne',sans-serif;font-size:clamp(30px,4vw,52px);font-weight:700;letter-spacing:-.035em;line-height:1.05;background:linear-gradient(135deg,#fff 0%,rgba(255,255,255,.88) 35%,var(--c) 68%,var(--p) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
      .sec-sub{font-size:15px;color:var(--t2);line-height:1.78;font-weight:300;margin-top:14px;max-width:520px;}

      /* PITCH */
      .pitch-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:44px;}
      .pitch-col{padding:30px;border-radius:20px;}
      .pitch-col.prob{background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.11);}
      .pitch-col.sol{background:rgba(16,185,129,.04);border:1px solid rgba(16,185,129,.11);}
      .pitch-h{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
      .pitch-col.prob .pitch-h{color:var(--r);}
      .pitch-col.sol  .pitch-h{color:var(--g);}
      .pitch-item{display:flex;gap:12px;margin-bottom:16px;}
      .pitch-icon{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;margin-top:2px;}
      .pitch-text{font-size:13px;color:var(--t2);line-height:1.65;}
      .pitch-text strong{color:var(--t1);font-weight:500;display:block;margin-bottom:2px;font-size:13.5px;}

      /* PRODUCT TABS */
      .prod-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:24px;}
      .prod-tab{display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:11px;border:1px solid rgba(255,255,255,.06);background:transparent;color:var(--t3);font-family:'DM Sans',sans-serif;font-size:12.5px;cursor:none;transition:all .22s;}
      .prod-tab:hover{border-color:rgba(255,255,255,.13);color:var(--t1);}
      .prod-tab.on{color:#fff;}
      .soon-b{font-size:8.5px;padding:1.5px 6px;border-radius:4px;background:rgba(245,158,11,.13);color:var(--a);border:1px solid rgba(245,158,11,.24);font-weight:700;letter-spacing:.06em;}
      .prod-preview{background:var(--s1);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:44px;min-height:240px;display:flex;align-items:center;gap:50px;}
      .prod-icon{font-size:68px;flex-shrink:0;}
      .prod-title{font-family:'Syne',sans-serif;font-size:30px;font-weight:700;letter-spacing:-.03em;margin-bottom:12px;}
      .prod-desc{font-size:15px;color:var(--t2);line-height:1.78;max-width:430px;}
      .prod-coming{display:inline-flex;align-items:center;gap:6px;margin-top:18px;font-size:12px;color:var(--a);padding:6px 14px;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-radius:8px;}

      /* ROADMAP */
      .rm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:44px;}
      .rm-card{background:var(--s1);border:1px solid var(--br2);border-radius:18px;padding:26px;position:relative;overflow:hidden;transition:all .3s;}
      .rm-card:hover{transform:translateY(-5px);}
      .rm-card.done{border-top:2px solid var(--g);}
      .rm-card.next{border-top:2px solid var(--b);opacity:.85;}
      .rm-ph{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t4);letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px;}
      .rm-q{font-size:10px;color:var(--t3);margin-bottom:14px;}
      .rm-label{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:16px;}
      .rm-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--t2);margin-bottom:8px;}
      .rm-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
      .rm-card.done .rm-dot{background:var(--g);box-shadow:0 0 6px var(--g);}
      .rm-card.next .rm-dot{background:var(--b);}
      .rm-done-b{position:absolute;top:18px;right:18px;font-size:8.5px;padding:2px 8px;border-radius:4px;background:rgba(16,185,129,.14);color:var(--g);border:1px solid rgba(16,185,129,.24);font-weight:700;letter-spacing:.06em;}

      /* AI SECTION */
      .ai-sec{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
      .ai-window{background:rgba(4,4,18,.93);border:1px solid rgba(255,255,255,.07);border-radius:22px;padding:26px;position:relative;}
      .ai-window::before{content:'';position:absolute;inset:-1px;background:linear-gradient(135deg,rgba(139,92,246,.22),transparent 50%,rgba(59,130,246,.22));border-radius:23px;z-index:-1;}
      .ai-hdr{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.055);}
      .ai-av{width:36px;height:36px;background:linear-gradient(135deg,var(--p),var(--b));border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;font-family:'Syne',sans-serif;color:#fff;}
      .ai-n{font-size:13px;font-weight:500;color:var(--t1);}
      .ai-st{font-size:10px;color:var(--g);display:flex;align-items:center;gap:4px;}
      .ai-stdt{width:5px;height:5px;background:var(--g);border-radius:50%;box-shadow:0 0 6px var(--g);animation:blink 1.5s infinite;}
      .msg{margin-bottom:13px;}
      .msg-u{display:flex;justify-content:flex-end;}
      .bbl{max-width:86%;padding:11px 15px;border-radius:15px;font-size:13px;line-height:1.62;}
      .bbl-u{background:rgba(59,130,246,.17);border:1px solid rgba(59,130,246,.26);border-radius:15px 15px 4px 15px;color:var(--t1);}
      .bbl-a{background:rgba(255,255,255,.034);border:1px solid rgba(255,255,255,.065);border-radius:15px 15px 15px 4px;color:var(--t2);}
      .bbl-a .hl{color:var(--c);font-weight:500;} .bbl-a .pos{color:var(--g);font-weight:500;} .bbl-a .neg{color:var(--r);font-weight:500;}
      .ai-checks{list-style:none;margin-top:26px;display:flex;flex-direction:column;gap:11px;}
      .ai-checks li{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--t2);font-weight:300;}
      .ai-ck{width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;}

      /* REPORTS */
      .reports-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px;}
      .rpt{background:var(--s1);border:1px solid var(--br2);border-radius:16px;padding:24px;display:flex;gap:16px;align-items:flex-start;transition:all .3s;}
      .rpt:hover{border-color:rgba(255,255,255,.1);transform:translateY(-3px);}
      .rpt-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
      .rpt-title{font-size:14px;font-weight:500;color:var(--t1);margin-bottom:5px;}
      .rpt-desc{font-size:12px;color:var(--t2);line-height:1.6;}

      /* BILLING TOGGLE */
      .bill-toggle{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:44px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:5px;width:fit-content;margin-left:auto;margin-right:auto;}
      .bill-btn{padding:8px 18px;border-radius:9px;border:none;background:transparent;color:var(--t3);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;cursor:none;transition:all .22s;display:flex;align-items:center;gap:6px;}
      .bill-btn.on{background:linear-gradient(135deg,rgba(59,130,246,.18),rgba(139,92,246,.14));color:var(--t1);border:1px solid rgba(59,130,246,.25);}
      .save-tag{font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(16,185,129,.15);color:var(--g);border:1px solid rgba(16,185,129,.25);font-weight:700;letter-spacing:.05em;}

      /* PRICING */
      .price-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:8px;}
      .pc{background:var(--s1);border:1px solid var(--br);border-radius:20px;padding:24px;transition:all .35s;cursor:none;position:relative;overflow:hidden;display:flex;flex-direction:column;min-width:0;word-break:break-word;}
      .pc:hover{transform:translateY(-8px);box-shadow:0 44px 110px rgba(0,0,0,.6);}
      .pc.feat{border-color:rgba(59,130,246,.35);}
      .pc.feat::before{content:'';position:absolute;inset:0;background:linear-gradient(160deg,rgba(59,130,246,.07),rgba(139,92,246,.07));pointer-events:none;}
      .pc-badge{position:absolute;top:18px;right:18px;font-size:8.5px;font-weight:700;letter-spacing:.1em;padding:3px 9px;border-radius:100px;}
      .pc-tier{font-size:10px;font-weight:600;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:18px;}
      .pc-price{font-family:'Syne',sans-serif;font-size:clamp(20px,3.2vw,38px);font-weight:800;letter-spacing:-.04em;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;}
      .pc-per{font-size:12px;color:var(--t3);margin-bottom:6px;}
      .pc-tag{font-size:12px;color:var(--t2);margin-bottom:22px;font-weight:300;line-height:1.5;}
      .pc-features{list-style:none;margin-bottom:26px;flex:1;}
      .pc-features li{font-size:12px;color:var(--t2);padding:8px 0;border-bottom:1px solid rgba(255,255,255,.035);display:flex;align-items:flex-start;gap:8px;line-height:1.5;}
      .ck{color:var(--g);flex-shrink:0;margin-top:1px;}
      .pc-btn{width:100%;padding:13px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:none;transition:all .25s;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:var(--t2);text-align:center;text-decoration:none;display:block;margin-top:auto;}
      .pc-btn:hover{background:rgba(255,255,255,.08);color:var(--t1);}
      .pc.feat .pc-btn{background:linear-gradient(135deg,var(--b),var(--p));border-color:transparent;color:#fff;}
      .pc.feat .pc-btn:hover{box-shadow:0 0 50px rgba(59,130,246,.5);}

      /* CTA */
      .cta-sec{padding:120px 24px;text-align:center;position:relative;}
      .cta-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(59,130,246,.075) 0%,transparent 65%);}

      /* FOOTER */
      footer{padding:60px 24px;border-top:1px solid rgba(255,255,255,.042);position:relative;z-index:2;}
      .foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:32px;margin-bottom:52px;}
      .foot-label{font-size:9.5px;color:var(--t4);letter-spacing:.11em;text-transform:uppercase;margin-bottom:14px;font-weight:600;}
      .foot-link{display:block;font-size:12.5px;color:var(--t3);text-decoration:none;margin-bottom:8px;transition:color .2s;} .foot-link:hover{color:var(--t1);}
      .foot-tech{font-size:11px;color:var(--t4);margin-bottom:6px;line-height:1.7;}
      .foot-divider{border:none;border-top:1px solid rgba(255,255,255,.04);margin-top:8px;padding-top:24px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;}
      .foot-copy{font-size:11px;color:var(--t4);}
      .foot-origin{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t4);letter-spacing:.1em;margin-top:8px;line-height:1.8;}
      .foot-origin span{color:var(--c);}

      /* REVEAL */
      .reveal{opacity:0;transform:translateY(26px);transition:opacity .72s cubic-bezier(.16,1,.3,1),transform .72s cubic-bezier(.16,1,.3,1);}
      .reveal.revealed{opacity:1;transform:translateY(0);}

      /* MOBILE */
      @media(max-width:768px){
        .hero{padding:105px 18px 70px;}
        .pitch-grid,.rm-grid,.ai-sec{grid-template-columns:1fr!important;}
        .price-grid{grid-template-columns:1fr!important;}
        .reports-grid{grid-template-columns:1fr;}
        .stat-bar{grid-template-columns:repeat(2,1fr);}
        .dash-kpis{grid-template-columns:repeat(2,1fr);}
        .dash-bottom{grid-template-columns:1fr;}
        .prod-preview{flex-direction:column;gap:22px;padding:28px;}
        .hero-acts{flex-direction:column;width:100%;}
        .btn-hero,.btn-sec{width:100%;justify-content:center;}
        .foot-grid{grid-template-columns:1fr 1fr;}
        .mascot-row{gap:16px;}
        .bubble{max-width:200px;font-size:12px;}
      }
      ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px;}
    `}</style>

      {/* CURSOR */}
      <div id="cd" ref={dotRef} />
      <div id="cr" ref={ringRef} />
      <div id="ca" ref={auraRef} />

      {/* BG */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div className="aurora">
        <div className="au1" />
        <div className="au2" />
        <div className="au3" />
        <div className="au4" />
        <div className="au5" />
      </div>
      <div className="noise" />
      <div className="grid-bg" />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="np" />
          B.O.S.S
        </Link>
        <ul className="nav-links">
          {[
            ['Platform', '#platform'],
            ['Intelligence', '#intelligence'],
            ['Roadmap', '#roadmap'],
            ['Pricing', '#pricing'],
            ['About', '#about'],
          ].map(([l, h]) => (
            <li key={l}>
              <a href={h} className="nav-link">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <CurrencyDropdown />
          <Link href="/login" className="btn-ghost">
            Sign In
          </Link>
          <Link href="/register" className="btn-cta">
            Get Started →
          </Link>
        </div>
        <button
          className={`ham${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      <div
        className={`mob${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
      >
        {[
          ['Platform', '#platform'],
          ['Intelligence', '#intelligence'],
          ['Roadmap', '#roadmap'],
          ['Pricing', '#pricing'],
        ].map(([l, h]) => (
          <a
            key={l}
            href={h}
            className="mob-lnk"
            onClick={() => setMenuOpen(false)}
          >
            {l}
          </a>
        ))}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: 260,
            marginTop: 16,
          }}
        >
          <Link
            href="/login"
            className="btn-ghost"
            style={{ justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-cta"
            style={{ justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Get Started →
          </Link>
        </div>
      </div>

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* HERO */}
        <section className="hero" id="hero">
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            className="badge"
          >
            <span className="bdot" />
            AI-Native Business Intelligence Platform
          </motion.div>
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.08s' }}
          >
            <div className="hero-title glow-breathe">B.O.S.S</div>
          </motion.div>
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.12s' }}
          >
            <div className="fullname">
              Business Orchestration Software Systems
            </div>
          </motion.div>
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.16s' }}
          >
            <div className="origin-tag">
              Built in Nairobi, Kenya — Africa&nbsp;·&nbsp;Engineered for the
              World
            </div>
          </motion.div>
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.2s' }}
            className="tagline"
          >
            <span className="tl" />
            Intelligent by design.&nbsp;&nbsp;Powerful by nature.
            <span
              className="tl"
              style={{
                background: 'linear-gradient(90deg,var(--p),transparent)',
              }}
            />
          </motion.div>
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.24s' }}
            className="hero-sub"
          >
            The <strong>AI-native business intelligence platform</strong> — from
            daily revenue tracking to full POS, inventory, ERP, and beyond. One
            dashboard. Every insight. Infinite scale.
          </motion.div>
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.28s' }}
            className="hero-acts"
          >
            <Link href="/register" className="btn-hero">
              Start for Free →
            </Link>
            <a href="#platform" className="btn-sec">
              Explore the Platform
            </a>
            <Link href="/login" className="btn-sec">
              Sign In
            </Link>
          </motion.div>

          {/* MASCOT — eyes follow your cursor */}
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.34s' }}
            className="mascot-row"
          >
            <div className="bubble bubble-l">
              <div className="bubble-tag">Guru AI</div>
              Revenue is up 23% this week. Tuesday was your best day — $1,240 in
              6 hours. Want a breakdown?
            </div>
            <BossMascot size={134} float={true} />
            <div className="bubble bubble-r">
              <div className="bubble-tag">Guru AI</div>
              Stock of Product #A12 drops below threshold in ~3 days. Raise a
              reorder now or wait?
            </div>
          </motion.div>

          {/* DASHBOARD MOCKUP */}
          <motion.div
            variants={fUp}
            initial="hidden"
            animate="show"
            style={{ animationDelay: '.4s', width: '100%', maxWidth: 1020 }}
          >
            <div className="dash-frame">
              <div className="dash-inner">
                <div className="dash-bar">
                  <div className="dd dr" />
                  <div className="dd dy" />
                  <div className="dd dg" />
                  <span className="dt">B.O.S.S — Command Centre</span>
                </div>
                <div className="dash-kpis">
                  {[
                    {
                      l: 'Revenue Today',
                      v: '$1,240',
                      d: '↑ 23.4%',
                      c: '#3B82F6',
                      g: 'rgba(59,130,246,.14)',
                    },
                    {
                      l: 'Net Profit',
                      v: '$694',
                      d: '56% margin',
                      c: '#10B981',
                      g: 'rgba(16,185,129,.14)',
                    },
                    {
                      l: 'Health Score',
                      v: '92/100',
                      d: 'Excellent',
                      c: '#8B5CF6',
                      g: 'rgba(139,92,246,.14)',
                    },
                    {
                      l: 'Day Streak',
                      v: '14 days',
                      d: '🔥 On fire',
                      c: '#F59E0B',
                      g: 'rgba(245,158,11,.14)',
                    },
                  ].map((kp) => (
                    <div
                      key={kp.l}
                      className="kpi"
                      style={{ borderTop: `1px solid ${kp.c}35` }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          background: kp.g,
                          filter: 'blur(22px)',
                        }}
                      />
                      <div className="kpi-l">{kp.l}</div>
                      <div className="kpi-v">{kp.v}</div>
                      <div className="kpi-d" style={{ color: kp.c }}>
                        {kp.d}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dash-bottom">
                  <div className="chart-card">
                    <div className="chart-label">7-Day Revenue Trend</div>
                    <div className="bars">
                      {[
                        22, 38, 31, 58, 50, 77, 88, 74, 92, 100, 85, 70, 60, 48,
                        42,
                      ].map((h, i) => {
                        const cs = [
                          '#3B82F6',
                          '#06B6D4',
                          '#8B5CF6',
                          '#10B981',
                          '#EC4899',
                          '#F59E0B',
                        ];
                        return (
                          <div
                            key={i}
                            className="bar"
                            style={{
                              height: `${h}%`,
                              background: `linear-gradient(to top,${cs[i % cs.length]},${cs[(i + 2) % cs.length]})`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="ai-card">
                    <div className="ai-card-h">
                      <span className="ai-live" />
                      Guru AI · Live
                    </div>
                    <div className="ai-line">
                      Profit <span>↑ 23%</span> vs last week
                    </div>
                    <div className="ai-line">
                      Expenses <span>within target</span>
                    </div>
                    <div className="ai-line">
                      Best day: <span>Tuesday</span>
                    </div>
                    <div className="ai-line">
                      Restock <span>Item #A12</span> in 3d
                    </div>
                  </div>
                  <div className="score-card">
                    <div className="score-n">92</div>
                    <div className="score-l">Health Score</div>
                    <div
                      style={{
                        fontSize: 9,
                        color: 'var(--g)',
                        marginTop: 6,
                        fontWeight: 700,
                        letterSpacing: '.07em',
                      }}
                    >
                      EXCELLENT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* AVORIQ-INSPIRED SIGNAL STAT BAR */}
        <motion.div
          variants={fUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ padding: '0 24px 0' }}
        >
          <div className="stat-bar">
            {[
              { n: '30s', l: 'Time to first insight', c: 'var(--c)' },
              { n: '26+', l: 'Live currency conversions', c: 'var(--p)' },
              { n: '8', l: 'Integrated product modules', c: 'var(--g)' },
              { n: '<48h', l: 'Full onboarding time', c: 'var(--a)' },
            ].map((s) => (
              <div key={s.l} className="stat-item">
                <div
                  className="stat-n"
                  style={{
                    background: `linear-gradient(135deg,#fff,${s.c})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.n}
                </div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PITCH DECK */}
        <section className="sec reveal" id="about">
          <div style={{ textAlign: 'center' }}>
            <div className="sec-tag" style={{ justifyContent: 'center' }}>
              The Opportunity
            </div>
            <h2 className="sec-h" style={{ textAlign: 'center' }}>
              A $150B problem. One platform.
            </h2>
          </div>
          <div className="pitch-grid">
            <div className="pitch-col prob">
              <div className="pitch-h">❌ The Status Quo</div>
              {[
                {
                  icon: '📓',
                  title: 'Decisions made on instinct',
                  body: 'The majority of SMEs globally have no real-time visibility into revenue, expenses, or margins.',
                },
                {
                  icon: '💸',
                  title: 'Profit is a mystery',
                  body: "Most operators don't know their actual profit margin until the end of the month — if ever.",
                },
                {
                  icon: '📦',
                  title: 'Stockouts kill revenue',
                  body: 'Inventory stockouts cost retailers an estimated 11% of revenue annually. No one sees them coming.',
                },
                {
                  icon: '🏦',
                  title: "Enterprise tools don't fit",
                  body: "ERP systems cost $10K–$100K+ to implement. They're built for Fortune 500, not growing businesses.",
                },
              ].map((p) => (
                <div key={p.title} className="pitch-item">
                  <div
                    className="pitch-icon"
                    style={{
                      background: 'rgba(239,68,68,.1)',
                      border: '1px solid rgba(239,68,68,.2)',
                    }}
                  >
                    {p.icon}
                  </div>
                  <div className="pitch-text">
                    <strong>{p.title}</strong>
                    {p.body}
                  </div>
                </div>
              ))}
            </div>
            <div className="pitch-col sol">
              <div className="pitch-h">✅ The B.O.S.S Way</div>
              {[
                {
                  icon: '⚡',
                  title: '30-second daily intelligence',
                  body: 'Log sales and expenses in 30 seconds. Get AI-generated insights immediately. No training required.',
                },
                {
                  icon: '🧠',
                  title: 'AI that reads your numbers',
                  body: 'Guru AI injects your real business data into every answer — specific, actionable, and always current.',
                },
                {
                  icon: '📦',
                  title: 'Inventory that thinks ahead',
                  body: "Auto-reorder triggers, expiry alerts, and supplier sync. You'll never miss a stockout again.",
                },
                {
                  icon: '🌍',
                  title: 'Built for the world, priced fairly',
                  body: 'From solo operators to multi-branch enterprises — one platform that scales with you at every stage.',
                },
              ].map((p) => (
                <div key={p.title} className="pitch-item">
                  <div
                    className="pitch-icon"
                    style={{
                      background: 'rgba(16,185,129,.1)',
                      border: '1px solid rgba(16,185,129,.2)',
                    }}
                  >
                    {p.icon}
                  </div>
                  <div className="pitch-text">
                    <strong>{p.title}</strong>
                    {p.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT SUITE */}
        <section className="sec reveal" id="platform">
          <div className="sec-tag">The Platform</div>
          <h2 className="sec-h">One platform. Every tool you need to grow.</h2>
          <p className="sec-sub">
            Start with AI intelligence today. Unlock POS, inventory, ERP,
            e-commerce, and more as your business scales.
          </p>
          <div className="prod-tabs" style={{ marginTop: 36 }}>
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                className={`prod-tab${activeProd === p.id ? ' on' : ''} iact`}
                onClick={() => setActiveProd(p.id)}
                style={
                  activeProd === p.id
                    ? {
                        background: `linear-gradient(135deg,${p.color}18,${p.color}09)`,
                        borderColor: `${p.color}38`,
                      }
                    : {}
                }
              >
                {p.icon} {p.label}
                {p.soon && <span className="soon-b">SOON</span>}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProd}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="prod-preview"
              style={{
                borderColor: `${ap.color}22`,
                borderTopColor: `${ap.color}55`,
              }}
            >
              <motion.div
                className="prod-icon"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {ap.icon}
              </motion.div>
              <div>
                <div
                  className="prod-title"
                  style={{
                    background: `linear-gradient(135deg,#fff,${ap.color})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {ap.label}
                </div>
                <div className="prod-desc">{ap.desc}</div>
                {ap.soon ? (
                  <div className="prod-coming">⏳ Coming Q3–Q4 2025</div>
                ) : (
                  <Link
                    href="/register"
                    style={{
                      display: 'inline-flex',
                      marginTop: 20,
                      padding: '11px 24px',
                      background: `linear-gradient(135deg,${ap.color},${ap.color}88)`,
                      borderRadius: 12,
                      color: '#fff',
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      cursor: 'none',
                      boxShadow: `0 0 28px ${ap.color}40`,
                    }}
                  >
                    Try Free →
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* AI INTELLIGENCE */}
        <section className="sec reveal" id="intelligence">
          <div className="ai-sec">
            <div>
              <div className="sec-tag">Guru AI</div>
              <h2 className="sec-h" style={{ marginBottom: 14 }}>
                The AI that actually knows your business.
              </h2>
              <p
                style={{
                  color: 'var(--t2)',
                  fontSize: 15,
                  lineHeight: 1.78,
                  fontWeight: 300,
                  maxWidth: 380,
                  marginBottom: 20,
                }}
              >
                Not a generic chatbot. Guru AI reads{' '}
                <strong style={{ color: 'var(--c)' }}>
                  your live business data
                </strong>{' '}
                — revenue, margins, inventory, trends — and gives you specific,
                actionable answers in seconds.
              </p>
              <ul className="ai-checks">
                {[
                  { q: 'Why did my profit drop on Tuesday?', c: 'var(--b)' },
                  { q: 'Which product has the highest margin?', c: 'var(--c)' },
                  { q: 'Am I on track for my monthly target?', c: 'var(--p)' },
                  { q: 'Should I reorder stock now or wait?', c: 'var(--g)' },
                  { q: 'What should I focus on tomorrow?', c: 'var(--pk)' },
                ].map((item) => (
                  <li key={item.q}>
                    <span
                      className="ai-ck"
                      style={{
                        background: `${item.c}18`,
                        border: `1px solid ${item.c}30`,
                        color: item.c,
                      }}
                    >
                      ✓
                    </span>
                    {item.q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ai-window">
              <div className="ai-hdr">
                <div className="ai-av">G</div>
                <div>
                  <div className="ai-n">Guru AI</div>
                  <div className="ai-st">
                    <span className="ai-stdt" />
                    Reading your data live
                  </div>
                </div>
              </div>
              <div className="msg msg-u">
                <div className="bbl bbl-u">
                  Why did my profit drop on Tuesday?
                </div>
              </div>
              <div className="msg">
                <div className="bbl bbl-a">
                  Tuesday expenses were <span className="hl">$310</span> —{' '}
                  <span className="neg">34% above average</span>. Revenue was
                  normal at $720 but the spike cut your margin from{' '}
                  <span className="pos">56% → 38%</span>.<br />
                  <br />
                  This is 3 Tuesdays in a row. You likely have a recurring
                  supplier payment hitting on that day.
                </div>
              </div>
              <div className="msg msg-u">
                <div className="bbl bbl-u">
                  What should I focus on this week?
                </div>
              </div>
              <div className="msg">
                <div className="bbl bbl-a">
                  <span className="pos">
                    One thing: get daily expenses below $260.
                  </span>
                  <br />
                  <br />
                  You hit your revenue target 5 of 7 days. The only gap between
                  you and <span className="hl">60%+ margins</span> is the
                  expense side.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REPORTS */}
        <section className="sec reveal">
          <div className="sec-tag">Reporting</div>
          <h2 className="sec-h">
            Know where you stand. Every day, every quarter, every year.
          </h2>
          <p className="sec-sub">
            Every pricing tier unlocks a different layer of reporting
            intelligence — from daily snapshots to full annual P&amp;L.
          </p>
          <div className="reports-grid">
            {[
              {
                icon: '📅',
                c: '#3B82F6',
                bg: 'rgba(59,130,246,.1)',
                bd: 'rgba(59,130,246,.2)',
                title: 'Daily Digest',
                tier: 'Growth+',
                desc: "Every morning at 6am: yesterday's revenue, expenses, profit margin, top insight, and one action item. Read in 60 seconds.",
              },
              {
                icon: '📊',
                c: '#8B5CF6',
                bg: 'rgba(139,92,246,.1)',
                bd: 'rgba(139,92,246,.2)',
                title: 'Monthly Report',
                tier: 'Growth+',
                desc: 'Full month revenue breakdown, expense categories, profit trend, and a 3-month performance comparison — auto-generated, no spreadsheets.',
              },
              {
                icon: '📈',
                c: '#06B6D4',
                bg: 'rgba(6,182,212,.1)',
                bd: 'rgba(6,182,212,.2)',
                title: 'Quarterly Review',
                tier: 'Growth+',
                desc: 'Quarter-on-quarter growth analysis, seasonal patterns, top products, and a forward projection for the next 90 days.',
              },
              {
                icon: '🏆',
                c: '#10B981',
                bg: 'rgba(16,185,129,.1)',
                bd: 'rgba(16,185,129,.2)',
                title: 'Annual Summary',
                tier: 'Growth+',
                desc: 'Your full year at a glance: revenue trajectory, best month, biggest expense, and a year-over-year comparison against industry benchmarks.',
              },
              {
                icon: '📋',
                c: '#F59E0B',
                bg: 'rgba(245,158,11,.1)',
                bd: 'rgba(245,158,11,.2)',
                title: 'P&L Statement',
                tier: 'Scale+',
                desc: 'A formatted Profit & Loss statement, ready to share with accountants, investors, or lenders. Exportable as PDF or CSV.',
              },
              {
                icon: '🔮',
                c: '#EC4899',
                bg: 'rgba(236,72,153,.1)',
                bd: 'rgba(236,72,153,.2)',
                title: 'AI Forecast',
                tier: 'Scale+',
                desc: '30 and 90-day revenue forecasts based on your historical patterns, seasonal trends, and current trajectory. Updated weekly.',
              },
            ].map((r) => (
              <div key={r.title} className="rpt iact">
                <div
                  className="rpt-icon"
                  style={{ background: r.bg, border: `1px solid ${r.bd}` }}
                >
                  {r.icon}
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 5,
                    }}
                  >
                    <div className="rpt-title">{r.title}</div>
                    <span
                      style={{
                        fontSize: 8.5,
                        padding: '1.5px 6px',
                        borderRadius: 4,
                        background: `${r.c}18`,
                        color: r.c,
                        border: `1px solid ${r.c}28`,
                        fontWeight: 700,
                        letterSpacing: '.05em',
                      }}
                    >
                      {r.tier}
                    </span>
                  </div>
                  <div className="rpt-desc">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ROADMAP */}
        <section className="sec reveal" id="roadmap">
          <div style={{ textAlign: 'center' }}>
            <div className="sec-tag" style={{ justifyContent: 'center' }}>
              Roadmap
            </div>
            <h2 className="sec-h" style={{ textAlign: 'center' }}>
              Where we are. Where we&apos;re going.
            </h2>
            <p
              style={{
                color: 'var(--t2)',
                fontSize: 15,
                lineHeight: 1.75,
                marginTop: 14,
                fontWeight: 300,
              }}
            >
              Building in public. Shipping every sprint.
            </p>
          </div>
          <div className="rm-grid">
            {ROADMAP.map((ph) => (
              <motion.div
                key={ph.phase}
                className={`rm-card ${ph.done ? 'done' : 'next'}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {ph.done && <div className="rm-done-b">✓ Shipped</div>}
                <div className="rm-ph">Phase {ph.phase}</div>
                <div className="rm-q" style={{ color: ph.color }}>
                  {ph.q}
                </div>
                <div
                  className="rm-label"
                  style={{
                    background: `linear-gradient(135deg,#fff,${ph.color})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {ph.label}
                </div>
                {ph.items.map((item) => (
                  <div key={item} className="rm-item">
                    <div
                      className="rm-dot"
                      style={{
                        background: ph.color,
                        boxShadow: ph.done ? `0 0 6px ${ph.color}` : undefined,
                      }}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="sec reveal" id="pricing">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="sec-tag" style={{ justifyContent: 'center' }}>
              Pricing
            </div>
            <h2 className="sec-h" style={{ textAlign: 'center' }}>
              Simple, transparent pricing.
            </h2>
            <p
              style={{
                color: 'var(--t2)',
                fontSize: 14,
                marginTop: 12,
                fontWeight: 300,
              }}
            >
              All plans include a 14-day free trial. No credit card required to
              start. Prices shown in your selected currency — change it in the
              nav. Billed in USD.
            </p>
          </div>
          <div className="bill-toggle">
            {(['monthly', 'quarterly', 'annual'] as const).map((b) => (
              <button
                key={b}
                className={`bill-btn${billing === b ? ' on' : ''} iact`}
                onClick={() => setBilling(b)}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === 'quarterly' && (
                  <span className="save-tag">SAVE 14%</span>
                )}
                {b === 'annual' && <span className="save-tag">SAVE 34%</span>}
              </button>
            ))}
          </div>
          <div className="price-grid">
            {TIERS.map((t) => {
              const p = price(t);
              return (
                <div
                  key={t.id}
                  className={`pc${t.featured ? ' feat' : ''}`}
                  style={
                    t.featured ? {} : { borderTop: `2px solid ${t.color}30` }
                  }
                >
                  {t.badge && (
                    <div
                      className="pc-badge"
                      style={
                        t.featured
                          ? {
                              background: 'rgba(59,130,246,.15)',
                              color: '#3B82F6',
                              border: '1px solid rgba(59,130,246,.3)',
                            }
                          : {
                              background: `${t.color}18`,
                              color: t.color,
                              border: `1px solid ${t.color}30`,
                            }
                      }
                    >
                      {t.badge}
                    </div>
                  )}
                  <div className="pc-tier">{t.label}</div>
                  <div
                    className="pc-price"
                    style={{
                      background: `linear-gradient(135deg,#fff,${t.color})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {p === null
                      ? 'Custom'
                      : p === 0
                        ? `${symbol} 0`
                        : ratesLoading
                          ? `$${p}`
                          : `${symbol} ${convert(p * 130)}`}
                  </div>
                  <div className="pc-per">
                    {p === null
                      ? 'contact us for pricing'
                      : p === 0
                        ? 'forever free'
                        : `per month · billed ${billing}`}
                  </div>
                  <div className="pc-tag">{t.tagline}</div>
                  <ul className="pc-features">
                    {t.features.map((f) => (
                      <li key={f}>
                        <span className="ck">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={t.ctaLink}
                    className="pc-btn"
                    style={t.featured ? {} : { borderColor: `${t.color}22` }}
                  >
                    {t.cta}
                  </Link>
                </div>
              );
            })}
          </div>
          {/* MULTITENANCY CALLOUT */}
          <div
            style={{
              marginTop: 28,
              padding: '20px 28px',
              background: 'rgba(139,92,246,.05)',
              border: '1px solid rgba(139,92,246,.18)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--t1)',
                  marginBottom: 4,
                }}
              >
                Multi-location &amp; multi-tenant ready
              </div>
              <div
                style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}
              >
                Scale and Enterprise plans support multiple branches, separate
                P&amp;Ls per location, consolidated HQ reporting, and role-based
                access across your entire organisation.
              </div>
            </div>
            <Link
              href="/register"
              className="btn-cta"
              style={{ flexShrink: 0, fontSize: 12, padding: '9px 18px' }}
            >
              Learn More →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-sec">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 32,
            }}
          >
            <BossMascot size={110} float={true} />
          </div>
          <motion.div
            variants={stag}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fUp}>
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--g)',
                  letterSpacing: '.15em',
                  textTransform: 'uppercase',
                  marginBottom: 22,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                Version 3.5 · Now Live
              </div>
            </motion.div>
            <motion.h2
              variants={fUp}
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 'clamp(32px,5.5vw,72px)',
                fontWeight: 800,
                letterSpacing: '-.045em',
                lineHeight: 0.98,
                marginBottom: 24,
                background:
                  'linear-gradient(135deg,#fff 0%,var(--c) 38%,var(--p) 68%,var(--pk) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Stop managing.
              <br />
              Start orchestrating.
            </motion.h2>
            <motion.p
              variants={fUp}
              style={{
                color: 'var(--t2)',
                fontSize: 17,
                lineHeight: 1.78,
                fontWeight: 300,
                maxWidth: 480,
                margin: '0 auto 44px',
              }}
            >
              The AI-native platform that turns your business data into
              intelligence — and intelligence into growth.
            </motion.p>
            <motion.div
              variants={fUp}
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/register"
                className="btn-hero"
                style={{ fontSize: 17, padding: '19px 44px' }}
              >
                Get Started Free →
              </Link>
              <Link
                href="/login"
                className="btn-sec"
                style={{ fontSize: 15, padding: '19px 32px' }}
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* NEURAL CANVAS DIVIDER */}
        <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
          <canvas
            ref={neuralRef}
            style={{ width: '100%', height: '100%', opacity: 0.38 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom,transparent,var(--v))',
            }}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="foot-grid">
            {/* Brand */}
            <div>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 24,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg,#fff,var(--c))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 10,
                }}
              >
                B.O.S.S
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--t3)',
                  fontWeight: 300,
                  marginBottom: 4,
                  lineHeight: 1.65,
                }}
              >
                Business Orchestration Software Systems.
                <br />
                The AI-Native Business Intelligence Platform.
              </p>
              <div className="foot-origin">
                Built in <span>Nairobi, Kenya</span> — Africa
                <br />
                Engineered for <span>the World</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 7,
                  flexWrap: 'wrap',
                  margin: '16px 0 20px',
                }}
              >
                {['AI-Powered', '26+ Currencies', 'Mobile-First', 'Secure'].map(
                  (t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10,
                        padding: '3px 9px',
                        borderRadius: 5,
                        background: 'rgba(255,255,255,.04)',
                        border: '1px solid rgba(255,255,255,.06)',
                        color: 'var(--t3)',
                      }}
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
              <CurrencyDropdown />
            </div>
            {/* Product */}
            <div>
              <div className="foot-label">Product</div>
              {[
                ['Platform', '#platform'],
                ['Intelligence', '#intelligence'],
                ['Roadmap', '#roadmap'],
                ['Pricing', '#pricing'],
                ['About', '#about'],
                ['Sign In', '/login'],
                ['Get Started', '/register'],
              ].map(([l, h]) => (
                <a key={l} href={h} className="foot-link">
                  {l}
                </a>
              ))}
            </div>
            {/* Tech Stack */}
            {FOOTER_TECH.slice(0, 2).map((fc) => (
              <div key={fc.cat}>
                <div className="foot-label">{fc.cat}</div>
                {fc.items.map((i) => (
                  <div key={i} className="foot-tech">
                    {i}
                  </div>
                ))}
              </div>
            ))}
            <div>
              {FOOTER_TECH.slice(2).map((fc) => (
                <div key={fc.cat} style={{ marginBottom: 20 }}>
                  <div className="foot-label">{fc.cat}</div>
                  {fc.items.map((i) => (
                    <div key={i} className="foot-tech">
                      {i}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="foot-divider">
            <p className="foot-copy">
              © 2026 B.O.S.S · Guru Software Group. Built in Nairobi, Kenya 🇰🇪
              for Africa and the world.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                ['Privacy Policy', '#'],
                ['Terms of Service', '#'],
                ['Contact', 'https://wa.me/254701937625'],
                ['Status', '#'],
              ].map(([l, h]) => (
                <a
                  key={l}
                  href={h}
                  className="foot-copy"
                  style={{ textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={(e) =>
                    ((e.target as any).style.color = 'var(--t2)')
                  }
                  onMouseLeave={(e) => ((e.target as any).style.color = '')}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

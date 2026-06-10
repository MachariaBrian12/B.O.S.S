<div align="center">

# B.O.S.S

### Business Orchestration Software Systems

[![Version](https://img.shields.io/badge/version-3.1.0-blueviolet?style=flat-square&logo=github)](https://github.com/MachariaBrian12/B.O.S.S)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen?style=flat-square&logo=vercel)](https://boss-engine.vercel.app)
[![Uptime](https://img.shields.io/badge/Uptime-99.52%25-brightgreen?style=flat-square&logo=statuspage)](https://boss-engine.vercel.app)
[![Observability](https://img.shields.io/badge/Observability-10%2F10-brightgreen?style=flat-square&logo=sentry)](https://sentry.io)
[![AI](https://img.shields.io/badge/AI-GPT--4o--mini-blueviolet?style=flat-square&logo=openai)](https://openai.com)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%2B%20Express-blue?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-teal?style=flat-square&logo=postgresql)](https://neon.tech)
[![Payments](https://img.shields.io/badge/Payments-M--Pesa%20%2B%20Stripe-green?style=flat-square&logo=stripe)](https://stripe.com)

---

_The operating system for modern businesses._  
_B.O.S.S unifies operations, intelligence, and AI automation into one platform._  
_Built for Africa. Engineered for the World._

[**Live App**](https://boss-engine.vercel.app) · [**API Health**](https://boss-production-75ce.up.railway.app/api/health) · [**Report Bug**](https://github.com/MachariaBrian12/B.O.S.S/issues)

</div>

---

## Overview

Business Orchestration Software Systems - B.O.S.S

AI-native, AI-powered Software-as-a-Service (SaaS) and Business Intelligence platform built to help businesses operate smarter through real-time intelligence, orchestration, automation, analytics, and predictive insights.

B.O.S.S transforms fragmented business operations into a unified intelligent system by combining operational analytics, AI-driven recommendations, centralized business management, and predictive business intelligence into a single platform.

Built with artificial intelligence at its core, B.O.S.S helps businesses move beyond traditional dashboards and static reporting into continuous operational intelligence and intelligent orchestration.

---

## Features

### 🧠 Core Intelligence

- **AI Chat Engine** — GPT-4o-mini powered business advisor with persistent memory across sessions
- **Daily Business Intelligence** — revenue, expenses, profit margin, and trend analysis in real time
- **Weekly & Historical Analytics** — 7-day, 30-day, and quarterly performance summaries
- **AI Signals** — confidence-weighted directional indicators for business decisions
- **Smart Alerts** — proactive warnings when metrics deviate from healthy ranges
- **Streak Tracking** — consecutive days of data entry to build operational discipline

### ⚡ Operations

- **Daily Entry System** — structured revenue and expense logging with instant AI insights
- **Business Feed** — ranked, prioritised activity stream of what matters most right now
- **Profile & Business Management** — multi-user ready architecture
- **M-Pesa STK Push** — native East African payment infrastructure
- **Stripe** — global payment processing

### 🔐 Platform

- JWT authentication with secure middleware and role-based access control
- Rate limiting and request validation on every endpoint
- Admin backend with system monitoring and stats endpoints
- Modular Turborepo monorepo — web, API, admin, shared packages

### 📡 Observability (v3.1.0)

- **Sentry** — full user identity on every error, crash-free users tracked per session
- **Distributed tracing** — every API route, DB query, and AI call has a performance span
- **Audit logs** — immutable write-once ledger of every data change (enterprise-ready)
- **PostHog** — session recordings, funnels, retention cohorts, feature adoption
- **AI telemetry** — token cost, latency, and success rate tracked per user per feature
- **Deep health checks** — DB connectivity verified on every uptime monitor ping
- **Sentry alerts** — new issues and error rate spikes trigger immediate team notifications

---

## Features

### 🧠 Core Intelligence

- **AI Chat Engine** — GPT-4o powered business advisor with persistent memory across sessions
- **Daily Business Intelligence** — revenue, expenses, profit margin, and trend analysis in real time
- **Weekly & Historical Analytics** — 7-day, 30-day, and quarterly performance summaries
- **AI Signals** — confidence-weighted directional indicators for business decisions
- **Smart Alerts** — proactive warnings when metrics deviate from healthy ranges
- **Streak Tracking** — consecutive days of data entry to build operational discipline

### ⚡ Operations

- **Daily Entry System** — structured revenue and expense logging with instant AI insights
- **Business Feed** — ranked, prioritised activity stream of what matters most right now
- **Profile & Business Management** — multi-user ready architecture
- **M-Pesa STK Push** — native East African payment infrastructure
- **Stripe** — global payment processing

### 🔐 Platform

- JWT authentication with secure middleware and role-based access control
- Rate limiting and request validation on every endpoint
- Admin backend with system monitoring and stats endpoints
- Modular Turborepo monorepo — web, API, admin, shared packages

### 📡 Observability (v3.1.0)

- **Sentry** — full user identity on every error, crash-free users tracked per session
- **Distributed tracing** — every API route, DB query, and AI call has a performance span
- **Audit logs** — immutable write-once ledger of every data change (enterprise-ready)
- **PostHog** — session recordings, funnels, retention cohorts, feature adoption
- **AI telemetry** — token cost, latency, and success rate tracked per user per feature
- **Deep health checks** — DB connectivity verified on every uptime monitor ping
- **Sentry alerts** — new issues and error rate spikes trigger immediate team notifications

---

## Stack

**Frontend**

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- State: Zustand with persistence
- Styling: CSS variables + custom design system
- Analytics: PostHog
- Error monitoring: Sentry

**Backend**

- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- Database: PostgreSQL (Neon) — production, SQLite — local dev
- ORM: Prisma
- Authentication: JWT (JSON Web Tokens)
- Validation: Zod
- Logging: Pino
- Security: Helmet, CORS, Rate Limiting

**AI**

- Provider: OpenAI API (GPT-4o)
- Memory: Prisma-backed persistent conversation history
- Telemetry: Sentry spans + AiUsage table (cost, latency, tokens per request)

**Infrastructure**

- API hosting: Railway
- Web hosting: Vercel
- Database: Neon (serverless PostgreSQL)
- Monorepo: Turborepo
- Payments: M-Pesa STK Push (Safaricom), Stripe
- Observability: Sentry + PostHog

| Layer         | Technology                                            |
| ------------- | ----------------------------------------------------- |
| Frontend      | Next.js 14, TypeScript, Zustand, PostHog, Sentry      |
| Backend       | Node.js, Express.js, TypeScript, Zod, Pino            |
| Database      | PostgreSQL (Neon) — production · SQLite — local dev   |
| ORM           | Prisma                                                |
| AI            | OpenAI GPT-4o-mini, persistent memory, cost telemetry |
| Auth          | JWT with role-based middleware                        |
| Security      | Helmet, CORS, Rate Limiting                           |
| Payments      | M-Pesa STK Push, Stripe                               |
| Hosting       | Vercel (web) · Railway (API) · Neon (DB)              |
| Monorepo      | Turborepo                                             |
| Observability | Sentry · PostHog · AuditLog · AiUsage                 |

---

## Architecture

```
B.O.S.S/
├── apps/
│   ├── web/          # Next.js 14 frontend (Vercel)
│   ├── api/          # Express.js backend (Railway)
│   └── admin/        # Admin dashboard
├── packages/
│   ├── ui/           # Shared component library
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configuration
```

---

## Observability

B.O.S.S is instrumented end-to-end before scale. Every layer has visibility:

| Layer          | Tool            | What it tracks                             |
| -------------- | --------------- | ------------------------------------------ |
| Errors         | Sentry          | Crashes, exceptions, user identity         |
| Performance    | Sentry Spans    | Route latency, DB queries, AI calls        |
| Product        | PostHog         | Funnels, retention, session recordings     |
| AI             | AiUsage table   | Token cost, latency, success rate per user |
| Data integrity | AuditLog table  | Every write operation with actor + IP      |
| Infrastructure | Health endpoint | DB connectivity + response time            |

---

## API Health

```
GET /api/health
```

Returns DB connectivity status, latency, and environment. Used by uptime monitors.

```json
{
  "status": "ok",
  "db": "ok",
  "latencyMs": 12,
  "time": "2026-06-10T07:11:00.000Z"
}
```

---

## Vision

Built for Africa. Engineered for the World.

Every business owner deserves the intelligence layer that enterprise companies pay millions for. B.O.S.S makes that accessible — starting with the businesses that need it most.

---

## Principle

Every action → Data  
Every data → Intelligence  
Every intelligence → Action

---

## Production

- Web: [boss-engine.vercel.app](https://boss-engine.vercel.app)
- API: [boss-production-75ce.up.railway.app](https://boss-production-75ce.up.railway.app)
- Status: 99.92% crash-free sessions
- Version: v3.1.0

# Ujima SACCO — AI-Powered Loan Platform

A full-stack loan management system with a customer self-service portal and an AI Agent Pride (Scout → Guardian → Hunter) for automated, bias-aware loan evaluation.

## Two Experiences

### 🏦 Officer Dashboard (`/`)
- Portfolio metrics, application list, approve/reject controls
- Loan detail pages with agent re-run
- Reports, members, standalone agent triage

### 🌿 Customer Portal (`/portal`)
- Self-service loan application (customers fill their own details)
- Live AI agent evaluation — watch Scout, Guardian, Hunter evaluate in real time
- Application tracking with status updates

## Stack
- React 18 + React Router 6
- Vite
- Lucide React icons
- Claude claude-sonnet-4-20250514 (streaming via Anthropic API)
- Google Fonts: Fraunces + Nunito + DM Mono

## Setup

```bash
npm install
npm run dev
```

The app calls the Anthropic API directly from the browser. No backend needed.

## Agent Pride Architecture

| Agent | Role | RANK Boundary |
|-------|------|---------------|
| Scout | Financial literacy coach | Educates only, never recommends loans |
| Guardian | Loan triage | Approves ≤ KES 15,000, escalates on risk flags |
| Hunter | Human coordinator | Prepares officer briefings, NEVER approves/denies |

## GUARD Safety Rails
- Busia County → mandatory human review
- Amount > KES 50,000 → senior officer pause
- 2+ children under 5 → welfare check
- Medical emergency → fast-track escalation
- DIGNITY FILTER: blocks "unreliable" and "risky" language

## Regulatory
- Aligned with Kenya DPA 2022
- SASRA compliance hooks
- Data sovereignty: AWS Africa (Cape Town) region recommended

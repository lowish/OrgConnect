# OrgConnect

<p>
  <a href="https://orgconnect.vercel.app">
    <img src="https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live on Vercel" />
  </a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.6" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
</p>

**Discover official School of Computing organizations, explore what they offer, and receive personalized recommendations through an AI-powered advisor.**

**→ [orgconnect.vercel.app](https://orgconnect.vercel.app)**

---

## Demo

https://github.com/lowish/OrgConnect/raw/main/public/OrgConnectDemoLive.mp4

> Video not loading? [View it directly](public/OrgConnectDemo.mp4).

---

## What it is

Students find orgs through Facebook pages, posters, and word-of-mouth. OrgConnect replaces
that with one discovery experience: browse every org, read what each offers, and describe
your interests to get a reasoned recommendation.

A **discovery platform** — no login, no membership registration, no posting.

## Features

- **Organization showcase** — all 10 official SoC organizations as interactive cards with logo, category, description, and the skills each teaches.
- **Detail pages** — overview, mission and vision, offerings, activities, officers, gallery, and contacts. Empty sections don't render; unconfirmed orgs are flagged **Needs Verification** rather than presented as fact.
- **AI Recommendation Advisor** — a chat widget that returns org matches *with reasons*. Rule-based, runs entirely in the browser over [`src/data/organizations.ts`](src/data/organizations.ts) — no API key, no external calls, no cost. It answers only from the knowledge base; if nothing matches, it says so instead of inventing an org.
- **Connect With Students** — live directory fed by a Google Form → Sheet → Apps Script JSON endpoint, validated before render. See [`google-apps-script/`](google-apps-script/). Falls back to sample profiles when unconfigured.
- **Events** — upcoming org events with date, venue, and host.

## Tech stack

React 18 · TypeScript 5.6 · Vite 6 · Tailwind CSS 4 · Framer Motion 11 · Lucide React · Zod 3 · Vercel

Routing is hash-based and handled in [`src/App.tsx`](src/App.tsx) — no router dependency.
Untrusted input is parsed through [`src/schemas/`](src/schemas/); rows that fail validation
are dropped rather than rendered.

---

## Getting started

Requires Node.js 18+.

```bash
git clone https://github.com/lowish/OrgConnect.git
cd OrgConnect
npm install
npm run dev
```

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |

### Environment

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `VITE_STUDENTS_ENDPOINT` | No | Apps Script Web App URL (ends in `/exec`) serving the student directory as JSON. Blank shows sample profiles. |

> Vite exposes every `VITE_`-prefixed variable to the browser bundle — never put a secret
> behind that prefix. `.env.local` is git-ignored; only `.env.example` is tracked.

## Deployment

Vercel auto-detects Vite, so the defaults work (`npm run build` → `dist`). Add
`VITE_STUDENTS_ENDPOINT` under **Project Settings → Environment Variables** for the live
student directory. Every push to `main` deploys.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lowish/OrgConnect)

---

Built for the **Holy Angel University School of Computing**. Organization details come from
official sources; anything unverified is labelled as such in the UI.

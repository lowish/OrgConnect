<div align="center">

<a href="https://orgconnect.vercel.app">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.simpleicons.org/vercel/FFFFFF" />
    <img src="https://cdn.simpleicons.org/vercel/000000" width="72" alt="OrgConnect — deployed on Vercel" />
  </picture>
</a>

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

**Every official Holy Angel University School of Computing organization in one place — with an AI advisor that matches you to the ones that fit.**

**→ [orgconnect.vercel.app](https://orgconnect.vercel.app)**

</div>

Students currently rely on Facebook pages, posters, and word-of-mouth to find out which
organizations exist and what they actually do. OrgConnect replaces that scattering with a
single discovery experience: browse every org, read what each one offers, and describe your
interests to get a reasoned recommendation.

It is a **discovery platform**, not a social network or a management system — there is no
login, no membership registration, and no posting.

---

## Features

### Organization showcase
All 10 official School of Computing organizations — GDG on Campus, the SoC Student Council,
Code Geeks, CIA, LOOP, MAFIA, AWS SBG, The Access Point and others — each as an interactive
card carrying its logo, category, description, and the skills it teaches.

### Organization detail pages
A dedicated page per org covering its overview, mission and vision, what it offers, skills,
activities, workshops, competitions, events, officers, gallery, and contact links. Sections
whose data is absent simply don't render, so no page shows an empty shell.

Organizations whose details haven't been officially confirmed are flagged **Needs
Verification** rather than presented as fact.

### AI Recommendation Advisor
A floating chat widget that turns a description of your interests into org recommendations
**with reasons**. It runs entirely in the browser as a transparent, rule-based engine over
[`src/data/organizations.ts`](src/data/organizations.ts) — **no API key, no external calls,
no cost**. Four layers: understand → intent → rank → compose.

Its guiding constraint: it answers *only* from the knowledge base. If nothing in the roster
matches what you asked for, it says so instead of inventing an org that does.

### Connect With Students
A live student directory fed by a Google Form. Responses land in a Google Sheet, and an
Apps Script Web App publishes them as JSON that the site validates and renders — so a new
submission appears on the next page refresh with no manual editing. See
[`google-apps-script/`](google-apps-script/). Without an endpoint configured, the section
falls back to built-in sample profiles.

### Events
Upcoming organization events with title, date, venue, description, and host.

---

## Tech stack

| | |
|---|---|
| **Framework** | React 18 + TypeScript 5.6 |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| **Animation** | Framer Motion 11 |
| **Icons** | Lucide React |
| **Validation** | Zod 3 |
| **Hosting** | Vercel |

Routing is hash-based (`#organizations`, `#organization/<id>`, `#students/all`, `#legal/…`)
and handled directly in [`src/App.tsx`](src/App.tsx) — no router dependency.

---

## Getting started

**Requirements:** Node.js 18+

```bash
git clone https://github.com/lowish/OrgConnect.git
cd OrgConnect
npm install
npm run dev
```

The dev server prints a local URL (usually `http://localhost:5173`).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |

### Environment variables

Copy the example file and fill in what you need:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `VITE_STUDENTS_ENDPOINT` | No | Deployed Apps Script Web App URL (ends in `/exec`) serving the student directory as JSON. Leave blank to show sample profiles. |

`.env.local` is git-ignored and must never be committed. Only `.env.example` is tracked.

> Vite exposes every `VITE_`-prefixed variable to the browser bundle. Never put a secret
> behind that prefix.

---

## Project structure

```
src/
├── App.tsx                  Hash routing + page composition
├── components/
│   ├── HeroAIAdvisor/       AI advisor chat — advisor.ts is the engine
│   ├── layout/              Navbar, Footer, Background
│   ├── org-detail/          Organization detail page building blocks
│   ├── sections/            Hero, OrgShowcase, EventsPreview, ConnectStudents, …
│   └── ui/                  Reusable primitives (Button, OrgCard, StudentCard, …)
├── data/                    organizations.ts, events.ts, students.ts
├── lib/                     Data access + hooks (useStudents, useTheme, orgLogo, color)
├── schemas/                 Zod schemas — the validation boundary
└── index.css                Tailwind theme tokens

google-apps-script/          Google Sheet → JSON endpoint (Code.gs + setup guide)
```

**Data flows through Zod.** [`src/schemas/`](src/schemas/) holds the single source of truth
for both organizations and students. Untrusted input — anything from the Google Sheet — is
parsed and normalized there before any component sees it; rows that fail validation are
dropped rather than rendered.

---

## Design

Dark-first, aiming closer to Linear/Vercel/Stripe than to a traditional university site:
large typography, spacious layout, monochrome palette with an emerald accent, and HAU's
red/gold reserved for brand moments only. Light mode is available via the navbar toggle and
persists in `localStorage`.

Accessibility is treated as a requirement: semantic markup, keyboard-navigable controls, and
`<MotionConfig reducedMotion="user">` so every animation stills for anyone who has set
`prefers-reduced-motion`.

---

## Deployment

Deployed on [**Vercel**](https://vercel.com). Vercel auto-detects Vite, so the defaults work:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

Add `VITE_STUDENTS_ENDPOINT` under **Project Settings → Environment Variables** if you want
the live student directory in production. Every push to `main` triggers a deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lowish/OrgConnect)

---

## Acknowledgements

Built for the **Holy Angel University School of Computing**. Organization details come from
official university and organization sources; anything unverified is labelled as such in the
UI rather than presented as confirmed.

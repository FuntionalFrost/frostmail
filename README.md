# FrostMail ✉️

> **Open Source Visual Transactional Email Studio & Domain Deliverability Auditor**  
> Built with **SvelteKit 2**, **Svelte 5 Runes**, **`yaxa-svelte`**, **Tailwind CSS v4**, **MJML**, **Drizzle ORM**, and **Polar.sh MoR**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Svelte v5](https://img.shields.io/badge/Svelte-5.56-orange.svg)](https://svelte.dev)
[![yaxa-svelte](https://img.shields.io/badge/yaxa--svelte-v1.2.0-red.svg)](https://yaxa.vercel.app)

---

## ✨ Features

### 1. Visual AST & MJML Email Studio (`/editor`)

- **Block Palette**: Insert Text, Action Buttons, Product Images, Dividers, and Spacers.
- **Interactive Canvas**: Real-time MJML compilation with live iframe rendering and in-canvas click-to-select element tracking (`postMessage`).
- **Contextual Inspector**: Rich styling controls powered by `yaxa-svelte`'s interactive `<ColorPicker>`, font selectors, padding/radius inputs, and alignment tools.
- **Dynamic Merge Variables (`{{ user.name }}`)**: Mock JSON variable payload editor with 1-click syntax copying and instant interpolation preview.
- **Undo / Redo & Local Storage**: 25-step history snapshot stack with keyboard shortcuts (<kbd>⌘Z</kbd>, <kbd>⌘Y</kbd>, <kbd>Esc</kbd>) and persistent project library.
- **Clipping Detector**: Live byte calculator with Gmail 102 KB clipping warnings.
- **Multi-Format Export**: Export to production HTML, React Email (`.tsx`), MJML XML, or JSON AST.

### 2. Domain Deliverability Auditor (`/diagnostic`)

- **DNS-over-HTTPS Verification**: Query Cloudflare DoH in real time for **MX**, **SPF**, **DKIM selectors**, and **DMARC policies**.
- **Deliverability Scoring**: Automated 0–100 score calculation with clear remediation tips.
- **Content Spam Health Linter**: Automated scan for all-caps subjects, spam trigger words, and missing unsubscribe clauses.

### 3. Monetization & Authentication

- **Polar.sh Merchant of Record**: Integrated subscription checkouts (`€19 / month`), customer billing portal, and secure webhook handler.
- **Better-Auth & Drizzle ORM**: Cloud sync for custom templates and account management with PostgreSQL / Neon database adapter.
- **Resend Dispatch**: Dispatch test renders directly to your inbox with a single click.

---

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5 Runes](https://svelte.dev/docs/svelte/overview)
- **UI & SEO Library**: [`yaxa-svelte`](https://yaxa.vercel.app) (Tailwind CSS v4, ColorPicker, ButtonGroup, Kbd, Seo, Favicons)
- **Email Engine**: [MJML](https://mjml.io) + Custom React Email AST Converter
- **Auth & Database**: [Better-Auth](https://better-auth.com) + [Drizzle ORM](https://orm.drizzle.team) + [Neon PostgreSQL](https://neon.tech)
- **Billing**: [Polar.sh](https://polar.sh) SDK
- **Testing**: [Playwright](https://playwright.dev) (Unit & E2E browser tests)

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database & Auth
DATABASE_URL="postgresql://user:password@ep-sample.neon.tech/frostmail?sslmode=require"
BETTER_AUTH_SECRET="your-32-char-random-secret"
BETTER_AUTH_URL="http://localhost:5173"

# Email Dispatch
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="FrostMail <onboarding@resend.dev>"

# Polar.sh Merchant of Record
POLAR_ACCESS_TOKEN="polar_at_xxxxxxxxxxxx"
POLAR_PRODUCT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
POLAR_WEBHOOK_SECRET="polar_wh_xxxxxxxxxxxx"

# Cloudflare R2 / S3 Asset Storage (Optional)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_DOMAIN=""
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

```bash
# Type check TypeScript and Svelte components
pnpm check

# Code formatting & ESLint
pnpm format
pnpm lint

# Run full test suite (AST Engine unit tests + E2E browser tests)
pnpm test

# Production build
pnpm build
```

---

## 📄 License

MIT © [FrostMail Team](https://frostmail.dev)

# FrostMail ✉️

> **100% Free & Open Source Visual Transactional Email Studio & Domain Deliverability Auditor**  
> Built with **SvelteKit 2**, **Svelte 5 Runes**, **`yaxa-svelte`**, **Tailwind CSS v4**, **MJML**, **Drizzle ORM**, and **Resend**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Svelte v5](https://img.shields.io/badge/Svelte-5.56-orange.svg)](https://svelte.dev)
[![yaxa-svelte](https://img.shields.io/badge/yaxa--svelte-v1.15.0-red.svg)](https://yaxa.vercel.app)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.3-38bdf8.svg)](https://tailwindcss.com)

---

## ✨ Features

### 1. Visual AST & MJML Email Studio (`/editor`)

- **Pluggable Block Architecture**: Text, Buttons, Images, Badges, Social Links, Raw HTML, Dividers, and Spacers.
- **Multi-Column Sections**: 1, 2, 3, 4, 1/3+2/3, 2/3+1/3, and 1/4+1/2+1/4 responsive section layouts with contextual block insertion.
- **Interactive Canvas**: Real-time MJML AST compilation with live iframe rendering and in-canvas click-to-select element tracking (`postMessage`).
- **Contextual Inspector**: Rich styling controls powered by `yaxa-svelte`'s interactive `<ColorPicker>`, font selectors, padding/radius inputs, and alignment tools.
- **Dynamic Merge Variables (`{{ user.name }}`)**: Mock JSON variable payload editor with 1-click syntax copying and instant interpolation preview.
- **Undo / Redo & Local Storage**: 25-step history snapshot stack with keyboard shortcuts (<kbd>⌘Z</kbd>, <kbd>⌘Y</kbd>, <kbd>Esc</kbd>) and persistent project library.
- **Clipping Detector**: Live byte calculator with Gmail 102 KB clipping warnings.
- **Multi-Format Export**: 100% unlocked export to production HTML, React Email (`.tsx`), MJML XML, or JSON AST.

### 2. Domain Deliverability Auditor (`/diagnostic`)

- **DNS-over-HTTPS Verification**: Query Cloudflare DoH in real time for **MX**, **SPF**, **DKIM selectors**, and **DMARC policies**.
- **Deliverability Scoring**: Automated 0–100 score calculation with clear remediation recommendations.
- **Content Spam Health Linter**: Automated scan for all-caps subjects, spam trigger words, and missing unsubscribe clauses.

### 3. Authentication & Cloud Sync

- **Better-Auth & Drizzle ORM**: Optional encrypted cloud sync for custom templates and account management with PostgreSQL / Neon database adapter.
- **Resend Dispatch**: Send live test renders directly to your inbox with a single click.
- **Cloudflare R2 / AWS S3**: Bring-your-own-storage for email media assets.

---

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5 Runes](https://svelte.dev/docs/svelte/overview)
- **UI & Design Tokens**: [`yaxa-svelte`](https://yaxa.vercel.app) + [Tailwind CSS v4](https://tailwindcss.com)
- **Email Engine**: [MJML](https://mjml.io) + Custom React Email AST Converter
- **Auth & Database**: [Better-Auth](https://better-auth.com) + [Drizzle ORM](https://orm.drizzle.team) + [Neon PostgreSQL](https://neon.tech)
- **Icons**: [Lucide Svelte](https://lucide.dev)
- **Testing**: [Playwright](https://playwright.dev)

---

## 🚀 Quick Start (Zero Setup Mode)

FrostMail works 100% client-side with zero external cloud dependencies out of the box using browser `localStorage`.

### 1. Clone & Install

```bash
git clone https://github.com/FuntionalFrost/frostmail.git
cd frostmail
pnpm install
```

### 2. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Full Cloud & Self-Hosting Configuration

To enable cloud template sync, live inbox testing, and asset storage, create a `.env` file:

```env
# Optional: Database & Better-Auth (for cloud template sync)
DATABASE_URL="postgresql://user:password@ep-sample.neon.tech/frostmail?sslmode=require"
BETTER_AUTH_SECRET="your-32-char-random-secret"
BETTER_AUTH_URL="http://localhost:5173"

# Optional: Resend API (for live test inbox dispatch)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="FrostMail <onboarding@resend.dev>"

# Optional: Cloudflare R2 / AWS S3 Asset Storage
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_DOMAIN=""
```

---

## 🧪 Testing & Verification

```bash
# SvelteKit & TypeScript type checking
pnpm check

# Code formatting & ESLint
pnpm format
pnpm lint

# Production build
pnpm build
```

---

## 🤝 Community & Contributing

Contributions, feature requests, and block submissions are welcome! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

# Contributing to FrostMail ✉️

Thank you for your interest in contributing to FrostMail! As a 100% Free and Open Source (FOSS) project under the MIT License, we welcome contributions from everyone.

---

## 🛠️ Local Development Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/FuntionalFrost/frostmail.git
   cd frostmail
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` (or configure minimal required variables):

   ```bash
   # Minimum local setup (Local storage mode works out of the box)
   BETTER_AUTH_SECRET="your-32-char-random-secret"
   BETTER_AUTH_URL="http://localhost:5173"
   ```

4. **Start the Development Server:**
   ```bash
   pnpm dev
   ```

---

## 🧩 Adding or Modifying Email Blocks

Email blocks in FrostMail follow the **Pluggable Block Registry** pattern in `src/lib/blocks/`:

1. Define block type and attributes in `src/lib/blocks/types.ts`.
2. Implement block definition (default state, MJML compiler, React Email generator) in `src/lib/blocks/<block-type>.ts`.
3. Register the block in `src/lib/blocks/registry.ts`.
4. Create the corresponding inspector in `src/lib/components/inspectors/<BlockType>Inspector.svelte`.

---

## 🧪 Quality Standards & Verification

Before submitting a Pull Request, please ensure all automated checks pass:

```bash
# 1. Type check
pnpm check

# 2. Code formatting & linting
pnpm format
pnpm lint

# 3. Production build
pnpm build
```

---

## 📄 License

By contributing to FrostMail, you agree that your contributions will be licensed under the [MIT License](LICENSE).

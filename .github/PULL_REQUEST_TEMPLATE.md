## Description

Please include a concise summary of the change, motivation, and relevant issue links.

Fixes #(issue)

---

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] ✨ New feature (non-breaking change adding functionality)
- [ ] 🧩 Email Block (new or updated email AST block)
- [ ] 💄 UI / Styling update
- [ ] ⚡ Performance optimization
- [ ] 📝 Documentation update
- [ ] 🔧 Tooling / CI / Dependencies

---

## Quality Checklist

Before submitting this PR, please verify:

- [ ] `pnpm check` passes with 0 errors and 0 warnings
- [ ] `pnpm test` passes all tests
- [ ] `pnpm lint` and `pnpm format` pass without styling discrepancies
- [ ] `pnpm build` succeeds locally
- [ ] If adding/modifying an email block, the Pluggable Block Registry (`src/lib/blocks/`) and corresponding inspector were updated
- [ ] Self-review of code performed and no debugging artifacts left behind

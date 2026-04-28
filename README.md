# Boring AI Migration Suite

> Production-grade migration system that upgrades real-world applications from **wagmi v2→v3** and **Inngest v3→v4** with **zero false positives**.

![Tests](https://img.shields.io/badge/tests-25%2F25%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌐 Live Demo
https://migrate-wagmi-v3.vercel.app

Paste your code and instantly see the migrated output.

---

## 🚀 Quick Start

### wagmi v2 → v3
```bash
npx migrate-wagmi-v3 ./your-project
```

### Inngest v3 → v4
```bash
npx migrate-wagmi-v3 --inngest ./your-project
```

---

## 🔒 Safe Preview (Dry Run)

```bash
npx migrate-wagmi-v3 ./your-project --dry-run
```

- Shows exactly what will change  
- Does **not modify files**  
- Builds trust before execution  

---

## 🚀 One-Command Migration PR

```bash
npx migrate-wagmi-v3 --auto-pr https://github.com/owner/repo --token ghp_xxx
```

- Clones repository  
- Runs migration  
- Commits changes  
- Opens a pull request automatically  

👉 End-to-end migration in one command.

---

## 🎯 Why This Matters

Upgrading dependencies is slow, risky, and error-prone.

This system eliminates that friction by:
- Automating deterministic changes safely  
- Flagging edge cases with precise TODOs  
- Reducing migration time from hours → seconds  

👉 Designed for real production workflows.

---

## 🔧 Supported Migrations

### wagmi v2 → v3 (Primary)

#### ✅ Automated (Zero False Positives)

- Hook renames (`useAccount` → `useConnection`)
- Contract hooks (`useContractRead` → `useReadContract`)
- Network & chain updates
- Provider updates (`WagmiConfig` → `WagmiProvider`)
- Mutation patterns (`writeContract` → `mutate` / `mutateAsync`)
- Import migrations (`wagmi/chains` → `viem/chains`)
- Type renames

#### ⚠️ Flagged for Review

- `createConfig` breaking changes  
- Connector updates  
- Wrapper patterns  

---

### Inngest v3 → v4 (Secondary Validation)

#### ✅ Automated

- Function trigger migration  
- `serve()` → constructor config  
- `serveHost` → `serveOrigin`  
- Streaming normalization  
- `step.invoke` updates  

#### ⚠️ Flagged for Review

- Event schema changes  
- Logger migration  
- Middleware rewrite  

---

## 📊 Real-World Validation

### wagmi — scaffold-eth-2 (10k+ stars)

- Files affected: 13  
- Patterns detected: 15  
- Automated: 11  
- Flagged: 4  
- Coverage: 73%  
- False positives: 0  

👉 Migration completed safely with no regressions.

PR: https://github.com/scaffold-eth/scaffold-eth-2/pull/1278

---

### Inngest — Documenso (10k+ stars)

- Files affected: 1  
- Patterns detected: 3  
- Automated: 1  
- Flagged: 2  
- False positives: 0  

👉 Demonstrates support for backend SDK migrations.

PR: https://github.com/documenso/documenso/pull/2736

---

## 📈 Migration Reports

Every run generates a **detailed report file**:

```bash
migration-report.md
```

👉 The report is saved to `migration-report.md` in the root of your target project.

### Example Output

```
📊 Migration Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Files affected:        13
🔍 Patterns detected:     15
✅ Automated changes:     11
⚠️  TODOs for review:     4
📈 Coverage:              73%
🚫 False positives:       0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### What This Means

- **Patterns detected** → total migration opportunities found  
- **Automated changes** → safely transformed code  
- **TODOs** → flagged for AI/manual review  
- **Coverage** → % of migration handled automatically  

👉 Designed for transparency, safety, and easy verification.

---

## 🧠 How It Works

### 1. Deterministic Codemods (70–80%)
- AST-based transformations  
- Fast and reliable  
- Guaranteed zero false positives  

### 2. AI-Assisted Layer (20–30%)
- Flags ambiguous patterns  
- Provides precise TODO guidance  

👉 Hybrid approach = **maximum automation + zero risk**

---

## ✅ Test Suite

```
wagmi:   10 tests passing
Inngest: 15 tests passing
Total:   25/25 passing
```

- Covers edge cases and idempotency  
- Ensures safe repeated runs  

---

## 🏗️ Project Structure

```
boring-ai-migration-suite/
├── bin/
│   └── index.js
├── packages/
│   ├── codemod/
│   │   ├── src/
│   │   │   ├── transforms/
│   │   │   ├── tests/
│   │   │   ├── autoPR.ts
│   │   │   └── index.ts
│   └── inngest-codemod/
│       ├── src/
│       │   ├── transforms/
│       │   ├── tests/
│       │   └── index.ts
└── apps/
    └── web/
```

---

## 🔗 References

- https://wagmi.sh/react/guides/migrate-from-v2-to-v3  
- https://www.inngest.com/docs/reference/typescript/v4/migrations/v3-to-v4  
- https://migrate-wagmi-v3.vercel.app  
- GitHub: https://github.com/Web3smallie/migrate-wagmi-v3  

---

## 🏆 Why This Stands Out

- Works on real production repositories  
- Zero false positives guaranteed  
- Multi-ecosystem validation (frontend + backend)  
- Safe preview mode (`--dry-run`)  
- End-to-end automation (`--auto-pr`)  
- Transparent reporting (`migration-report.md`)  

👉 Not just a codemod — a **complete migration workflow**

---

## 🏁 Built for
**Codemod Boring AI Hackathon 2026**
#!/usr/bin/env node

const path = require("path");
const { migrate } = require("../dist/index");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
  migrate-inngest-v4 — Inngest TypeScript SDK v3 → v4 codemod

  Usage:
    npx migrate-inngest-v4 <path-to-project>

  Example:
    npx migrate-inngest-v4 ./my-project
    npx migrate-inngest-v4 .
  `);
  process.exit(0);
}

const targetPath = path.resolve(process.cwd(), args[0]);

console.log(`\n🔍 Scanning ${targetPath} for Inngest v3 patterns...\n`);

migrate(targetPath).then((results) => {
  if (results.length === 0) {
    console.log("✅ No Inngest v3 patterns found. Already on v4?");
    process.exit(0);
  }

  let totalChanges = 0;
  let totalTodos = 0;

  results.forEach(({ file, changes, todos }) => {
    console.log(`📄 ${file}`);
    changes.forEach((c) => console.log(`   ✅ ${c}`));
    todos.forEach((t) => console.log(`   ⚠️  TODO: ${t}`));
    totalChanges += changes.length;
    totalTodos += todos.length;
  });

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ${totalChanges} changes applied across ${results.length} files
⚠️  ${totalTodos} TODOs flagged for AI/manual review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}).catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
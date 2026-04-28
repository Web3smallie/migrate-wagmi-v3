#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const { migrate } = require("../dist/index");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const targetArg = args.find((a) => !a.startsWith("--"));

if (!targetArg) {
  console.log(`
  migrate-wagmi-v3 — wagmi v2 → v3 codemod

  Usage:
    npx migrate-wagmi-v3 <path-to-project> [--dry-run]

  Examples:
    npx migrate-wagmi-v3 ./my-project
    npx migrate-wagmi-v3 . --dry-run
  `);
  process.exit(0);
}

const targetPath = path.resolve(process.cwd(), targetArg);

if (dryRun) {
  console.log(`\n🔍 [DRY RUN] Scanning ${targetPath} for wagmi v2 patterns...\n`);
} else {
  console.log(`\n🔍 Scanning ${targetPath} for wagmi v2 patterns...\n`);
}

migrate(targetPath, dryRun).then((summary) => {
  if (summary.results.length === 0) {
    console.log("✅ No wagmi v2 patterns found. Already on v3?");
    process.exit(0);
  }

  summary.results.forEach(({ file, changes, todos }) => {
    console.log(`📄 ${file}`);
    changes.forEach((c) => console.log(`   ✅ ${c}`));
    todos.forEach((t) => console.log(`   ⚠️  TODO: ${t}`));
  });

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Migration Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Files affected:        ${summary.totalFiles}
🔍 Patterns detected:     ${summary.totalPatternsDetected}
✅ Automated changes:     ${summary.totalChanges}
⚠️  TODOs for AI review:  ${summary.totalTodos}
📈 Coverage:              ${summary.coveragePercent}%
${dryRun ? "🔒 DRY RUN — No files were modified" : "✅ Migration complete"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  // Generate migration report
  if (!dryRun) {
    const report = generateReport(summary, targetPath);
    const reportPath = path.join(targetPath, "migration-report.md");
    fs.writeFileSync(reportPath, report, "utf-8");
    console.log(`📝 Migration report saved to: ${reportPath}\n`);
  }

}).catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

function generateReport(summary, targetPath) {
  const date = new Date().toISOString().split("T")[0];
  let report = `# wagmi v2 → v3 Migration Report\n\n`;
  report += `**Date:** ${date}\n`;
  report += `**Target:** ${targetPath}\n`;
  report += `**Tool:** migrate-wagmi-v3\n\n`;
  report += `## Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Files affected | ${summary.totalFiles} |\n`;
  report += `| Patterns detected | ${summary.totalPatternsDetected} |\n`;
  report += `| Automated changes | ${summary.totalChanges} |\n`;
  report += `| TODOs for AI review | ${summary.totalTodos} |\n`;
  report += `| Coverage | ${summary.coveragePercent}% |\n\n`;
  report += `## Files Changed\n\n`;

  summary.results.forEach(({ file, changes, todos }) => {
    report += `### ${path.basename(file)}\n`;
    report += `**Path:** \`${file}\`\n\n`;
    if (changes.length > 0) {
      report += `**Automated changes:**\n`;
      changes.forEach((c) => report += `- ✅ ${c}\n`);
    }
    if (todos.length > 0) {
      report += `\n**AI review needed:**\n`;
      todos.forEach((t) => report += `- ⚠️ ${t}\n`);
    }
    report += `\n`;
  });

  report += `## Next Steps\n\n`;
  report += `1. Review all ⚠️ TODO comments in the modified files\n`;
  report += `2. Run your test suite to verify no regressions\n`;
  report += `3. Update wagmi to v3: \`npm install wagmi@^3\`\n`;
  report += `4. See full migration guide: https://wagmi.sh/react/guides/migrate-from-v2-to-v3\n`;

  return report;
}
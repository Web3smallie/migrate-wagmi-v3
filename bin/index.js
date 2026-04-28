#!/usr/bin/env node

const path = require("path");
const args = process.argv.slice(2);

const ecosystem = args.find(a => a === "--wagmi" || a === "--inngest") || "--wagmi";
const remainingArgs = args.filter(a => a !== "--wagmi" && a !== "--inngest");

if (ecosystem === "--inngest") {
  // Run inngest codemod
  process.argv = [process.argv[0], process.argv[1], ...remainingArgs];
  require("../packages/inngest-codemod/bin/index.js");
} else {
  // Run wagmi codemod (default)
  process.argv = [process.argv[0], process.argv[1], ...remainingArgs];
  require("../packages/codemod/bin/index.js");
}
import { glob } from "glob";
import * as fs from "fs";
import * as path from "path";
import { transformUseAccount } from "./transforms/useAccount";
import { transformUseAccountEffect } from "./transforms/useAccountEffect";
import { transformUseSwitchAccount } from "./transforms/useSwitchAccount";
import { transformConnectorImports } from "./transforms/connectorImports";
import { transformMutateArgs } from "./transforms/mutateArgs";
import { transformImportRenames } from "./transforms/importRenames";
import { transformConnectorPeerDeps } from "./transforms/connectorPeerDeps";
import { transformMutateRename } from "./transforms/mutateRename";
import { transformWagmiProvider } from "./transforms/wagmiProvider";
import { transformTypeLevel } from "./transforms/typeLevel";
import { transformCreateConfig } from "./transforms/createConfig";
import { transformChainImports } from "./transforms/chainImports";
import { transformWrapperHooks } from "./transforms/wrapperHooks";
import { transformInngestMiddleware } from "./transforms/inngestMiddleware";

export interface MigrationResult {
  file: string;
  changes: string[];
  todos: string[];
  patternsDetected: number;
}

export interface MigrationSummary {
  results: MigrationResult[];
  totalFiles: number;
  totalChanges: number;
  totalTodos: number;
  totalPatternsDetected: number;
  coveragePercent: number;
}

export async function migrate(
  targetPath: string,
  dryRun: boolean = false
): Promise<MigrationSummary> {
  const results: MigrationResult[] = [];

  const files = await glob("**/*.{ts,tsx,js,jsx}", {
    cwd: targetPath,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    absolute: true,
  });

  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");

    if (!source.includes("wagmi") && !source.includes("inngest")) continue;

    let transformed = source;
    const changes: string[] = [];
    const todos: string[] = [];
    let patternsDetected = 0;

    // wagmi transforms
    const r2 = transformUseAccount(transformed);
    if (r2.changed) { transformed = r2.code; changes.push("useAccount → useConnection"); patternsDetected++; }

    const r3 = transformUseAccountEffect(transformed);
    if (r3.changed) { transformed = r3.code; changes.push("useAccountEffect → useConnectionEffect"); patternsDetected++; }

    const r4 = transformUseSwitchAccount(transformed);
    if (r4.changed) { transformed = r4.code; changes.push("useSwitchAccount → useSwitchConnection"); patternsDetected++; }

    const r8 = transformMutateRename(transformed);
    if (r8.changed) { transformed = r8.code; changes.push("Mutation hook functions renamed to mutate/mutateAsync"); patternsDetected++; }

    const r9 = transformWagmiProvider(transformed);
    if (r9.changed) { transformed = r9.code; changes.push("WagmiConfig → WagmiProvider"); patternsDetected++; }

    const r10 = transformTypeLevel(transformed);
    if (r10.changed) { transformed = r10.code; changes.push("Type-level wagmi renames applied"); patternsDetected++; }

    const r11 = transformChainImports(transformed);
    if (r11.changed) { transformed = r11.code; todos.push("Chain imports moved to viem/chains"); patternsDetected++; }

    const r12 = transformCreateConfig(transformed);
    if (r12.changed) { transformed = r12.code; todos.push("createConfig options need manual review"); patternsDetected++; }

    const r13 = transformWrapperHooks(transformed);
    if (r13.changed) { transformed = r13.code; todos.push("Wrapper hooks flagged for AI review"); patternsDetected++; }

    // Update imports AFTER hook renames
    const r1 = transformImportRenames(transformed);
    if (r1.changed) { transformed = r1.code; changes.push("wagmi imports updated"); patternsDetected++; }

    const r5 = transformConnectorImports(transformed);
    if (r5.changed) { transformed = r5.code; todos.push("Connector imports need peer dependency updates"); patternsDetected++; }

    const r6 = transformMutateArgs(transformed);
    if (r6.changed) { transformed = r6.code; todos.push("Mutation hook args need manual review"); patternsDetected++; }

    const r7 = transformConnectorPeerDeps(transformed);
    if (r7.changed) { transformed = r7.code; todos.push("Connector peer dependencies need separate installation"); patternsDetected++; }

    // Inngest transforms
    const r14 = transformInngestMiddleware(transformed);
    if (r14.changed) { transformed = r14.code; todos.push("Inngest middleware system needs manual review"); patternsDetected++; }

    if (changes.length > 0 || todos.length > 0) {
      if (!dryRun) {
        fs.writeFileSync(file, transformed, "utf-8");
      }
      results.push({ file, changes, todos, patternsDetected });
    }
  }

  const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);
  const totalTodos = results.reduce((sum, r) => sum + r.todos.length, 0);
  const totalPatternsDetected = results.reduce((sum, r) => sum + r.patternsDetected, 0);
  const coveragePercent = totalPatternsDetected > 0
    ? Math.round((totalChanges / totalPatternsDetected) * 100)
    : 0;

  return {
    results,
    totalFiles: results.length,
    totalChanges,
    totalTodos,
    totalPatternsDetected,
    coveragePercent,
  };
}
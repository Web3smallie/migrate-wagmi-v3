import { glob } from "glob";
import * as path from "path";
import * as fs from "fs";
import { transformUseAccount } from "./transforms/useAccount";
import { transformUseAccountEffect } from "./transforms/useAccountEffect";
import { transformUseSwitchAccount } from "./transforms/useSwitchAccount";
import { transformConnectorImports } from "./transforms/connectorImports";
import { transformMutateArgs } from "./transforms/mutateArgs";
import { transformImportRenames } from "./transforms/importRenames";

export interface MigrationResult {
  file: string;
  changes: string[];
  todos: string[];
}

export async function migrate(targetPath: string): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  const files = await glob("**/*.{ts,tsx,js,jsx}", {
    cwd: targetPath,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    absolute: true,
  });

  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");

    if (!source.includes("wagmi")) continue;

    let transformed = source;
    const changes: string[] = [];
    const todos: string[] = [];

    // Run hook renames BEFORE import renames
    const r2 = transformUseAccount(transformed);
    if (r2.changed) { transformed = r2.code; changes.push("useAccount → useConnection"); }

    const r3 = transformUseAccountEffect(transformed);
    if (r3.changed) { transformed = r3.code; changes.push("useAccountEffect → useConnectionEffect"); }

    const r4 = transformUseSwitchAccount(transformed);
    if (r4.changed) { transformed = r4.code; changes.push("useSwitchAccount → useSwitchConnection"); }

    // Update imports AFTER hook renames
    const r1 = transformImportRenames(transformed);
    if (r1.changed) { transformed = r1.code; changes.push("wagmi imports updated"); }

    const r5 = transformConnectorImports(transformed);
    if (r5.changed) { transformed = r5.code; todos.push("Connector imports need peer dependency updates"); }

    const r6 = transformMutateArgs(transformed);
    if (r6.changed) { transformed = r6.code; todos.push("Mutation hook args need manual review"); }

    if (changes.length > 0 || todos.length > 0) {
      fs.writeFileSync(file, transformed, "utf-8");
      results.push({ file, changes, todos });
    }
  }

  return results;
}
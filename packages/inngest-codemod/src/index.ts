import { execSync } from "child_process";
import { glob } from "glob";
import * as path from "path";
import * as fs from "fs";
import { transformCreateFunction } from "./transforms/createFunction";
import { transformServeOptions } from "./transforms/serveOptions";
import { transformServeHost } from "./transforms/serveHost";
import { transformStreaming } from "./transforms/streaming";
import { transformStepInvoke } from "./transforms/stepInvoke";
import { transformLogLevel } from "./transforms/logLevel";
import { transformGatewayEndpoint } from "./transforms/gatewayEndpoint";
import { transformEventSchemas } from "./transforms/eventSchemas";

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

    if (!source.includes("inngest")) continue;

    let transformed = source;
    const changes: string[] = [];
    const todos: string[] = [];

    const r1 = transformCreateFunction(transformed);
    if (r1.changed) { transformed = r1.code; changes.push("createFunction trigger moved to options"); }

    const r2 = transformServeOptions(transformed);
    if (r2.changed) { transformed = r2.code; changes.push("serve options moved to client"); }

    const r3 = transformServeHost(transformed);
    if (r3.changed) { transformed = r3.code; changes.push("serveHost renamed to serveOrigin"); }

    const r4 = transformStreaming(transformed);
    if (r4.changed) { transformed = r4.code; changes.push("streaming option simplified"); }

    const r5 = transformStepInvoke(transformed);
    if (r5.changed) { transformed = r5.code; changes.push("step.invoke string ID replaced"); }

    const r6 = transformLogLevel(transformed);
    if (r6.changed) { transformed = r6.code; todos.push("logLevel removed - configure via logger option"); }

    const r7 = transformGatewayEndpoint(transformed);
    if (r7.changed) { transformed = r7.code; changes.push("rewriteGatewayEndpoint replaced with gatewayUrl"); }

    const r8 = transformEventSchemas(transformed);
    if (r8.changed) { transformed = r8.code; todos.push("EventSchemas removed - migrate to eventType()"); }

    if (changes.length > 0 || todos.length > 0) {
      fs.writeFileSync(file, transformed, "utf-8");
      results.push({ file, changes, todos });
    }
  }

  return results;
}
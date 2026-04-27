import { TransformResult } from "./useAccount";

export function transformConnectorImports(source: string): TransformResult {
  let changed = false;
  let code = source;

  const connectorPackages = [
    "@wagmi/connectors",
    "wagmi/connectors",
  ];

  const todoComment = `/* TODO (AI): wagmi v3 moved connectors to peer dependencies. 
   Install the specific connector packages you need separately.
   See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3 */\n`;

  for (const pkg of connectorPackages) {
    if (code.includes(pkg) && !code.includes("TODO (AI): wagmi v3 moved connectors")) {
      changed = true;
      const importPattern = new RegExp(
        `import\\s*\\{[^}]*\\}\\s*from\\s*["']${pkg.replace("/", "\\/")}["']`,
        "g"
      );
      code = code.replace(importPattern, (match) => {
        return `${todoComment}${match}`;
      });
    }
  }

  return { code, changed };
}
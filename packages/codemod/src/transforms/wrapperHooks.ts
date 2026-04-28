import { TransformResult } from "./useAccount";

export function transformWrapperHooks(source: string): TransformResult {
  let changed = false;
  let code = source;

  const deprecatedHooks = [
    "useAccount",
    "useAccountEffect", 
    "useSwitchAccount",
  ];

  for (const hook of deprecatedHooks) {
    // Detect any function that internally calls a deprecated hook
    const wrapperPattern = new RegExp(
      `((?:export\\s+)?(?:const|function)\\s+\\w+\\s*=?\\s*(?:\\([^)]*\\)\\s*=>|function\\s*\\([^)]*\\))\\s*\\{[^}]*\\b${hook}\\b[^}]*\\})`,
      "gs"
    );

    if (code.includes(hook) && wrapperPattern.test(code)) {
      changed = true;
      code = code.replace(wrapperPattern, (match) => {
        // Don't add comment if already flagged
        if (match.includes("@codemod-ai-action")) return match;

        return `/**
 * @codemod-ai-action
 * DETECTED: This function wraps the deprecated wagmi v2 '${hook}'.
 * INSTRUCTION: Rename '${hook}' to '${hook.replace("useAccount", "useConnection").replace("useSwitchAccount", "useSwitchConnection")}' 
 * inside this wrapper and update any destructuring accordingly.
 * See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3
 */
${match}`;
      });
    }
  }

  return { code, changed };
}
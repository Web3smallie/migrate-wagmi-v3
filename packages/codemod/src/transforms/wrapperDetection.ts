import * as fs from "fs";
import * as path from "path";

export interface WrapperMap {
  [wrapperName: string]: string; // wrapperName → deprecated hook it wraps
}

const DEPRECATED_HOOKS = [
  "useAccount",
  "useAccountEffect",
  "useSwitchAccount",
  "useContractRead",
  "useContractWrite",
  "useNetwork",
  "useSwitchNetwork",
  "useWaitForTransaction",
];

// Pass 1: Build a map of all wrapper functions across all files
export function buildWrapperMap(files: string[]): WrapperMap {
  const wrapperMap: WrapperMap = {};

  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");

    for (const hook of DEPRECATED_HOOKS) {
      if (!source.includes(hook)) continue;

      // Detect: export const useMyHook = () => { ... useAccount() ... }
      const wrapperPattern = new RegExp(
        `(?:export\\s+)?(?:const|function)\\s+(use\\w+)\\s*[=:]?[^{]*\\{[^}]*\\b${hook}\\b[^}]*\\}`,
        "gs"
      );

      let match;
      while ((match = wrapperPattern.exec(source)) !== null) {
        const wrapperName = match[1];
        if (wrapperName && wrapperName !== hook) {
          wrapperMap[wrapperName] = hook;
        }
      }
    }
  }

  return wrapperMap;
}

// Pass 2: Flag usages of wrapper hooks in all files
export function flagWrapperUsages(
  source: string,
  wrapperMap: WrapperMap
): { code: string; changed: boolean; flagged: string[] } {
  let changed = false;
  let code = source;
  const flagged: string[] = [];

  for (const [wrapperName, deprecatedHook] of Object.entries(wrapperMap)) {
    if (!code.includes(wrapperName)) continue;

    // Only flag call sites not definitions
    const usagePattern = new RegExp(
      `(?<!function\\s)(?<!const\\s\\w+\\s*=\\s*)\\b${wrapperName}\\s*\\(`,
      "g"
    );

    if (usagePattern.test(code)) {
      changed = true;
      flagged.push(wrapperName);

      code = code.replace(
        new RegExp(`(${wrapperName}\\s*\\()`, "g"),
        `/* @codemod-ai-advice: '${wrapperName}' wraps deprecated wagmi v2 '${deprecatedHook}'.
   Action: Update internal logic of '${wrapperName}' to use '${deprecatedHook.replace("useAccount", "useConnection").replace("useNetwork", "useChains").replace("useSwitchNetwork", "useSwitchChain")}' and verify all property access. */
$1`
      );
    }
  }

  return { code, changed, flagged };
}
import { TransformResult } from "./useAccount";

export function transformUseSwitchAccount(source: string): TransformResult {
  let changed = false;
  let code = source;

  // useSwitchAccount → useSwitchConnection
  if (code.includes("useSwitchAccount")) {
    changed = true;
    code = code.replace(/\buseSwitchAccount\b/g, "useSwitchConnection");
  }

  return { code, changed };
}
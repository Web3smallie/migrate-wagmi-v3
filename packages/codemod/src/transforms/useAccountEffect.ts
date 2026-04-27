import { TransformResult } from "./useAccount";

export function transformUseAccountEffect(source: string): TransformResult {
  let changed = false;
  let code = source;

  // useAccountEffect → useConnectionEffect
  if (code.includes("useAccountEffect")) {
    changed = true;
    code = code.replace(/\buseAccountEffect\b/g, "useConnectionEffect");
  }

  return { code, changed };
}
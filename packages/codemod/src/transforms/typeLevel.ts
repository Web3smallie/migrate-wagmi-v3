import { TransformResult } from "./useAccount";

export function transformTypeLevel(source: string): TransformResult {
  let changed = false;
  let code = source;

  const typeRenames: Record<string, string> = {
    UseAccountReturnType: "UseConnectionReturnType",
    UseAccountParameters: "UseConnectionParameters",
    UseAccountEffectParameters: "UseConnectionEffectParameters",
    UseSwitchAccountReturnType: "UseSwitchConnectionReturnType",
    UseSwitchAccountParameters: "UseSwitchConnectionParameters",
  };

  for (const [oldType, newType] of Object.entries(typeRenames)) {
    if (code.includes(oldType)) {
      changed = true;
      code = code.replace(new RegExp(`\\b${oldType}\\b`, "g"), newType);
    }
  }

  return { code, changed };
}
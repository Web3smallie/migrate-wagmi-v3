export interface TransformResult {
  code: string;
  changed: boolean;
}

export function transformUseAccount(source: string): TransformResult {
  let changed = false;
  let code = source;

  // useAccount → useConnection (but NOT useAccountEffect)
  const pattern = /\buseAccount\b(?!Effect)/g;

  if (pattern.test(code)) {
    changed = true;
    code = code.replace(/\buseAccount\b(?!Effect)/g, "useConnection");
  }

  return { code, changed };
}
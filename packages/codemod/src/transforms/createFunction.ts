export interface TransformResult {
  code: string;
  changed: boolean;
}

export function transformCreateFunction(source: string): TransformResult {
  let changed = false;
  let code = source;

  // Pattern 1: object literal trigger { event: "..." } or { cron: "..." }
  const literalPattern = /([\w.]+\.createFunction\s*\(\s*)(\{[^{}]*\})\s*,\s*(\{[^{}]*(?:event|cron):[^{}]*\})\s*,\s*(async\s*(?:\(|function))/g;

  code = code.replace(literalPattern, (match, fn, opts, trigger, asyncPart) => {
    if (opts.includes("triggers")) return match;
    changed = true;
    const optsInner = opts.slice(1, -1).trimEnd().replace(/,\s*$/, "");
    const newOpts = `{\n      ${optsInner.trim()},\n      triggers: [${trigger.trim()}],\n    }`;
    return `${fn}${newOpts},\n    ${asyncPart}`;
  });

  // Pattern 2: variable trigger (e.g. triggerConfig)
  const variablePattern = /([\w.]+\.createFunction\s*\(\s*)(\{[^{}]*\})\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*(async\s*(?:\(|function))/g;

  code = code.replace(variablePattern, (match, fn, opts, triggerVar, asyncPart) => {
    if (opts.includes("triggers")) return match;
    if (triggerVar === "undefined" || triggerVar === "null") return match;
    changed = true;
    const optsInner = opts.slice(1, -1).trimEnd().replace(/,\s*$/, "");
    const newOpts = `{\n      ${optsInner.trim()},\n      triggers: [${triggerVar}],\n    }`;
    return `${fn}${newOpts},\n    ${asyncPart}`;
  });

  return { code, changed };
}
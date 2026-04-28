import { TransformResult } from "./createFunction";

export function transformStreaming(source: string): TransformResult {
  let changed = false;
  let code = source;

  // Replace streaming: "force" with streaming: true
  if (code.includes(`streaming: "force"`)) {
    changed = true;
    code = code.replace(/streaming:\s*"force"/g, "streaming: true");
  }

  // Replace streaming: 'force' with streaming: true
  if (code.includes(`streaming: 'force'`)) {
    changed = true;
    code = code.replace(/streaming:\s*'force'/g, "streaming: true");
  }

  // Replace streaming: "allow" with streaming: true
  if (code.includes(`streaming: "allow"`)) {
    changed = true;
    code = code.replace(/streaming:\s*"allow"/g, "streaming: true");
  }

  // Replace streaming: 'allow' with streaming: true
  if (code.includes(`streaming: 'allow'`)) {
    changed = true;
    code = code.replace(/streaming:\s*'allow'/g, "streaming: true");
  }

  return { code, changed };
}
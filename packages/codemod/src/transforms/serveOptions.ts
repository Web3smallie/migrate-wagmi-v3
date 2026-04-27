import { TransformResult } from "./createFunction";

export function transformServeOptions(source: string): TransformResult {
  // Match signingKey, baseUrl, fetch, signingKeyFallback inside serve({...})
  // and move them to the Inngest client constructor

  const servePattern = /serve\s*\(\s*\{([^}]*)\}\s*\)/g;
  
  let changed = false;
  
  const optionsToMove = ["signingKey", "signingKeyFallback", "baseUrl", "fetch"];
  
  const code = source.replace(servePattern, (match, inner) => {
    const hasOption = optionsToMove.some(opt => inner.includes(opt));
    if (!hasOption) return match;

    changed = true;

    // Add TODO comment for manual review since moving to client requires
    // finding the Inngest constructor which may be in another file
    return `/* TODO (AI): Move signingKey, baseUrl, fetch, signingKeyFallback from serve() to new Inngest({...}) constructor */\n    serve({${inner}})`;
  });

  return { code, changed };
}
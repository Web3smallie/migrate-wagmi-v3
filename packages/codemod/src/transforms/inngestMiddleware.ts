import { TransformResult } from "./useAccount";

export function transformInngestMiddleware(source: string): TransformResult {
  let changed = false;
  let code = source;

  // Detect old middleware definition pattern
  const oldMiddlewarePattern = /middleware\s*:\s*\[([^\]]*)\]/g;

  if (code.includes("middleware") && code.includes("inngest")) {
    // Flag middleware array usage
    if (oldMiddlewarePattern.test(code)) {
      changed = true;
      code = code.replace(oldMiddlewarePattern, (match) => {
        if (match.includes("@codemod-ai-action")) return match;
        return `/* TODO (AI): Inngest v4 completely overhauled the middleware system.
   The middleware array API was removed.
   Migrate to the new middleware() function:
   import { middleware } from "inngest"
   const myMiddleware = middleware({
     name: "My Middleware",
     init: ({ ctx }) => ({ ... })
   })
   See: https://www.inngest.com/docs/reference/typescript/v4/migrations/v3-to-v4
*/
${match}`;
      });
    }

    // Detect createMiddleware usage
    if (code.includes("createMiddleware")) {
      changed = true;
      code = code.replace(
        /\bcreateMiddleware\b/g,
        `/* TODO (AI): createMiddleware was replaced by middleware() in Inngest v4 */ middleware`
      );
    }
  }

  return { code, changed };
}
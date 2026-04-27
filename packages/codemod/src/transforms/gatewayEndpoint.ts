import { TransformResult } from "./createFunction";

export function transformGatewayEndpoint(source: string): TransformResult {
  let changed = false;
  let code = source;

  // Match rewriteGatewayEndpoint: (url) => { ... } inside connect({})
  const pattern = /rewriteGatewayEndpoint\s*:\s*(\([^)]*\))\s*=>\s*\{[^}]*\}/g;

  if (code.includes("rewriteGatewayEndpoint")) {
    changed = true;
    code = code.replace(pattern, () => {
      return `gatewayUrl: /* TODO (AI): Replace rewriteGatewayEndpoint callback with a static gatewayUrl string e.g. "wss://my-cluster-host:8289/v0/connect" */`;
    });
  }

  return { code, changed };
}
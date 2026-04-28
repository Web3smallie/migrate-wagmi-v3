import { TransformResult } from "./useAccount";

export function transformCreateConfig(source: string): TransformResult {
  let changed = false;
  let code = source;

  // Flag autoConnect removal
  if (code.includes("autoConnect")) {
    changed = true;
    code = code.replace(
      /autoConnect\s*:\s*(true|false)\s*,?/g,
      `/* TODO (AI): autoConnect was removed in wagmi v3. 
   Use reconnectOnMount instead if needed.
   See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3 */`
    );
  }

  // Flag publicClient → transports
  if (code.includes("publicClient")) {
    changed = true;
    code = code.replace(
      /publicClient\s*:/g,
      `/* TODO (AI): publicClient was removed in wagmi v3. 
   Replace with transports: { [chain.id]: http() }
   See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3 */
   transports:`
    );
  }

  // Flag webSocketPublicClient → transports
  if (code.includes("webSocketPublicClient")) {
    changed = true;
    code = code.replace(
      /webSocketPublicClient\s*:/g,
      `/* TODO (AI): webSocketPublicClient was removed in wagmi v3.
   Replace with webSocket() transport in transports config.
   See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3 */
   transports:`
    );
  }

  return { code, changed };
}
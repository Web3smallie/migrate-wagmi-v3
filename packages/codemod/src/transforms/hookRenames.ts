import { TransformResult } from "./useAccount";

export function transformHookRenames(source: string): TransformResult {
  let changed = false;
  let code = source;

  const renames: Record<string, string> = {
    useContractRead: "useReadContract",
    useContractWrite: "useWriteContract",
    usePrepareContractWrite: "useSimulateContract",
    usePrepareContractTransaction: "useSimulateContract",
    useContractEvent: "useWatchContractEvent",
    useContractInfiniteReads: "useInfiniteReadContracts",
    useContractReads: "useReadContracts",
    useWaitForTransaction: "useWaitForTransactionReceipt",
    useNetwork: "useChains",
    useSwitchNetwork: "useSwitchChain",
  };

  for (const [oldHook, newHook] of Object.entries(renames)) {
    if (code.includes(oldHook)) {
      changed = true;
      code = code.replace(new RegExp(`\\b${oldHook}\\b`, "g"), newHook);
    }
  }

  return { code, changed };
}
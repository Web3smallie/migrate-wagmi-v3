"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformHookRenames = transformHookRenames;
function transformHookRenames(source) {
    let changed = false;
    let code = source;
    const renames = {
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
//# sourceMappingURL=hookRenames.js.map
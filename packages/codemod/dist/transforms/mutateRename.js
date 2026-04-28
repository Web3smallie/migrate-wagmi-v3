"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformMutateRename = transformMutateRename;
function transformMutateRename(source) {
    let changed = false;
    let code = source;
    // Mutation hooks where the function name changed to mutate/mutateAsync
    const mutationHooks = [
        { hook: "useWriteContract", oldFn: "writeContract", oldAsync: "writeContractAsync" },
        { hook: "useSendTransaction", oldFn: "sendTransaction", oldAsync: "sendTransactionAsync" },
        { hook: "useSignMessage", oldFn: "signMessage", oldAsync: "signMessageAsync" },
        { hook: "useSignTypedData", oldFn: "signTypedData", oldAsync: "signTypedDataAsync" },
        { hook: "useDeployContract", oldFn: "deployContract", oldAsync: "deployContractAsync" },
        { hook: "useSwitchChain", oldFn: "switchChain", oldAsync: "switchChainAsync" },
        { hook: "useConnect", oldFn: "connect", oldAsync: "connectAsync" },
        { hook: "useDisconnect", oldFn: "disconnect", oldAsync: "disconnectAsync" },
    ];
    for (const { hook, oldFn, oldAsync } of mutationHooks) {
        if (!code.includes(hook))
            continue;
        // Pattern: const { writeContract } = useWriteContract()
        // → const { mutate: writeContract } = useWriteContract()
        const syncPattern = new RegExp(`(const\\s*\\{[^}]*?)\\b${oldFn}\\b(?!Async)([^}]*?\\}\\s*=\\s*${hook}\\s*\\()`, "g");
        if (syncPattern.test(code)) {
            changed = true;
            code = code.replace(syncPattern, (match, before, after) => {
                return `${before}mutate: ${oldFn}${after}`;
            });
        }
        // Pattern: const { writeContractAsync } = useWriteContract()
        // → const { mutateAsync: writeContractAsync } = useWriteContract()
        const asyncPattern = new RegExp(`(const\\s*\\{[^}]*?)\\b${oldAsync}\\b([^}]*?\\}\\s*=\\s*${hook}\\s*\\()`, "g");
        if (asyncPattern.test(code)) {
            changed = true;
            code = code.replace(asyncPattern, (match, before, after) => {
                return `${before}mutateAsync: ${oldAsync}${after}`;
            });
        }
    }
    return { code, changed };
}
//# sourceMappingURL=mutateRename.js.map
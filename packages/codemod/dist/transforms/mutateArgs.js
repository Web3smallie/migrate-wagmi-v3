"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformMutateArgs = transformMutateArgs;
function transformMutateArgs(source) {
    let changed = false;
    let code = source;
    // In wagmi v3, mutation hooks rename their mutate functions
    // writeContract → writeContract (mutate/mutateAsync renamed)
    // Flag complex mutation patterns for AI review
    const mutationHooks = [
        "useWriteContract",
        "useSendTransaction",
        "useSignMessage",
        "useSignTypedData",
        "useDeployContract",
        "useSwitchChain",
        "useDisconnect",
    ];
    for (const hook of mutationHooks) {
        if (code.includes(hook)) {
            // Check for old-style inline args pattern
            const oldPattern = new RegExp(`const\\s*\\{([^}]*)\\}\\s*=\\s*${hook}\\s*\\(\\s*\\{([^}]+)\\}\\s*\\)`, "g");
            if (oldPattern.test(code)) {
                changed = true;
                code = code.replace(oldPattern, (match) => {
                    return `/* TODO (AI): In wagmi v3, pass args to mutate/mutateAsync function directly, not to the hook. See migration guide. */\n${match}`;
                });
            }
        }
    }
    return { code, changed };
}
//# sourceMappingURL=mutateArgs.js.map
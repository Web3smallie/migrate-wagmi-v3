"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformWagmiProvider = transformWagmiProvider;
function transformWagmiProvider(source) {
    let changed = false;
    let code = source;
    // WagmiConfig → WagmiProvider (component rename)
    if (code.includes("WagmiConfig") && !code.includes("WagmiProvider")) {
        changed = true;
        code = code.replace(/\bWagmiConfig\b/g, "WagmiProvider");
    }
    // Update import if present
    if (code.includes("WagmiConfig") || code.includes("WagmiProvider")) {
        const importPattern = /import\s*\{([^}]*)\}\s*from\s*["']wagmi["']/g;
        code = code.replace(importPattern, (match, imports) => {
            if (imports.includes("WagmiConfig") && !imports.includes("WagmiProvider")) {
                changed = true;
                return match.replace("WagmiConfig", "WagmiProvider");
            }
            return match;
        });
    }
    return { code, changed };
}
//# sourceMappingURL=wagmiProvider.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformChainImports = transformChainImports;
function transformChainImports(source) {
    let changed = false;
    let code = source;
    // In wagmi v3, chains moved from wagmi/chains to viem/chains
    const chainImportPattern = /import\s*\{([^}]*)\}\s*from\s*["']wagmi\/chains["']/g;
    if (code.includes("wagmi/chains")) {
        changed = true;
        code = code.replace(chainImportPattern, (match, imports) => {
            return `/* TODO (AI): In wagmi v3, chains moved to viem/chains */\nimport {${imports}} from "viem/chains"`;
        });
    }
    // Flag @wagmi/core chains imports too
    const coreChainPattern = /import\s*\{([^}]*)\}\s*from\s*["']@wagmi\/core\/chains["']/g;
    if (code.includes("@wagmi/core/chains")) {
        changed = true;
        code = code.replace(coreChainPattern, (match, imports) => {
            return `/* TODO (AI): In wagmi v3, chains moved to viem/chains */\nimport {${imports}} from "viem/chains"`;
        });
    }
    return { code, changed };
}
//# sourceMappingURL=chainImports.js.map
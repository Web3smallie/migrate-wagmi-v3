"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformConnectorPeerDeps = transformConnectorPeerDeps;
function transformConnectorPeerDeps(source) {
    let changed = false;
    let code = source;
    // Map of connectors to their required peer dependencies
    const connectorDeps = {
        coinbaseWallet: "@coinbase/wallet-sdk@^4.3.6",
        metaMask: "@metamask/connect-evm",
        walletConnect: "@walletconnect/universal-provider",
        safe: "@safe-global/safe-apps-sdk",
        injected: "none required",
    };
    for (const [connector, dep] of Object.entries(connectorDeps)) {
        if (dep === "none required")
            continue;
        // Check if this connector is imported from wagmi/connectors
        const importPattern = new RegExp(`\\b${connector}\\b.*from\\s*["']wagmi/connectors["']|from\\s*["']@wagmi/connectors["'].*\\b${connector}\\b`, "g");
        if (code.includes(connector) &&
            (code.includes("wagmi/connectors") ||
                code.includes("@wagmi/connectors")) &&
            !code.includes(`TODO (AI): Install ${dep}`)) {
            changed = true;
            // Add TODO at top of file
            const todoComment = `/* TODO (AI): wagmi v3 - ${connector} connector requires separate peer dependency.
   Run: npm install ${dep}
   See: https://wagmi.sh/react/guides/migrate-from-v2-to-v3#install-connector-dependencies */\n`;
            if (!code.startsWith(todoComment)) {
                code = todoComment + code;
            }
        }
    }
    return { code, changed };
}
//# sourceMappingURL=connectorPeerDeps.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
const glob_1 = require("glob");
const fs = __importStar(require("fs"));
const useAccount_1 = require("./transforms/useAccount");
const useAccountEffect_1 = require("./transforms/useAccountEffect");
const useSwitchAccount_1 = require("./transforms/useSwitchAccount");
const connectorImports_1 = require("./transforms/connectorImports");
const mutateArgs_1 = require("./transforms/mutateArgs");
const importRenames_1 = require("./transforms/importRenames");
const connectorPeerDeps_1 = require("./transforms/connectorPeerDeps");
const mutateRename_1 = require("./transforms/mutateRename");
const wagmiProvider_1 = require("./transforms/wagmiProvider");
const typeLevel_1 = require("./transforms/typeLevel");
const createConfig_1 = require("./transforms/createConfig");
const chainImports_1 = require("./transforms/chainImports");
const wrapperHooks_1 = require("./transforms/wrapperHooks");
const inngestMiddleware_1 = require("./transforms/inngestMiddleware");
async function migrate(targetPath, dryRun = false) {
    const results = [];
    const files = await (0, glob_1.glob)("**/*.{ts,tsx,js,jsx}", {
        cwd: targetPath,
        ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
        absolute: true,
    });
    for (const file of files) {
        const source = fs.readFileSync(file, "utf-8");
        if (!source.includes("wagmi") && !source.includes("inngest"))
            continue;
        let transformed = source;
        const changes = [];
        const todos = [];
        let patternsDetected = 0;
        // wagmi transforms
        const r2 = (0, useAccount_1.transformUseAccount)(transformed);
        if (r2.changed) {
            transformed = r2.code;
            changes.push("useAccount → useConnection");
            patternsDetected++;
        }
        const r3 = (0, useAccountEffect_1.transformUseAccountEffect)(transformed);
        if (r3.changed) {
            transformed = r3.code;
            changes.push("useAccountEffect → useConnectionEffect");
            patternsDetected++;
        }
        const r4 = (0, useSwitchAccount_1.transformUseSwitchAccount)(transformed);
        if (r4.changed) {
            transformed = r4.code;
            changes.push("useSwitchAccount → useSwitchConnection");
            patternsDetected++;
        }
        const r8 = (0, mutateRename_1.transformMutateRename)(transformed);
        if (r8.changed) {
            transformed = r8.code;
            changes.push("Mutation hook functions renamed to mutate/mutateAsync");
            patternsDetected++;
        }
        const r9 = (0, wagmiProvider_1.transformWagmiProvider)(transformed);
        if (r9.changed) {
            transformed = r9.code;
            changes.push("WagmiConfig → WagmiProvider");
            patternsDetected++;
        }
        const r10 = (0, typeLevel_1.transformTypeLevel)(transformed);
        if (r10.changed) {
            transformed = r10.code;
            changes.push("Type-level wagmi renames applied");
            patternsDetected++;
        }
        const r11 = (0, chainImports_1.transformChainImports)(transformed);
        if (r11.changed) {
            transformed = r11.code;
            todos.push("Chain imports moved to viem/chains");
            patternsDetected++;
        }
        const r12 = (0, createConfig_1.transformCreateConfig)(transformed);
        if (r12.changed) {
            transformed = r12.code;
            todos.push("createConfig options need manual review");
            patternsDetected++;
        }
        const r13 = (0, wrapperHooks_1.transformWrapperHooks)(transformed);
        if (r13.changed) {
            transformed = r13.code;
            todos.push("Wrapper hooks flagged for AI review");
            patternsDetected++;
        }
        // Update imports AFTER hook renames
        const r1 = (0, importRenames_1.transformImportRenames)(transformed);
        if (r1.changed) {
            transformed = r1.code;
            changes.push("wagmi imports updated");
            patternsDetected++;
        }
        const r5 = (0, connectorImports_1.transformConnectorImports)(transformed);
        if (r5.changed) {
            transformed = r5.code;
            todos.push("Connector imports need peer dependency updates");
            patternsDetected++;
        }
        const r6 = (0, mutateArgs_1.transformMutateArgs)(transformed);
        if (r6.changed) {
            transformed = r6.code;
            todos.push("Mutation hook args need manual review");
            patternsDetected++;
        }
        const r7 = (0, connectorPeerDeps_1.transformConnectorPeerDeps)(transformed);
        if (r7.changed) {
            transformed = r7.code;
            todos.push("Connector peer dependencies need separate installation");
            patternsDetected++;
        }
        // Inngest transforms
        const r14 = (0, inngestMiddleware_1.transformInngestMiddleware)(transformed);
        if (r14.changed) {
            transformed = r14.code;
            todos.push("Inngest middleware system needs manual review");
            patternsDetected++;
        }
        if (changes.length > 0 || todos.length > 0) {
            if (!dryRun) {
                fs.writeFileSync(file, transformed, "utf-8");
            }
            results.push({ file, changes, todos, patternsDetected });
        }
    }
    const totalChanges = results.reduce((sum, r) => sum + r.changes.length, 0);
    const totalTodos = results.reduce((sum, r) => sum + r.todos.length, 0);
    const totalPatternsDetected = results.reduce((sum, r) => sum + r.patternsDetected, 0);
    const coveragePercent = totalPatternsDetected > 0
        ? Math.round((totalChanges / totalPatternsDetected) * 100)
        : 0;
    return {
        results,
        totalFiles: results.length,
        totalChanges,
        totalTodos,
        totalPatternsDetected,
        coveragePercent,
    };
}
//# sourceMappingURL=index.js.map
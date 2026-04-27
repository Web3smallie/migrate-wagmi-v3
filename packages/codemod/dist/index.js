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
async function migrate(targetPath) {
    const results = [];
    const files = await (0, glob_1.glob)("**/*.{ts,tsx,js,jsx}", {
        cwd: targetPath,
        ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
        absolute: true,
    });
    for (const file of files) {
        const source = fs.readFileSync(file, "utf-8");
        if (!source.includes("wagmi"))
            continue;
        let transformed = source;
        const changes = [];
        const todos = [];
        // Run hook renames BEFORE import renames
        const r2 = (0, useAccount_1.transformUseAccount)(transformed);
        if (r2.changed) {
            transformed = r2.code;
            changes.push("useAccount → useConnection");
        }
        const r3 = (0, useAccountEffect_1.transformUseAccountEffect)(transformed);
        if (r3.changed) {
            transformed = r3.code;
            changes.push("useAccountEffect → useConnectionEffect");
        }
        const r4 = (0, useSwitchAccount_1.transformUseSwitchAccount)(transformed);
        if (r4.changed) {
            transformed = r4.code;
            changes.push("useSwitchAccount → useSwitchConnection");
        }
        // Update imports AFTER hook renames
        const r1 = (0, importRenames_1.transformImportRenames)(transformed);
        if (r1.changed) {
            transformed = r1.code;
            changes.push("wagmi imports updated");
        }
        const r5 = (0, connectorImports_1.transformConnectorImports)(transformed);
        if (r5.changed) {
            transformed = r5.code;
            todos.push("Connector imports need peer dependency updates");
        }
        const r6 = (0, mutateArgs_1.transformMutateArgs)(transformed);
        if (r6.changed) {
            transformed = r6.code;
            todos.push("Mutation hook args need manual review");
        }
        if (changes.length > 0 || todos.length > 0) {
            fs.writeFileSync(file, transformed, "utf-8");
            results.push({ file, changes, todos });
        }
    }
    return results;
}
//# sourceMappingURL=index.js.map
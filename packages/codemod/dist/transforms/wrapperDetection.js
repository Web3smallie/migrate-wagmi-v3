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
exports.buildWrapperMap = buildWrapperMap;
exports.flagWrapperUsages = flagWrapperUsages;
const fs = __importStar(require("fs"));
const DEPRECATED_HOOKS = [
    "useAccount",
    "useAccountEffect",
    "useSwitchAccount",
    "useContractRead",
    "useContractWrite",
    "useNetwork",
    "useSwitchNetwork",
    "useWaitForTransaction",
];
// Pass 1: Build a map of all wrapper functions across all files
function buildWrapperMap(files) {
    const wrapperMap = {};
    for (const file of files) {
        const source = fs.readFileSync(file, "utf-8");
        for (const hook of DEPRECATED_HOOKS) {
            if (!source.includes(hook))
                continue;
            // Detect: export const useMyHook = () => { ... useAccount() ... }
            const wrapperPattern = new RegExp(`(?:export\\s+)?(?:const|function)\\s+(use\\w+)\\s*[=:]?[^{]*\\{[^}]*\\b${hook}\\b[^}]*\\}`, "gs");
            let match;
            while ((match = wrapperPattern.exec(source)) !== null) {
                const wrapperName = match[1];
                if (wrapperName && wrapperName !== hook) {
                    wrapperMap[wrapperName] = hook;
                }
            }
        }
    }
    return wrapperMap;
}
// Pass 2: Flag usages of wrapper hooks in all files
function flagWrapperUsages(source, wrapperMap) {
    let changed = false;
    let code = source;
    const flagged = [];
    for (const [wrapperName, deprecatedHook] of Object.entries(wrapperMap)) {
        if (!code.includes(wrapperName))
            continue;
        // Only flag call sites not definitions
        const usagePattern = new RegExp(`(?<!function\\s)(?<!const\\s\\w+\\s*=\\s*)\\b${wrapperName}\\s*\\(`, "g");
        if (usagePattern.test(code)) {
            changed = true;
            flagged.push(wrapperName);
            code = code.replace(new RegExp(`(${wrapperName}\\s*\\()`, "g"), `/* @codemod-ai-advice: '${wrapperName}' wraps deprecated wagmi v2 '${deprecatedHook}'.
   Action: Update internal logic of '${wrapperName}' to use '${deprecatedHook.replace("useAccount", "useConnection").replace("useNetwork", "useChains").replace("useSwitchNetwork", "useSwitchChain")}' and verify all property access. */
$1`);
        }
    }
    return { code, changed, flagged };
}
//# sourceMappingURL=wrapperDetection.js.map
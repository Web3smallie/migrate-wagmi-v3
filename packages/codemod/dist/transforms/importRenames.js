"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformImportRenames = transformImportRenames;
function transformImportRenames(source) {
    let changed = false;
    let code = source;
    // Update named imports from wagmi
    const renames = {
        useAccount: "useConnection",
        useAccountEffect: "useConnectionEffect",
        useSwitchAccount: "useSwitchConnection",
    };
    // Find wagmi imports and update renamed hooks inside them
    const importPattern = /import\s*\{([^}]*)\}\s*from\s*["']wagmi["']/g;
    code = code.replace(importPattern, (match, imports) => {
        let newImports = imports;
        let wasChanged = false;
        for (const [oldName, newName] of Object.entries(renames)) {
            if (newImports.includes(oldName)) {
                newImports = newImports.replace(new RegExp(`\\b${oldName}\\b`, "g"), newName);
                wasChanged = true;
            }
        }
        if (wasChanged) {
            changed = true;
            return match.replace(imports, newImports);
        }
        return match;
    });
    return { code, changed };
}
//# sourceMappingURL=importRenames.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTypeLevel = transformTypeLevel;
function transformTypeLevel(source) {
    let changed = false;
    let code = source;
    const typeRenames = {
        UseAccountReturnType: "UseConnectionReturnType",
        UseAccountParameters: "UseConnectionParameters",
        UseAccountEffectParameters: "UseConnectionEffectParameters",
        UseSwitchAccountReturnType: "UseSwitchConnectionReturnType",
        UseSwitchAccountParameters: "UseSwitchConnectionParameters",
    };
    for (const [oldType, newType] of Object.entries(typeRenames)) {
        if (code.includes(oldType)) {
            changed = true;
            code = code.replace(new RegExp(`\\b${oldType}\\b`, "g"), newType);
        }
    }
    return { code, changed };
}
//# sourceMappingURL=typeLevel.js.map
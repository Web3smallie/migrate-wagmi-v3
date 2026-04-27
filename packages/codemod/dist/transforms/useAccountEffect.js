"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUseAccountEffect = transformUseAccountEffect;
function transformUseAccountEffect(source) {
    let changed = false;
    let code = source;
    // useAccountEffect → useConnectionEffect
    if (code.includes("useAccountEffect")) {
        changed = true;
        code = code.replace(/\buseAccountEffect\b/g, "useConnectionEffect");
    }
    return { code, changed };
}
//# sourceMappingURL=useAccountEffect.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUseAccount = transformUseAccount;
function transformUseAccount(source) {
    let changed = false;
    let code = source;
    // useAccount → useConnection (but NOT useAccountEffect)
    const pattern = /\buseAccount\b(?!Effect)/g;
    if (pattern.test(code)) {
        changed = true;
        code = code.replace(/\buseAccount\b(?!Effect)/g, "useConnection");
    }
    return { code, changed };
}
//# sourceMappingURL=useAccount.js.map
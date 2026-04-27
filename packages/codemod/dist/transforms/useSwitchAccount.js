"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUseSwitchAccount = transformUseSwitchAccount;
function transformUseSwitchAccount(source) {
    let changed = false;
    let code = source;
    // useSwitchAccount → useSwitchConnection
    if (code.includes("useSwitchAccount")) {
        changed = true;
        code = code.replace(/\buseSwitchAccount\b/g, "useSwitchConnection");
    }
    return { code, changed };
}
//# sourceMappingURL=useSwitchAccount.js.map
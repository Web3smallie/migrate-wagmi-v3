"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformServeHost = transformServeHost;
function transformServeHost(source) {
    let changed = false;
    // Replace serveHost with serveOrigin in code
    let code = source;
    if (source.includes("serveHost")) {
        changed = true;
        code = code.replace(/serveHost/g, "serveOrigin");
    }
    // Replace INNGEST_SERVE_HOST env var references in comments/strings
    if (code.includes("INNGEST_SERVE_HOST")) {
        changed = true;
        code = code.replace(/INNGEST_SERVE_HOST/g, "INNGEST_SERVE_ORIGIN");
    }
    return { code, changed };
}
//# sourceMappingURL=serveHost.js.map
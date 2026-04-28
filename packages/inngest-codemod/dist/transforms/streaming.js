"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformStreaming = transformStreaming;
function transformStreaming(source) {
    let changed = false;
    let code = source;
    // Replace streaming: "force" with streaming: true
    if (code.includes(`streaming: "force"`)) {
        changed = true;
        code = code.replace(/streaming:\s*"force"/g, "streaming: true");
    }
    // Replace streaming: 'force' with streaming: true
    if (code.includes(`streaming: 'force'`)) {
        changed = true;
        code = code.replace(/streaming:\s*'force'/g, "streaming: true");
    }
    // Replace streaming: "allow" with streaming: true
    if (code.includes(`streaming: "allow"`)) {
        changed = true;
        code = code.replace(/streaming:\s*"allow"/g, "streaming: true");
    }
    // Replace streaming: 'allow' with streaming: true
    if (code.includes(`streaming: 'allow'`)) {
        changed = true;
        code = code.replace(/streaming:\s*'allow'/g, "streaming: true");
    }
    return { code, changed };
}
//# sourceMappingURL=streaming.js.map
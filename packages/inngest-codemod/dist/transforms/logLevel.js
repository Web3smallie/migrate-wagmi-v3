"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformLogLevel = transformLogLevel;
function transformLogLevel(source) {
    let changed = false;
    let code = source;
    // Match logLevel option inside Inngest constructor or serve()
    const pattern = /,?\s*logLevel\s*:\s*["'][^"']*["']\s*,?/g;
    if (code.includes("logLevel")) {
        changed = true;
        code = code.replace(pattern, (match) => {
            // Extract the log level value for the TODO comment
            const levelMatch = match.match(/logLevel\s*:\s*["']([^"']*)["']/);
            const level = levelMatch ? levelMatch[1] : "debug";
            return ` /* TODO (AI): logLevel removed in v4. Replace with: logger: new ConsoleLogger({ level: "${level}" }) — import ConsoleLogger from "inngest" */`;
        });
    }
    return { code, changed };
}
//# sourceMappingURL=logLevel.js.map
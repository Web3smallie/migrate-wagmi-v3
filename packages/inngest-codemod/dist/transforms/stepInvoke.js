"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformStepInvoke = transformStepInvoke;
function transformStepInvoke(source) {
    let changed = false;
    let code = source;
    // Match step.invoke("step-name", { function: "string-id", ... })
    // Where function value is a plain string (not referenceFunction or a variable)
    const pattern = /step\.invoke\s*\(\s*["'][^"']*["']\s*,\s*\{([^}]*function\s*:\s*["'][^"']*["'][^}]*)\}\s*\)/g;
    code = code.replace(pattern, (match, inner) => {
        // Check if function value is a plain string
        const fnMatch = inner.match(/function\s*:\s*["']([^"']*)["']/);
        if (!fnMatch)
            return match;
        changed = true;
        const fnId = fnMatch[1];
        // Try to split appId-functionId if it follows the pattern
        const parts = fnId.split("-");
        const functionId = parts[parts.length - 1];
        const appId = parts.slice(0, -1).join("-") || "my-app";
        const newInner = inner.replace(/function\s*:\s*["'][^"']*["']/, `function: referenceFunction({ appId: "${appId}", functionId: "${functionId}" })`);
        return match.replace(inner, newInner);
    });
    // Add referenceFunction import if we made changes
    if (changed && !code.includes("referenceFunction")) {
        code = code.replace(/import\s*\{([^}]*)\}\s*from\s*["']inngest["']/, (match, imports) => {
            return match.replace(imports, `${imports.trimEnd()}, referenceFunction`);
        });
    }
    return { code, changed };
}
//# sourceMappingURL=stepInvoke.js.map
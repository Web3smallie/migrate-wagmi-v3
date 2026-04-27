"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformEventSchemas = transformEventSchemas;
function transformEventSchemas(source) {
    let changed = false;
    let code = source;
    // Detect EventSchemas usage
    if (code.includes("EventSchemas")) {
        changed = true;
        // Add TODO comment above the EventSchemas instantiation
        code = code.replace(/new\s+EventSchemas\s*\(\s*\)/g, `/* TODO (AI): EventSchemas removed in v4. Migrate to eventType() or staticSchema().
       * See: https://www.inngest.com/docs/reference/typescript/v4/migrations/v3-to-v4
       * Example:
       *   const userCreated = eventType("user/created", {
       *     schema: staticSchema<{ userId: string; email: string }>()
       *   });
       */ new EventSchemas()`);
        // Flag the import too
        code = code.replace(/import\s*\{([^}]*EventSchemas[^}]*)\}\s*from\s*["']inngest["']/g, (match) => {
            return `/* TODO (AI): Remove EventSchemas import and replace with eventType, staticSchema */\n${match}`;
        });
    }
    return { code, changed };
}
//# sourceMappingURL=eventSchemas.js.map
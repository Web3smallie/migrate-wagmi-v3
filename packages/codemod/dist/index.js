"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
const glob_1 = require("glob");
const fs = __importStar(require("fs"));
const createFunction_1 = require("./transforms/createFunction");
const serveOptions_1 = require("./transforms/serveOptions");
const serveHost_1 = require("./transforms/serveHost");
const streaming_1 = require("./transforms/streaming");
const stepInvoke_1 = require("./transforms/stepInvoke");
const logLevel_1 = require("./transforms/logLevel");
const gatewayEndpoint_1 = require("./transforms/gatewayEndpoint");
const eventSchemas_1 = require("./transforms/eventSchemas");
async function migrate(targetPath) {
    const results = [];
    const files = await (0, glob_1.glob)("**/*.{ts,tsx,js,jsx}", {
        cwd: targetPath,
        ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
        absolute: true,
    });
    for (const file of files) {
        const source = fs.readFileSync(file, "utf-8");
        if (!source.includes("inngest"))
            continue;
        let transformed = source;
        const changes = [];
        const todos = [];
        const r1 = (0, createFunction_1.transformCreateFunction)(transformed);
        if (r1.changed) {
            transformed = r1.code;
            changes.push("createFunction trigger moved to options");
        }
        const r2 = (0, serveOptions_1.transformServeOptions)(transformed);
        if (r2.changed) {
            transformed = r2.code;
            changes.push("serve options moved to client");
        }
        const r3 = (0, serveHost_1.transformServeHost)(transformed);
        if (r3.changed) {
            transformed = r3.code;
            changes.push("serveHost renamed to serveOrigin");
        }
        const r4 = (0, streaming_1.transformStreaming)(transformed);
        if (r4.changed) {
            transformed = r4.code;
            changes.push("streaming option simplified");
        }
        const r5 = (0, stepInvoke_1.transformStepInvoke)(transformed);
        if (r5.changed) {
            transformed = r5.code;
            changes.push("step.invoke string ID replaced");
        }
        const r6 = (0, logLevel_1.transformLogLevel)(transformed);
        if (r6.changed) {
            transformed = r6.code;
            todos.push("logLevel removed - configure via logger option");
        }
        const r7 = (0, gatewayEndpoint_1.transformGatewayEndpoint)(transformed);
        if (r7.changed) {
            transformed = r7.code;
            changes.push("rewriteGatewayEndpoint replaced with gatewayUrl");
        }
        const r8 = (0, eventSchemas_1.transformEventSchemas)(transformed);
        if (r8.changed) {
            transformed = r8.code;
            todos.push("EventSchemas removed - migrate to eventType()");
        }
        if (changes.length > 0 || todos.length > 0) {
            fs.writeFileSync(file, transformed, "utf-8");
            results.push({ file, changes, todos });
        }
    }
    return results;
}
//# sourceMappingURL=index.js.map
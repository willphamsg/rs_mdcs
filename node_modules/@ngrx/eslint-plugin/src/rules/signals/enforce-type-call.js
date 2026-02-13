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
exports.enforceTypeCall = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.enforceTypeCall = 'enforceTypeCall';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'problem',
        docs: {
            description: 'The `type` function must be called.',
            ngrxModule: 'signals',
        },
        fixable: 'code',
        schema: [],
        messages: {
            [exports.enforceTypeCall]: 'The `{{name}}` function must be called.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        // It's possible that we have multiple type import aliases, so we need to track them all.
        const typeNames = new Set();
        return {
            [`ImportDeclaration[source.value='@ngrx/signals'] ImportSpecifier[imported.name='type']`](node) {
                typeNames.add(node.local.name);
            },
            TSInstantiationExpression(node) {
                const expression = node.expression;
                if ((0, utils_1.isIdentifier)(expression) &&
                    typeNames.has(expression.name) &&
                    !(0, utils_1.isCallExpression)(node.parent)) {
                    context.report({
                        node: expression,
                        messageId: exports.enforceTypeCall,
                        data: { name: expression.name },
                        fix: (fixer) => fixer.insertTextAfter(node, '()'),
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=enforce-type-call.js.map
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
exports.onFunctionExplicitReturnTypeSuggest = exports.onFunctionExplicitReturnType = void 0;
const utils_1 = require("@typescript-eslint/utils");
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_2 = require("../../utils");
exports.onFunctionExplicitReturnType = 'onFunctionExplicitReturnType';
exports.onFunctionExplicitReturnTypeSuggest = 'onFunctionExplicitReturnTypeSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: '`On` function should have an explicit return type.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.onFunctionExplicitReturnType]: '`On` functions should have an explicit return type when using arrow functions: `on(action, (state): State => {}`.',
            [exports.onFunctionExplicitReturnTypeSuggest]: 'Add the explicit return type `State` (if the interface/type is named differently you need to manually correct the return type).',
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            [utils_2.onFunctionWithoutType](node) {
                context.report({
                    node,
                    messageId: exports.onFunctionExplicitReturnType,
                    suggest: [
                        {
                            messageId: exports.onFunctionExplicitReturnTypeSuggest,
                            fix: (fixer) => getFixes(node, context.sourceCode, fixer),
                        },
                    ],
                });
            },
        };
    },
});
function getFixes(node, sourceCode, fixer) {
    const { params } = node;
    if (params.length === 0) {
        const [, closingParen] = sourceCode.getTokens(node);
        return fixer.insertTextAfter(closingParen, ': State');
    }
    const [firstParam] = params;
    const lastParam = (0, utils_2.getLast)(params);
    const previousToken = sourceCode.getTokenBefore(firstParam);
    const isParenthesized = previousToken && utils_1.ASTUtils.isOpeningParenToken(previousToken);
    if (isParenthesized) {
        const nextToken = sourceCode.getTokenAfter(lastParam);
        return fixer.insertTextAfter(nextToken ?? lastParam, ': State');
    }
    return [
        fixer.insertTextBefore(firstParam, '('),
        fixer.insertTextAfter(lastParam, '): State'),
    ];
}
//# sourceMappingURL=on-function-explicit-return-type.js.map
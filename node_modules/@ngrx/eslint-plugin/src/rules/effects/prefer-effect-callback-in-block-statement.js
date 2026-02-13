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
exports.messageId = void 0;
const utils_1 = require("@typescript-eslint/utils");
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_2 = require("../../utils");
exports.messageId = 'preferEffectCallbackInBlockStatement';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'A block statement is easier to troubleshoot.',
            ngrxModule: 'effects',
        },
        schema: [],
        messages: {
            [exports.messageId]: 'The callback of `Effect` should be wrapped in a block statement.',
        },
        fixable: 'code',
    },
    defaultOptions: [],
    create: (context) => {
        const nonParametrizedEffect = `${utils_2.createEffectExpression} > ArrowFunctionExpression > .body[type!=/^(ArrowFunctionExpression|BlockStatement)$/]`;
        const parametrizedEffect = `${utils_2.createEffectExpression} > ArrowFunctionExpression > ArrowFunctionExpression > .body[type!='BlockStatement']`;
        const parametrizedEffectWithinBlockStatement = `${utils_2.createEffectExpression} > ArrowFunctionExpression > BlockStatement > ReturnStatement > ArrowFunctionExpression > .body[type!='BlockStatement']`;
        return {
            [`${nonParametrizedEffect}, ${parametrizedEffect}, ${parametrizedEffectWithinBlockStatement}`](node) {
                context.report({
                    node,
                    messageId: exports.messageId,
                    fix: (fixer) => {
                        const [previousNode, nextNode] = getSafeNodesToApplyFix(context.sourceCode, node);
                        return [
                            fixer.insertTextBefore(previousNode, `{ return `),
                            fixer.insertTextAfter(nextNode, ` }`),
                        ];
                    },
                });
            },
        };
    },
});
function getSafeNodesToApplyFix(sourceCode, node) {
    const previousToken = sourceCode.getTokenBefore(node);
    const nextToken = sourceCode.getTokenAfter(node);
    if (previousToken &&
        utils_1.ASTUtils.isOpeningParenToken(previousToken) &&
        nextToken &&
        utils_1.ASTUtils.isClosingParenToken(nextToken)) {
        return [previousToken, nextToken];
    }
    return [node, node];
}
//# sourceMappingURL=prefer-effect-callback-in-block-statement.js.map
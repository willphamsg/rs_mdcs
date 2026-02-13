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
exports.messageId = 'noMultipleActionsInEffects';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'problem',
        docs: {
            description: '`Effect` should not return multiple actions.',
            ngrxModule: 'effects',
            requiresTypeChecking: true,
        },
        schema: [],
        messages: {
            [exports.messageId]: '`Effect` should return a single action.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            [`${utils_2.createEffectExpression} ${utils_2.mapLikeOperatorCallExpressions}`](node) {
                const nodeToReport = getNodeToReport(node);
                if (!nodeToReport) {
                    return;
                }
                const services = utils_1.ESLintUtils.getParserServices(context);
                const typeChecker = services.program.getTypeChecker();
                const type = services.getTypeAtLocation(nodeToReport);
                if (typeChecker.isArrayType(type)) {
                    context.report({
                        node: nodeToReport,
                        messageId: exports.messageId,
                    });
                }
                else if (type.isUnion() &&
                    type.types.some((ut) => typeChecker.isArrayType(ut))) {
                    context.report({
                        node: nodeToReport,
                        messageId: exports.messageId,
                    });
                }
            },
        };
    },
});
function getNodeToReport(node) {
    switch (node.type) {
        case utils_1.AST_NODE_TYPES.ArrowFunctionExpression:
        case utils_1.AST_NODE_TYPES.FunctionExpression:
            return (0, utils_2.isBlockStatement)(node.body)
                ? findReturnStatement(node.body.body)
                : node.body;
        case utils_1.AST_NODE_TYPES.CallExpression:
            return findReturnStatement(node.arguments) ?? node.arguments[0];
        default:
            return node.argument;
    }
}
function findReturnStatement(nodes) {
    const returnNode = nodes.find((n) => (0, utils_2.isReturnStatement)(n));
    return returnNode?.argument;
}
//# sourceMappingURL=no-multiple-actions-in-effects.js.map
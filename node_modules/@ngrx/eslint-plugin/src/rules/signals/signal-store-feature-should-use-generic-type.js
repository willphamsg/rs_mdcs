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
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.messageId = 'signalStoreFeatureShouldUseGenericType';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'problem',
        docs: {
            description: `A custom Signal Store feature that accepts an input should define a generic type.`,
            ngrxModule: 'signals',
        },
        fixable: 'code',
        schema: [],
        messages: {
            [exports.messageId]: `Add an unused generic type to the function creating the signal store feature.`,
        },
    },
    defaultOptions: [],
    create: (context) => {
        function report(signalStoreFeature, func) {
            if (!func ||
                (!(0, utils_1.isFunctionDeclaration)(func) && !(0, utils_1.isArrowFunctionExpression)(func))) {
                return;
            }
            const parentHasGenerics = func.typeParameters && func.typeParameters.params.length > 0;
            if (!parentHasGenerics) {
                context.report({
                    node: signalStoreFeature.callee,
                    messageId: exports.messageId,
                    fix(fixer) {
                        if ((0, utils_1.isFunctionDeclaration)(func)) {
                            if (func.id) {
                                return fixer.insertTextAfter(func.id, '<_>');
                            }
                        }
                        return fixer.insertTextBefore(func, '<_>');
                    },
                });
            }
        }
        function hasInputAsArgument(node) {
            const [inputArg] = node.arguments;
            return (!(0, utils_1.isCallExpression)(inputArg) ||
                ((0, utils_1.isIdentifier)(inputArg.callee) && inputArg.callee.name === 'type'));
        }
        return {
            [`ArrowFunctionExpression > CallExpression[callee.name=signalStoreFeature]`](node) {
                if (hasInputAsArgument(node)) {
                    report(node, node.parent);
                }
            },
            [`ArrowFunctionExpression > BlockStatement CallExpression[callee.name=signalStoreFeature]`](node) {
                if (hasInputAsArgument(node)) {
                    let parent = node.parent;
                    while (parent && !(0, utils_1.isArrowFunctionExpression)(parent)) {
                        parent = parent.parent;
                    }
                    report(node, parent);
                }
            },
            [`FunctionDeclaration > BlockStatement CallExpression[callee.name=signalStoreFeature]`](node) {
                if (hasInputAsArgument(node)) {
                    let parent = node.parent;
                    while (parent && !(0, utils_1.isFunctionDeclaration)(parent)) {
                        parent = parent.parent;
                    }
                    report(node, parent);
                }
            },
        };
    },
});
//# sourceMappingURL=signal-store-feature-should-use-generic-type.js.map
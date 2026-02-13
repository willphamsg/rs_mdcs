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
const ts = __importStar(require("typescript"));
const rule_creator_1 = require("../../rule-creator");
const utils_2 = require("../../utils");
exports.messageId = 'avoidCyclicEffects';
// This rule is a modified version (to support dispatch: false) from the eslint-plugin-rxjs plugin.
// The original implementation can be found at https://github.com/cartant/eslint-plugin-rxjs/blob/main/source/rules/no-cyclic-action.ts
// Thank you Nicholas Jamieson (@cartant).
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'problem',
        docs: {
            description: 'Avoid `Effect` that re-emit filtered actions.',
            ngrxModule: 'effects',
            requiresTypeChecking: true,
        },
        schema: [],
        messages: {
            [exports.messageId]: '`Effect` that re-emit filtered actions are forbidden.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        const { identifiers = [] } = (0, utils_2.getNgRxEffectActions)(context);
        const actionsNames = identifiers.length > 0 ? (0, utils_2.asPattern)(identifiers) : null;
        if (!actionsNames) {
            return {};
        }
        const services = utils_1.ESLintUtils.getParserServices(context);
        const typeChecker = services.program.getTypeChecker();
        function checkNode(pipeCallExpression) {
            const operatorCallExpression = pipeCallExpression.arguments.find((arg) => (0, utils_2.isCallExpression)(arg) &&
                (0, utils_2.isIdentifier)(arg.callee) &&
                arg.callee.name === 'ofType');
            if (!operatorCallExpression) {
                return;
            }
            const operatorType = services.getTypeAtLocation(operatorCallExpression);
            const [signature] = typeChecker.getSignaturesOfType(operatorType, ts.SignatureKind.Call);
            if (!signature) {
                return;
            }
            const operatorReturnType = typeChecker.getReturnTypeOfSignature(signature);
            if (!(0, utils_2.isTypeReference)(operatorReturnType)) {
                return;
            }
            const [operatorElementType] = typeChecker.getTypeArguments(operatorReturnType);
            if (!operatorElementType) {
                return;
            }
            const pipeType = services.getTypeAtLocation(pipeCallExpression);
            if (!(0, utils_2.isTypeReference)(pipeType)) {
                return;
            }
            const [pipeElementType] = typeChecker.getTypeArguments(pipeType);
            if (!pipeElementType) {
                return;
            }
            const operatorActionTypes = getActionTypes(operatorElementType);
            const pipeActionTypes = getActionTypes(pipeElementType);
            for (const actionType of operatorActionTypes) {
                if (pipeActionTypes.includes(actionType)) {
                    context.report({
                        node: pipeCallExpression.callee,
                        messageId: exports.messageId,
                    });
                    return;
                }
            }
        }
        function getActionType(symbol) {
            const { valueDeclaration } = symbol;
            if (!valueDeclaration) {
                return null;
            }
            if (valueDeclaration.kind === ts.SyntaxKind.PropertyDeclaration) {
                const { parent } = symbol;
                return parent.valueDeclaration
                    ? typeChecker.getTypeOfSymbolAtLocation(parent, parent.valueDeclaration)
                    : null;
            }
            return typeChecker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
        }
        function getActionTypes(type) {
            if (type.isUnion()) {
                const memberActionTypes = [];
                for (const memberType of type.types) {
                    memberActionTypes.push(...getActionTypes(memberType));
                }
                return memberActionTypes;
            }
            const symbol = typeChecker.getPropertyOfType(type, 'type');
            if (!symbol) {
                return [];
            }
            const actionType = getActionType(symbol);
            if (!actionType) {
                return [];
            }
            // TODO: support "dynamic" types
            // e.g. const genericFoo = createAction(`${subject} FOO`); (resolves to 'string')
            if (typeChecker.typeToString(actionType) === 'string') {
                return [];
            }
            return [typeChecker.typeToString(actionType)];
        }
        let firstPipe = true;
        return {
            [`${utils_2.createEffectExpression}:not([arguments.1]:has(Property[key.name='dispatch'][value.value=false])) CallExpression[callee.property.name='pipe'][callee.object.property.name=${actionsNames}]`](node) {
                if (firstPipe) {
                    checkNode(node);
                    firstPipe = false;
                    return;
                }
            },
            [`${utils_2.createEffectExpression}:not([arguments.1]:has(Property[key.name='dispatch'][value.value=false])) CallExpression[callee.property.name='pipe']:exit`]() {
                firstPipe = true;
            },
        };
    },
});
//# sourceMappingURL=avoid-cyclic-effects.js.map
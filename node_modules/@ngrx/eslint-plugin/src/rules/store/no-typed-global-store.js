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
exports.noTypedStoreSuggest = exports.noTypedStore = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.noTypedStore = 'noTypedStore';
exports.noTypedStoreSuggest = 'noTypedStoreSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: 'The global store should not be typed.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.noTypedStore]: '`Store` should not be typed, use `Store` (without generic) instead.',
            [exports.noTypedStoreSuggest]: 'Remove generic from `Store`.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            Program() {
                const { identifiers = [] } = (0, utils_1.getNgRxStores)(context);
                for (const identifier of identifiers) {
                    // using inject()
                    if (!identifier.typeAnnotation) {
                        const { parent } = identifier;
                        if ((0, utils_1.isPropertyDefinition)(parent) &&
                            parent.value &&
                            (0, utils_1.isCallExpression)(parent.value) &&
                            parent.value.arguments.length) {
                            const [storeArgument] = parent.value.arguments;
                            if ((0, utils_1.isTSInstantiationExpression)(storeArgument)) {
                                report(storeArgument.typeArguments);
                            }
                        }
                        continue;
                    }
                    if (!(0, utils_1.isTSTypeReference)(identifier.typeAnnotation.typeAnnotation) ||
                        !identifier.typeAnnotation.typeAnnotation.typeArguments) {
                        continue;
                    }
                    report(identifier.typeAnnotation.typeAnnotation.typeArguments);
                }
            },
        };
        function report(typeArguments) {
            context.report({
                node: typeArguments,
                messageId: exports.noTypedStore,
                suggest: [
                    {
                        messageId: exports.noTypedStoreSuggest,
                        fix: (fixer) => fixer.remove(typeArguments),
                    },
                ],
            });
        }
    },
});
//# sourceMappingURL=no-typed-global-store.js.map
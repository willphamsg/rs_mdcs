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
exports.preferProtectedStateSuggest = exports.preferProtectedState = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
exports.preferProtectedState = 'preferProtectedState';
exports.preferProtectedStateSuggest = 'preferProtectedStateSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: `A Signal Store prefers protected state`,
            ngrxModule: 'signals',
        },
        schema: [],
        messages: {
            [exports.preferProtectedState]: '{ protectedState: false } should be removed to prevent external state mutations.',
            [exports.preferProtectedStateSuggest]: 'Remove `{protectedState: false}`.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            [`CallExpression[callee.name=signalStore][arguments.length>0] > ObjectExpression[properties.length>0] > Property[key.name=protectedState][value.value=false]`](node) {
                context.report({
                    node,
                    messageId: exports.preferProtectedState,
                    suggest: [
                        {
                            messageId: exports.preferProtectedStateSuggest,
                            fix: (fixer) => {
                                const getRangeToBeRemoved = () => {
                                    const parentObject = node.parent;
                                    const parentObjectHasOnlyOneProperty = parentObject.properties.length === 1;
                                    if (parentObjectHasOnlyOneProperty) {
                                        /**
                                         * Remove the entire object if it contains only one property - the relevant one
                                         */
                                        return parentObject.range;
                                    }
                                    const tokenAfter = context.sourceCode.getTokenAfter(node);
                                    const tokenAfterIsComma = tokenAfter?.value?.trim() === ',';
                                    /**
                                     * Remove the specific property if there is more than one property in the parent
                                     */
                                    return [
                                        node.range[0],
                                        /**
                                         *  remove trailing comma as well
                                         */
                                        tokenAfterIsComma ? tokenAfter.range[1] : node.range[1],
                                    ];
                                };
                                return fixer.removeRange(getRangeToBeRemoved());
                            },
                        },
                    ],
                });
            },
        };
    },
});
//# sourceMappingURL=prefer-protected-state.js.map
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
exports.avoidDuplicateActionsInReducerSuggest = exports.avoidDuplicateActionsInReducer = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.avoidDuplicateActionsInReducer = 'avoidDuplicateActionsInReducer';
exports.avoidDuplicateActionsInReducerSuggest = 'avoidDuplicateActionsInReducerSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: 'A `Reducer` should handle an `Action` once.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.avoidDuplicateActionsInReducer]: 'The `Reducer` handles a duplicate `Action` `{{ actionName }}`.',
            [exports.avoidDuplicateActionsInReducerSuggest]: 'Remove this duplication.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        const collectedActions = new Map();
        return {
            [`${utils_1.createReducer} > CallExpression[callee.name='on'][arguments.0.type='Identifier']`]({ arguments: [action], }) {
                const actions = collectedActions.get(action.name) ?? [];
                collectedActions.set(action.name, [...actions, action]);
            },
            [`${utils_1.createReducer}:exit`]() {
                for (const [actionName, identifiers] of collectedActions) {
                    if (identifiers.length <= 1) {
                        break;
                    }
                    for (const node of identifiers) {
                        context.report({
                            node,
                            messageId: exports.avoidDuplicateActionsInReducer,
                            data: {
                                actionName,
                            },
                            suggest: [
                                {
                                    messageId: exports.avoidDuplicateActionsInReducerSuggest,
                                    fix: (fixer) => (0, utils_1.getNodeToCommaRemoveFix)(context.sourceCode, fixer, node.parent),
                                },
                            ],
                        });
                    }
                }
                collectedActions.clear();
            },
        };
    },
});
//# sourceMappingURL=avoid-duplicate-actions-in-reducer.js.map
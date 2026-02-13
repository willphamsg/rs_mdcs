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
exports.noDispatchInEffectsSuggest = exports.noDispatchInEffects = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.noDispatchInEffects = 'noDispatchInEffects';
exports.noDispatchInEffectsSuggest = 'noDispatchInEffectsSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: '`Effect` should not call `store.dispatch`.',
            ngrxModule: 'effects',
        },
        schema: [],
        messages: {
            [exports.noDispatchInEffects]: 'Calling `store.dispatch` in `Effect` is forbidden.',
            [exports.noDispatchInEffectsSuggest]: 'Remove `store.dispatch`.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        const { identifiers = [] } = (0, utils_1.getNgRxStores)(context);
        const storeNames = identifiers.length > 0 ? (0, utils_1.asPattern)(identifiers) : null;
        if (!storeNames) {
            return {};
        }
        return {
            [(0, utils_1.dispatchInEffects)(storeNames)](node) {
                const nodeToReport = getNodeToReport(node);
                context.report({
                    node: nodeToReport,
                    messageId: exports.noDispatchInEffects,
                    suggest: [
                        {
                            messageId: exports.noDispatchInEffectsSuggest,
                            fix: (fixer) => fixer.remove(nodeToReport),
                        },
                    ],
                });
            },
        };
    },
});
function getNodeToReport(node) {
    const { parent } = node;
    const { parent: grandParent } = parent;
    return grandParent &&
        ((0, utils_1.isArrowFunctionExpression)(grandParent) || (0, utils_1.isReturnStatement)(grandParent))
        ? node
        : parent;
}
//# sourceMappingURL=no-dispatch-in-effects.js.map
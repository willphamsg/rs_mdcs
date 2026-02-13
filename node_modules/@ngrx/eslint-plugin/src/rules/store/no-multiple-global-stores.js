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
exports.noMultipleGlobalStoresSuggest = exports.noMultipleGlobalStores = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.noMultipleGlobalStores = 'noMultipleGlobalStores';
exports.noMultipleGlobalStoresSuggest = 'noMultipleGlobalStoresSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: 'There should only be one global store injected.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.noMultipleGlobalStores]: 'Global store should be injected only once.',
            [exports.noMultipleGlobalStoresSuggest]: 'Remove this reference.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            Program() {
                const { identifiers = [], sourceCode } = (0, utils_1.getNgRxStores)(context);
                const flattenedIdentifiers = groupBy(identifiers).values();
                for (const identifiers of flattenedIdentifiers) {
                    if (identifiers.length <= 1) {
                        continue;
                    }
                    for (const node of identifiers) {
                        const nodeToReport = getNodeToReport(node);
                        context.report({
                            node: nodeToReport,
                            messageId: exports.noMultipleGlobalStores,
                            suggest: [
                                {
                                    messageId: exports.noMultipleGlobalStoresSuggest,
                                    fix: (fixer) => getFixes(sourceCode, fixer, nodeToReport),
                                },
                            ],
                        });
                    }
                }
            },
        };
    },
});
function getNodeToReport(node) {
    return node.parent && (0, utils_1.isTSParameterProperty)(node.parent) ? node.parent : node;
}
function getFixes(sourceCode, fixer, node) {
    const { parent } = node;
    const nodeToRemove = parent && (0, utils_1.isTSParameterProperty)(parent) ? parent : node;
    return (0, utils_1.getNodeToCommaRemoveFix)(sourceCode, fixer, nodeToRemove);
}
function groupBy(identifiers) {
    return identifiers.reduce((accumulator, identifier) => {
        const parent = (0, utils_1.isTSParameterProperty)(identifier.parent)
            ? identifier.parent.parent
            : identifier.parent;
        const collectedIdentifiers = accumulator.get(parent);
        return accumulator.set(parent, [
            ...(collectedIdentifiers ?? []),
            identifier,
        ]);
    }, new Map());
}
//# sourceMappingURL=no-multiple-global-stores.js.map
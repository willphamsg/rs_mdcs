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
exports.useConsistentGlobalStoreNameSuggest = exports.useConsistentGlobalStoreName = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.useConsistentGlobalStoreName = 'useConsistentGlobalStoreName';
exports.useConsistentGlobalStoreNameSuggest = 'useConsistentGlobalStoreNameSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: 'Use a consistent name for the global store.',
            ngrxModule: 'store',
        },
        schema: [
            {
                type: 'string',
            },
        ],
        messages: {
            [exports.useConsistentGlobalStoreName]: 'Global store should be named as `{{ storeName }}`.',
            [exports.useConsistentGlobalStoreNameSuggest]: 'Rename it to `{{ storeName }}`.',
        },
    },
    defaultOptions: ['store'],
    create: (context, [storeName]) => {
        return {
            Program() {
                const { identifiers = [] } = (0, utils_1.getNgRxStores)(context);
                for (const { loc, name, range, typeAnnotation } of identifiers) {
                    if (name === storeName) {
                        return;
                    }
                    const data = { storeName };
                    context.report({
                        loc: {
                            ...loc,
                            end: {
                                ...loc.start,
                                column: loc.start.column + name.length,
                            },
                        },
                        messageId: exports.useConsistentGlobalStoreName,
                        data,
                        suggest: [
                            {
                                messageId: exports.useConsistentGlobalStoreNameSuggest,
                                data,
                                fix: (fixer) => fixer.replaceTextRange([range[0], typeAnnotation?.range[0] ?? range[1]], storeName),
                            },
                        ],
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=use-consistent-global-store-name.js.map
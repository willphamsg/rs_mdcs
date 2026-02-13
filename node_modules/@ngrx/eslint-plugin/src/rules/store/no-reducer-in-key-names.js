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
exports.noReducerInKeyNamesSuggest = exports.noReducerInKeyNames = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.noReducerInKeyNames = 'noReducerInKeyNames';
exports.noReducerInKeyNamesSuggest = 'noReducerInKeyNamesSuggest';
const reducerKeyword = 'reducer';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: `Avoid the word "${reducerKeyword}" in the key names.`,
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.noReducerInKeyNames]: `Avoid the word "${reducerKeyword}" in the key names to better represent the state.`,
            [exports.noReducerInKeyNamesSuggest]: `Remove the word "${reducerKeyword}".`,
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            [`:matches(${utils_1.storeActionReducerMap}, ${utils_1.actionReducerMap}) > ${(0, utils_1.metadataProperty)(/reducer/i)} > .key`](node) {
                context.report({
                    node,
                    messageId: exports.noReducerInKeyNames,
                    suggest: [
                        {
                            messageId: exports.noReducerInKeyNamesSuggest,
                            fix: (fixer) => {
                                const keyName = (0, utils_1.getRawText)(node);
                                if (!keyName) {
                                    return null;
                                }
                                return fixer.replaceText(node, keyName.replace(new RegExp(reducerKeyword, 'i'), ''));
                            },
                        },
                    ],
                });
            },
        };
    },
});
//# sourceMappingURL=no-reducer-in-key-names.js.map
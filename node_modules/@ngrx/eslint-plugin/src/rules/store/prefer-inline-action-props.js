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
exports.preferInlineActionPropsSuggest = exports.preferInlineActionProps = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.preferInlineActionProps = 'preferInlineActionProps';
exports.preferInlineActionPropsSuggest = 'preferInlineActionPropsSuggest';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        docs: {
            description: 'Prefer using inline types instead of interfaces, types or classes.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.preferInlineActionProps]: 'Use inline types instead of interfaces, types or classes.',
            [exports.preferInlineActionPropsSuggest]: 'Change to inline types.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        return {
            [utils_1.actionCreatorPropsComputed](node) {
                context.report({
                    node,
                    messageId: exports.preferInlineActionProps,
                    suggest: [
                        {
                            messageId: exports.preferInlineActionPropsSuggest,
                            fix: (fixer) => [
                                fixer.insertTextBefore(node, '{name: '),
                                fixer.insertTextAfter(node, '}'),
                            ],
                        },
                    ],
                });
            },
        };
    },
});
//# sourceMappingURL=prefer-inline-action-props.js.map
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
exports.messageId = 'avoidCombiningSelectors';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer combining selectors at the selector level.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.messageId]: 'Combine selectors at the selector level.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        const { identifiers = [] } = (0, utils_1.getNgRxStores)(context);
        const storeNames = identifiers.length > 0 ? (0, utils_1.asPattern)(identifiers) : null;
        if (!storeNames) {
            return {};
        }
        const pipeableOrStoreSelect = `:matches(${(0, utils_1.namedExpression)(storeNames)}[callee.property.name='pipe']:has(CallExpression[callee.name='select']), ${(0, utils_1.selectExpression)(storeNames)})`;
        const selectsInArray = [];
        return {
            [`CallExpression[callee.name='combineLatest'] ${pipeableOrStoreSelect} ~ ${pipeableOrStoreSelect}`](node) {
                selectsInArray.push(node);
            },
            [`CallExpression[callee.name='combineLatest']:exit`]() {
                for (const node of selectsInArray) {
                    context.report({
                        node,
                        messageId: exports.messageId,
                    });
                }
                selectsInArray.length = 0;
            },
        };
    },
});
//# sourceMappingURL=avoid-combining-selectors.js.map
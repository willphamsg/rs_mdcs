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
exports.messageId = 'preferActionCreatorInDispatch';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Using `action creator` in `dispatch` is preferred over `object` or old `Action`.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.messageId]: 'Using `object` or old `Action` is forbidden. Use `action creator` instead.',
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
            [`${(0, utils_1.dispatchExpression)(storeNames)} :matches(NewExpression, :not(NewExpression) > ObjectExpression)`](node) {
                const nearestUpperCallExpression = (0, utils_1.getNearestUpperNodeFrom)(node, utils_1.isCallExpression);
                const isStoreDispatchImmediateParent = nearestUpperCallExpression !== undefined &&
                    (0, utils_1.isCallExpressionWith)(nearestUpperCallExpression, storeNames, 'dispatch');
                if (!isStoreDispatchImmediateParent) {
                    return;
                }
                context.report({
                    node,
                    messageId: exports.messageId,
                });
            },
        };
    },
});
//# sourceMappingURL=prefer-action-creator-in-dispatch.js.map
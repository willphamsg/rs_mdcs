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
exports.messageId = 'avoidMapppingSelectors';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Avoid mapping logic outside the selector level.',
            ngrxModule: 'store',
        },
        schema: [],
        messages: {
            [exports.messageId]: 'Map logic at the selector level instead.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        const { identifiers = [] } = (0, utils_1.getNgRxStores)(context);
        const storeNames = identifiers.length > 0 ? (0, utils_1.asPattern)(identifiers) : null;
        if (!storeNames) {
            return {};
        }
        const pipeWithSelectAndMapSelector = `${(0, utils_1.pipeExpression)(storeNames)}:has(CallExpression[callee.name='select'] ~ CallExpression[callee.name='map'])`;
        const selectSelector = `${(0, utils_1.namedCallableExpression)(storeNames)}[callee.object.callee.property.name='select']`;
        function isInCreateEffect(node) {
            let parent = node.parent;
            while (parent) {
                if ((0, utils_1.isCallExpression)(parent) &&
                    (0, utils_1.isIdentifier)(parent.callee) &&
                    parent.callee.name === 'createEffect') {
                    return true;
                }
                parent = parent.parent;
            }
            return false;
        }
        let pipeHasThisExpression = false;
        const selectorQuery = `:matches(${selectSelector}, ${pipeWithSelectAndMapSelector})`;
        return {
            [`${selectorQuery} > CallExpression:has(ThisExpression)`](_node) {
                pipeHasThisExpression = true;
            },
            [`${selectorQuery}[callee.property.name=pipe]:exit`](node) {
                if (pipeHasThisExpression) {
                    pipeHasThisExpression = false;
                    return;
                }
                if (isInCreateEffect(node)) {
                    return;
                }
                const operators = node.arguments;
                const mapOperator = operators.find((operator) => (0, utils_1.isCallExpression)(operator) &&
                    (0, utils_1.isIdentifier)(operator.callee) &&
                    operator.callee.name === 'map');
                if (mapOperator) {
                    context.report({
                        node: mapOperator,
                        messageId: exports.messageId,
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=avoid-mapping-selectors.js.map
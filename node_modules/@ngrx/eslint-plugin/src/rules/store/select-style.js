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
exports.SelectStyle = exports.selectOperator = exports.selectMethod = void 0;
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_1 = require("../../utils");
exports.selectMethod = 'selectMethod';
exports.selectOperator = 'selectOperator';
var SelectStyle;
(function (SelectStyle) {
    SelectStyle["Method"] = "method";
    SelectStyle["Operator"] = "operator";
})(SelectStyle || (exports.SelectStyle = SelectStyle = {}));
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Selector can be used either with `select` as a pipeable operator or as a method.',
            ngrxModule: 'store',
        },
        fixable: 'code',
        schema: [
            {
                type: 'string',
                enum: [SelectStyle.Method, SelectStyle.Operator],
            },
        ],
        messages: {
            [SelectStyle.Method]: 'Selector should be used with select method: `this.store.select(selector)`.',
            [SelectStyle.Operator]: 'Selector should be used with the pipeable operator: `this.store.pipe(select(selector))`.',
        },
    },
    defaultOptions: [SelectStyle.Method],
    create: (context, [mode]) => {
        const { identifiers = [], sourceCode } = (0, utils_1.getNgRxStores)(context);
        const storeNames = identifiers.length > 0 ? (0, utils_1.asPattern)(identifiers) : null;
        if (!storeNames) {
            return {};
        }
        if (mode === SelectStyle.Operator) {
            return {
                [(0, utils_1.selectExpression)(storeNames)](node) {
                    context.report({
                        node: node.callee.property,
                        messageId: SelectStyle.Operator,
                        fix: (fixer) => getMethodToOperatorFixes(node, fixer),
                    });
                },
            };
        }
        return {
            [`Program:has(${(0, utils_1.pipeableSelect)(storeNames)}) ImportDeclaration[source.value='${utils_1.NGRX_MODULE_PATHS.store}'] > ImportSpecifier[imported.name='select']`](node) {
                context.report({
                    node,
                    messageId: SelectStyle.Method,
                    fix: (fixer) => (0, utils_1.getImportRemoveFix)(sourceCode, [node.parent], 'select', fixer),
                });
                const [{ references }] = sourceCode.getDeclaredVariables(node);
                for (const { identifier } of references) {
                    context.report({
                        node: identifier,
                        messageId: SelectStyle.Method,
                        fix: (fixer) => getOperatorToMethodFixes(identifier, sourceCode, fixer),
                    });
                }
            },
        };
    },
});
function getMethodToOperatorFixes(node, fixer) {
    const classDeclaration = (0, utils_1.getNearestUpperNodeFrom)(node, utils_1.isClassDeclaration);
    if (!classDeclaration) {
        return [];
    }
    return [
        fixer.insertTextBefore(node.callee.property, 'pipe('),
        fixer.insertTextAfter(node, ')'),
    ].concat((0, utils_1.getImportAddFix)({
        fixer,
        importName: 'select',
        moduleName: utils_1.NGRX_MODULE_PATHS.store,
        node: classDeclaration,
    }));
}
function getOperatorToMethodFixes(identifier, sourceCode, fixer) {
    const select = identifier.parent;
    const storePipe = select?.parent;
    if (!storePipe ||
        !(0, utils_1.isCallExpression)(storePipe) ||
        !(0, utils_1.isMemberExpression)(storePipe.callee)) {
        return [];
    }
    const pipeContainsOnlySelect = storePipe.arguments.length === 1;
    if (!pipeContainsOnlySelect) {
        const selectContent = sourceCode.getText(select);
        const nextTokenAfterSelect = sourceCode.getTokenAfter(select);
        const store = storePipe.callee.object;
        return [
            fixer.remove(select),
            ...(nextTokenAfterSelect ? [fixer.remove(nextTokenAfterSelect)] : []),
            fixer.insertTextAfter(store, `.${selectContent}`),
        ];
    }
    const { property } = storePipe.callee;
    const nextTokenAfterPipe = sourceCode.getTokenAfter(property);
    const [pipeInitialRange, pipeEndRange] = property.range;
    const pipeRange = [
        pipeInitialRange,
        nextTokenAfterPipe?.range[1] ?? pipeEndRange,
    ];
    const [, selectEndRange] = identifier.range;
    return [
        fixer.removeRange(pipeRange),
        fixer.insertTextAfterRange([selectEndRange, selectEndRange + 1], '('),
    ];
}
//# sourceMappingURL=select-style.js.map
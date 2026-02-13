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
const utils_1 = require("@typescript-eslint/utils");
const path = __importStar(require("path"));
const rule_creator_1 = require("../../rule-creator");
const utils_2 = require("../../utils");
exports.messageId = 'preferConcatLatestFrom';
const defaultOptions = { strict: false };
const concatLatestFromKeyword = 'concatLatestFrom';
const withLatestFromKeyword = 'withLatestFrom';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'problem',
        docs: {
            description: `Use \`${concatLatestFromKeyword}\` instead of \`${withLatestFromKeyword}\` to prevent the selector from firing until the correct \`Action\` is dispatched.`,
            ngrxModule: 'operators',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    strict: {
                        type: 'boolean',
                        default: defaultOptions.strict,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            [exports.messageId]: `Use \`${concatLatestFromKeyword}\` instead of \`${withLatestFromKeyword}\`.`,
        },
    },
    defaultOptions: [defaultOptions],
    create: (context, [options]) => {
        if (options.strict) {
            return {
                [`${utils_2.createEffectExpression} CallExpression > Identifier[name='withLatestFrom']`](node) {
                    context.report({
                        node,
                        messageId: exports.messageId,
                        fix: (fixer) => getFixes(context.sourceCode, fixer, node),
                    });
                },
            };
        }
        const { identifiers = [], sourceCode } = (0, utils_2.getNgRxEffectActions)(context);
        const actionsNames = identifiers.length > 0 ? (0, utils_2.asPattern)(identifiers) : null;
        if (!actionsNames) {
            return {};
        }
        return {
            [`${utils_2.createEffectExpression} ${(0, utils_2.namedExpression)(actionsNames)} > CallExpression[arguments.length=1] > Identifier[name='${withLatestFromKeyword}']`](node) {
                context.report({
                    node,
                    messageId: exports.messageId,
                    fix: (fixer) => getFixes(sourceCode, fixer, node),
                });
            },
            [`${utils_2.createEffectExpression} ${(0, utils_2.namedExpression)(actionsNames)} > CallExpression[arguments.length>1] > Identifier[name='${withLatestFromKeyword}']`](node) {
                context.report({
                    node,
                    messageId: exports.messageId,
                });
            },
        };
    },
});
function getFixes(sourceCode, fixer, node) {
    const { parent } = node;
    const isUsingDeprecatedProjectorArgument = parent.arguments.length > 1;
    const [firstArgument] = parent.arguments;
    const nextToken = isUsingDeprecatedProjectorArgument &&
        sourceCode.getTokenAfter(firstArgument);
    return [
        fixer.replaceText(node, concatLatestFromKeyword),
        ...(firstArgument.type == utils_1.AST_NODE_TYPES.ArrowFunctionExpression
            ? []
            : [fixer.insertTextBefore(firstArgument, '() => ')]),
    ].concat((0, utils_2.getImportAddFix)({
        fixer,
        importName: concatLatestFromKeyword,
        moduleName: utils_2.NGRX_MODULE_PATHS.operators,
        node,
    }), ...(isUsingDeprecatedProjectorArgument && nextToken
        ? [
            (0, utils_2.getImportAddFix)({
                fixer,
                importName: 'map',
                moduleName: 'rxjs/operators',
                node,
            }),
            fixer.insertTextAfterRange(nextToken.range, '), map('),
        ]
        : []));
}
//# sourceMappingURL=prefer-concat-latest-from.js.map
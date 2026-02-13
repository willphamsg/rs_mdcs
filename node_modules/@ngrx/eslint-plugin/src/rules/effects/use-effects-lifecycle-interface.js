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
exports.messageId = 'useEffectsLifecycleInterface';
exports.default = (0, rule_creator_1.createRule)({
    name: path.parse(__filename).name,
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods.',
            ngrxModule: 'effects',
        },
        fixable: 'code',
        schema: [],
        messages: {
            [exports.messageId]: 'Lifecycle interface `{{ interfaceName }}` should be implemented for method `{{ methodName }}`.',
        },
    },
    defaultOptions: [],
    create: (context) => {
        const lifecycleMapper = {
            ngrxOnIdentifyEffects: 'OnIdentifyEffects',
            ngrxOnInitEffects: 'OnInitEffects',
            ngrxOnRunEffects: 'OnRunEffects',
        };
        const lifecyclesPattern = Object.keys(lifecycleMapper).join('|');
        return {
            [`ClassDeclaration > ClassBody > MethodDefinition > Identifier[name=/${lifecyclesPattern}/]`](node) {
                const classDeclaration = node.parent.parent.parent;
                const methodName = node.name;
                const interfaceName = lifecycleMapper[methodName];
                if ((0, utils_1.getInterface)(classDeclaration, interfaceName)) {
                    return;
                }
                context.report({
                    fix: (fixer) => {
                        const { implementsNodeReplace, implementsTextReplace } = (0, utils_1.getImplementsSchemaFixer)(classDeclaration, interfaceName);
                        return [
                            fixer.insertTextAfter(implementsNodeReplace, implementsTextReplace),
                        ].concat((0, utils_1.getImportAddFix)({
                            compatibleWithTypeOnlyImport: true,
                            fixer,
                            importName: interfaceName,
                            moduleName: utils_1.NGRX_MODULE_PATHS.effects,
                            node: classDeclaration,
                        }));
                    },
                    node,
                    messageId: exports.messageId,
                    data: {
                        interfaceName,
                        methodName,
                    },
                });
            },
        };
    },
});
//# sourceMappingURL=use-effects-lifecycle-interface.js.map
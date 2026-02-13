import type { TSESLint } from '@typescript-eslint/utils';
export declare const onFunctionExplicitReturnType = "onFunctionExplicitReturnType";
export declare const onFunctionExplicitReturnTypeSuggest = "onFunctionExplicitReturnTypeSuggest";
type MessageIds = typeof onFunctionExplicitReturnType | typeof onFunctionExplicitReturnTypeSuggest;
declare const _default: TSESLint.RuleModule<MessageIds, readonly [], import("../../rule-creator").NgRxRuleDocs, TSESLint.RuleListener>;
export default _default;

import { type TSESLint } from '@typescript-eslint/utils';
export declare const messageId = "preferConcatLatestFrom";
type Options = readonly [{
    readonly strict: boolean;
}];
declare const _default: TSESLint.RuleModule<"preferConcatLatestFrom", Options, import("../../rule-creator").NgRxRuleDocs, TSESLint.RuleListener>;
export default _default;

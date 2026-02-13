import type { TSESLint } from '@typescript-eslint/utils';
export declare const selectMethod = "selectMethod";
export declare const selectOperator = "selectOperator";
export declare const enum SelectStyle {
    Method = "method",
    Operator = "operator"
}
type MessageIds = `${SelectStyle}`;
type Options = readonly [MessageIds];
declare const _default: TSESLint.RuleModule<"operator" | "method", Options, import("../../rule-creator").NgRxRuleDocs, TSESLint.RuleListener>;
export default _default;

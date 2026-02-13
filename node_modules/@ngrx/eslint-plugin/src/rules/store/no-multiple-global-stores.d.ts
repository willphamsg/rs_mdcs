import type { TSESLint } from '@typescript-eslint/utils';
export declare const noMultipleGlobalStores = "noMultipleGlobalStores";
export declare const noMultipleGlobalStoresSuggest = "noMultipleGlobalStoresSuggest";
type MessageIds = typeof noMultipleGlobalStores | typeof noMultipleGlobalStoresSuggest;
declare const _default: TSESLint.RuleModule<MessageIds, readonly [], import("../../rule-creator").NgRxRuleDocs, TSESLint.RuleListener>;
export default _default;

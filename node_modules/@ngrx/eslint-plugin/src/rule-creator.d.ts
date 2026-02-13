import { ESLintUtils } from '@typescript-eslint/utils';
import { NGRX_MODULE } from './utils';
export interface NgRxRuleDocs {
    ngrxModule: NGRX_MODULE;
    requiresTypeChecking?: boolean;
}
export type NgRxRule = ReturnType<ReturnType<typeof ESLintUtils.RuleCreator<NgRxRuleDocs>>>;
export declare const createRule: <Options extends readonly unknown[], MessageIds extends string>({ meta, name, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, NgRxRuleDocs>>) => ESLintUtils.RuleModule<MessageIds, Options, NgRxRuleDocs, ESLintUtils.RuleListener>;

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
type ConstructorFunctionExpression = TSESTree.FunctionExpression & {
    parent: TSESTree.MethodDefinition & {
        kind: 'constructor';
    };
};
type InjectedParameter = TSESTree.Identifier & {
    typeAnnotation: TSESTree.TSTypeAnnotation;
    parent: ConstructorFunctionExpression | (TSESTree.TSParameterProperty & {
        parent: ConstructorFunctionExpression;
    }) | TSESTree.PropertyDefinition;
};
type InjectedParameterWithSourceCode = Readonly<{
    identifiers?: readonly InjectedParameter[];
    sourceCode: Readonly<TSESLint.SourceCode>;
}>;
export declare function getNearestUpperNodeFrom<T extends TSESTree.Node>({ parent }: TSESTree.Node, predicate: (parent: TSESTree.Node) => parent is T): T | undefined;
export declare function getImportDeclarationSpecifier(importDeclarations: readonly TSESTree.ImportDeclaration[], importName: string): {
    readonly importDeclaration: TSESTree.ImportDeclaration;
    readonly importSpecifier: TSESTree.ImportSpecifier;
} | undefined;
export declare function getImportDeclarations(node: TSESTree.Node, moduleName: string): readonly TSESTree.ImportDeclaration[] | undefined;
export declare function getImportAddFix({ compatibleWithTypeOnlyImport, fixer, importName, moduleName, node, }: {
    compatibleWithTypeOnlyImport?: boolean;
    fixer: TSESLint.RuleFixer;
    importName: string;
    moduleName: string;
    node: TSESTree.Node;
}): TSESLint.RuleFix | TSESLint.RuleFix[];
export declare function getImportRemoveFix(sourceCode: Readonly<TSESLint.SourceCode>, importDeclarations: readonly TSESTree.ImportDeclaration[], importedName: string, fixer: TSESLint.RuleFixer): TSESLint.RuleFix | TSESLint.RuleFix[];
export declare function getNodeToCommaRemoveFix(sourceCode: Readonly<TSESLint.SourceCode>, fixer: TSESLint.RuleFixer, node: TSESTree.Node): readonly [TSESLint.RuleFix, ...TSESLint.RuleFix[]];
export declare function getInterfaceName(interfaceMember: TSESTree.Identifier | TSESTree.MemberExpression): string | undefined;
export declare function getInterfaces({ implements: classImplements, }: TSESTree.ClassDeclaration): readonly (TSESTree.Identifier | TSESTree.MemberExpression)[];
export declare function getInterface(node: TSESTree.ClassDeclaration, interfaceName: string): TSESTree.Identifier | TSESTree.MemberExpression | undefined;
export declare function getImplementsSchemaFixer({ id, implements: classImplements }: TSESTree.ClassDeclaration, interfaceName: string): {
    readonly implementsNodeReplace: TSESTree.Identifier | TSESTree.TSClassImplements;
    readonly implementsTextReplace: string;
};
export declare function getLast<T extends readonly unknown[]>(items: T): T[number];
export declare function getDecoratorName({ expression, }: TSESTree.Decorator): string | undefined;
export declare function getRawText(node: TSESTree.Node): string | null;
export declare function capitalize<T extends string>(text: T): Capitalize<T>;
export declare function getNgRxEffectActions(context: TSESLint.RuleContext<string, readonly unknown[]>): InjectedParameterWithSourceCode;
export declare function getNgRxComponentStores(context: TSESLint.RuleContext<string, readonly unknown[]>): InjectedParameterWithSourceCode;
export declare function getNgRxStores(context: TSESLint.RuleContext<string, readonly unknown[]>): InjectedParameterWithSourceCode;
export declare function escapeText(text: string): string;
export declare function asPattern(identifiers: readonly InjectedParameter[]): RegExp;
export declare function getNgrxComponentStoreNames(context: TSESLint.RuleContext<string, readonly unknown[]>): RegExp | null;
export {};

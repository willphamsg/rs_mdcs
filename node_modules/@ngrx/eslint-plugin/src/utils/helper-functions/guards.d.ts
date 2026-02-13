import type { TSESTree } from '@typescript-eslint/utils';
import type * as ts from 'typescript';
export declare const isArrowFunctionExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ArrowFunctionExpression;
};
export declare const isReturnStatement: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ReturnStatement;
};
export declare const isMethodDefinition: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.MethodDefinition;
};
export declare const isCallExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.CallExpression;
};
export declare const isClassDeclaration: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ClassDeclaration;
};
export declare const isPropertyDefinition: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.PropertyDefinition;
};
export declare const isFunctionExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.FunctionExpression;
};
export declare const isFunctionDeclaration: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.FunctionDeclaration;
};
export declare const isIdentifier: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.Identifier;
};
export declare const isImportDeclaration: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ImportDeclaration;
};
export declare const isImportDefaultSpecifier: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ImportDefaultSpecifier;
};
export declare const isImportNamespaceSpecifier: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ImportNamespaceSpecifier;
};
export declare const isImportSpecifier: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ImportSpecifier;
};
export declare const isLiteral: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.Literal;
};
export declare const isTemplateElement: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.TemplateElement;
};
export declare const isTemplateLiteral: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.TemplateLiteral;
};
export declare const isMemberExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.MemberExpression;
};
export declare const isProgram: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.Program;
};
export declare const isThisExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ThisExpression;
};
export declare const isTSParameterProperty: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.TSParameterProperty;
};
export declare const isTSTypeAnnotation: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.TSTypeAnnotation;
};
export declare const isTSTypeReference: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.TSTypeReference;
};
export declare const isTSInstantiationExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.TSInstantiationExpression;
};
export declare const isProperty: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.Property;
};
export declare const isArrayExpression: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.ArrayExpression;
};
export declare const isBlockStatement: (node: TSESTree.Node) => node is TSESTree.Node & {
    type: TSESTree.AST_NODE_TYPES.BlockStatement;
};
export declare function isIdentifierOrMemberExpression(node: TSESTree.Node): node is TSESTree.Identifier | TSESTree.MemberExpression;
export declare function isTypeReference(type: ts.Type): type is ts.TypeReference;
export declare function isCallExpressionWith(node: TSESTree.CallExpression, objectName: RegExp | string, propertyName: string): boolean;

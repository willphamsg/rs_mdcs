"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockStatement = exports.isArrayExpression = exports.isProperty = exports.isTSInstantiationExpression = exports.isTSTypeReference = exports.isTSTypeAnnotation = exports.isTSParameterProperty = exports.isThisExpression = exports.isProgram = exports.isMemberExpression = exports.isTemplateLiteral = exports.isTemplateElement = exports.isLiteral = exports.isImportSpecifier = exports.isImportNamespaceSpecifier = exports.isImportDefaultSpecifier = exports.isImportDeclaration = exports.isIdentifier = exports.isFunctionDeclaration = exports.isFunctionExpression = exports.isPropertyDefinition = exports.isClassDeclaration = exports.isCallExpression = exports.isMethodDefinition = exports.isReturnStatement = exports.isArrowFunctionExpression = void 0;
exports.isIdentifierOrMemberExpression = isIdentifierOrMemberExpression;
exports.isTypeReference = isTypeReference;
exports.isCallExpressionWith = isCallExpressionWith;
const utils_1 = require("@typescript-eslint/utils");
const isNodeOfType = (nodeType) => (node) => node.type === nodeType;
exports.isArrowFunctionExpression = isNodeOfType(utils_1.AST_NODE_TYPES.ArrowFunctionExpression);
exports.isReturnStatement = isNodeOfType(utils_1.AST_NODE_TYPES.ReturnStatement);
exports.isMethodDefinition = isNodeOfType(utils_1.AST_NODE_TYPES.MethodDefinition);
exports.isCallExpression = isNodeOfType(utils_1.AST_NODE_TYPES.CallExpression);
exports.isClassDeclaration = isNodeOfType(utils_1.AST_NODE_TYPES.ClassDeclaration);
exports.isPropertyDefinition = isNodeOfType(utils_1.AST_NODE_TYPES.PropertyDefinition);
exports.isFunctionExpression = isNodeOfType(utils_1.AST_NODE_TYPES.FunctionExpression);
exports.isFunctionDeclaration = isNodeOfType(utils_1.AST_NODE_TYPES.FunctionDeclaration);
exports.isIdentifier = isNodeOfType(utils_1.AST_NODE_TYPES.Identifier);
exports.isImportDeclaration = isNodeOfType(utils_1.AST_NODE_TYPES.ImportDeclaration);
exports.isImportDefaultSpecifier = isNodeOfType(utils_1.AST_NODE_TYPES.ImportDefaultSpecifier);
exports.isImportNamespaceSpecifier = isNodeOfType(utils_1.AST_NODE_TYPES.ImportNamespaceSpecifier);
exports.isImportSpecifier = isNodeOfType(utils_1.AST_NODE_TYPES.ImportSpecifier);
exports.isLiteral = isNodeOfType(utils_1.AST_NODE_TYPES.Literal);
exports.isTemplateElement = isNodeOfType(utils_1.AST_NODE_TYPES.TemplateElement);
exports.isTemplateLiteral = isNodeOfType(utils_1.AST_NODE_TYPES.TemplateLiteral);
exports.isMemberExpression = isNodeOfType(utils_1.AST_NODE_TYPES.MemberExpression);
exports.isProgram = isNodeOfType(utils_1.AST_NODE_TYPES.Program);
exports.isThisExpression = isNodeOfType(utils_1.AST_NODE_TYPES.ThisExpression);
exports.isTSParameterProperty = isNodeOfType(utils_1.AST_NODE_TYPES.TSParameterProperty);
exports.isTSTypeAnnotation = isNodeOfType(utils_1.AST_NODE_TYPES.TSTypeAnnotation);
exports.isTSTypeReference = isNodeOfType(utils_1.AST_NODE_TYPES.TSTypeReference);
exports.isTSInstantiationExpression = isNodeOfType(utils_1.AST_NODE_TYPES.TSInstantiationExpression);
exports.isProperty = isNodeOfType(utils_1.AST_NODE_TYPES.Property);
exports.isArrayExpression = isNodeOfType(utils_1.AST_NODE_TYPES.ArrayExpression);
exports.isBlockStatement = isNodeOfType(utils_1.AST_NODE_TYPES.BlockStatement);
function isIdentifierOrMemberExpression(node) {
    return (0, exports.isIdentifier)(node) || (0, exports.isMemberExpression)(node);
}
function isTypeReference(type) {
    return type.hasOwnProperty('target');
}
function equalTo(one, other) {
    return typeof one === 'string' ? one === other : one.test(other);
}
function isCallExpressionWith(node, objectName, propertyName) {
    return ((0, exports.isMemberExpression)(node.callee) &&
        !node.callee.computed &&
        node.callee.property.name === propertyName &&
        (((0, exports.isIdentifier)(node.callee.object) &&
            equalTo(objectName, node.callee.object.name)) ||
            ((0, exports.isMemberExpression)(node.callee.object) &&
                (0, exports.isThisExpression)(node.callee.object.object) &&
                (0, exports.isIdentifier)(node.callee.object.property) &&
                equalTo(objectName, node.callee.object.property.name))));
}
//# sourceMappingURL=guards.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestUpperNodeFrom = getNearestUpperNodeFrom;
exports.getImportDeclarationSpecifier = getImportDeclarationSpecifier;
exports.getImportDeclarations = getImportDeclarations;
exports.getImportAddFix = getImportAddFix;
exports.getImportRemoveFix = getImportRemoveFix;
exports.getNodeToCommaRemoveFix = getNodeToCommaRemoveFix;
exports.getInterfaceName = getInterfaceName;
exports.getInterfaces = getInterfaces;
exports.getInterface = getInterface;
exports.getImplementsSchemaFixer = getImplementsSchemaFixer;
exports.getLast = getLast;
exports.getDecoratorName = getDecoratorName;
exports.getRawText = getRawText;
exports.capitalize = capitalize;
exports.getNgRxEffectActions = getNgRxEffectActions;
exports.getNgRxComponentStores = getNgRxComponentStores;
exports.getNgRxStores = getNgRxStores;
exports.escapeText = escapeText;
exports.asPattern = asPattern;
exports.getNgrxComponentStoreNames = getNgrxComponentStoreNames;
const utils_1 = require("@typescript-eslint/utils");
const guards_1 = require("./guards");
const ngrx_modules_1 = require("./ngrx-modules");
function getNearestUpperNodeFrom({ parent }, predicate) {
    while (parent && !(0, guards_1.isProgram)(parent)) {
        if (predicate(parent)) {
            return parent;
        }
        parent = parent.parent;
    }
    return undefined;
}
function getImportDeclarationSpecifier(importDeclarations, importName) {
    for (const importDeclaration of importDeclarations) {
        const importSpecifier = importDeclaration.specifiers.find((importClause) => {
            return ((0, guards_1.isImportSpecifier)(importClause) &&
                (0, guards_1.isIdentifier)(importClause.imported) &&
                importClause.imported.name === importName);
        });
        if (importSpecifier) {
            return { importDeclaration, importSpecifier };
        }
    }
    return undefined;
}
function getImportDeclarations(node, moduleName) {
    let parentNode = node;
    while (parentNode && !(0, guards_1.isProgram)(parentNode)) {
        parentNode = parentNode.parent;
    }
    return parentNode?.body.filter((node) => {
        return (0, guards_1.isImportDeclaration)(node) && node.source.value === moduleName;
    });
}
function getCorrespondentImportClause(importDeclarations, compatibleWithTypeOnlyImport = false) {
    let importClause;
    for (const { importKind, specifiers } of importDeclarations) {
        const lastImportSpecifier = getLast(specifiers);
        if ((!compatibleWithTypeOnlyImport && importKind === 'type') ||
            (0, guards_1.isImportNamespaceSpecifier)(lastImportSpecifier)) {
            continue;
        }
        importClause = lastImportSpecifier;
    }
    return importClause;
}
function getImportAddFix({ compatibleWithTypeOnlyImport = false, fixer, importName, moduleName, node, }) {
    const fullImport = `import { ${importName} } from '${moduleName}';`;
    const importDeclarations = getImportDeclarations(node, moduleName);
    if (!importDeclarations?.length) {
        return fixer.insertTextAfterRange([0, 0], fullImport);
    }
    const importDeclarationSpecifier = getImportDeclarationSpecifier(importDeclarations, importName);
    if (importDeclarationSpecifier) {
        return [];
    }
    const importClause = getCorrespondentImportClause(importDeclarations, compatibleWithTypeOnlyImport);
    if (!importClause) {
        return fixer.insertTextAfterRange([0, 0], fullImport);
    }
    const replacementText = (0, guards_1.isImportDefaultSpecifier)(importClause)
        ? `, { ${importName} }`
        : `, ${importName}`;
    return fixer.insertTextAfter(importClause, replacementText);
}
function getImportRemoveFix(sourceCode, importDeclarations, importedName, fixer) {
    const { importDeclaration, importSpecifier } = getImportDeclarationSpecifier(importDeclarations, importedName) ?? {};
    if (!importDeclaration || !importSpecifier) {
        return [];
    }
    const isFirstImportSpecifier = importDeclaration.specifiers[0] === importSpecifier;
    const isLastImportSpecifier = getLast(importDeclaration.specifiers) === importSpecifier;
    const isSingleImportSpecifier = isFirstImportSpecifier && isLastImportSpecifier;
    if (isSingleImportSpecifier) {
        return fixer.remove(importDeclaration);
    }
    const tokenAfterImportSpecifier = sourceCode.getTokenAfter(importSpecifier);
    if (isFirstImportSpecifier && tokenAfterImportSpecifier) {
        return fixer.removeRange([
            importSpecifier.range[0],
            tokenAfterImportSpecifier.range[1],
        ]);
    }
    const tokenBeforeImportSpecifier = sourceCode.getTokenBefore(importSpecifier);
    if (!tokenBeforeImportSpecifier) {
        return [];
    }
    return fixer.removeRange([
        tokenBeforeImportSpecifier.range[0],
        importSpecifier.range[1],
    ]);
}
function getNodeToCommaRemoveFix(sourceCode, fixer, node) {
    const nextToken = sourceCode.getTokenAfter(node);
    const isNextTokenComma = nextToken && utils_1.ASTUtils.isCommaToken(nextToken);
    return [
        fixer.remove(node),
        ...(isNextTokenComma ? [fixer.remove(nextToken)] : []),
    ];
}
function getInterfaceName(interfaceMember) {
    if ((0, guards_1.isIdentifier)(interfaceMember)) {
        return interfaceMember.name;
    }
    return (0, guards_1.isIdentifier)(interfaceMember.property)
        ? interfaceMember.property.name
        : undefined;
}
function getInterfaces({ implements: classImplements, }) {
    return (classImplements ?? [])
        .map(({ expression }) => expression)
        .filter(guards_1.isIdentifierOrMemberExpression);
}
function getInterface(node, interfaceName) {
    return getInterfaces(node).find((interfaceMember) => getInterfaceName(interfaceMember) === interfaceName);
}
function getImplementsSchemaFixer({ id, implements: classImplements }, interfaceName) {
    const [implementsNodeReplace, implementsTextReplace] = classImplements && classImplements.length
        ? [getLast(classImplements), `, ${interfaceName}`]
        : [id, ` implements ${interfaceName}`];
    return { implementsNodeReplace, implementsTextReplace };
}
function getLast(items) {
    return items.slice(-1)[0];
}
function getDecoratorName({ expression, }) {
    if ((0, guards_1.isIdentifier)(expression)) {
        return expression.name;
    }
    return (0, guards_1.isCallExpression)(expression) && (0, guards_1.isIdentifier)(expression.callee)
        ? expression.callee.name
        : undefined;
}
function getRawText(node) {
    if ((0, guards_1.isIdentifier)(node)) {
        return node.name;
    }
    if ((0, guards_1.isPropertyDefinition)(node) ||
        (0, guards_1.isMethodDefinition)(node) ||
        (0, guards_1.isProperty)(node)) {
        return getRawText(node.key);
    }
    if ((0, guards_1.isLiteral)(node)) {
        return node.raw;
    }
    if ((0, guards_1.isTemplateElement)(node)) {
        return `\`${node.value.raw}\``;
    }
    if ((0, guards_1.isTemplateLiteral)(node)) {
        return `\`${node.quasis[0].value.raw}\``;
    }
    return null;
}
function capitalize(text) {
    return `${text[0].toUpperCase()}${text.slice(1)}`;
}
function getInjectedParametersWithSourceCode(context, moduleName, importName) {
    const sourceCode = context.sourceCode;
    const importDeclarations = getImportDeclarations(sourceCode.ast, moduleName) ?? [];
    const { importSpecifier } = getImportDeclarationSpecifier(importDeclarations, importName) ?? {};
    const injectImportDeclarations = getImportDeclarations(sourceCode.ast, '@angular/core') ?? [];
    const { importSpecifier: injectImportSpecifier } = getImportDeclarationSpecifier(injectImportDeclarations, 'inject') ?? {};
    if (!importSpecifier) {
        return { sourceCode };
    }
    const variables = sourceCode.getDeclaredVariables(importSpecifier);
    const typedVariable = variables.find(({ name }) => name === importName);
    const identifiers = typedVariable?.references?.reduce((identifiers, { identifier: { parent } }) => {
        if (!parent) {
            return identifiers;
        }
        if ((0, guards_1.isTSTypeReference)(parent) &&
            parent.parent &&
            (0, guards_1.isTSTypeAnnotation)(parent.parent) &&
            parent.parent.parent &&
            (0, guards_1.isIdentifier)(parent.parent.parent)) {
            return identifiers.concat(parent.parent.parent);
        }
        const parentToCheck = (0, guards_1.isTSInstantiationExpression)(parent)
            ? parent.parent
            : parent;
        if (parentToCheck &&
            (0, guards_1.isCallExpression)(parentToCheck) &&
            (0, guards_1.isIdentifier)(parentToCheck.callee) &&
            parentToCheck.callee.name == 'inject' &&
            parentToCheck.parent &&
            (0, guards_1.isPropertyDefinition)(parentToCheck.parent) &&
            (0, guards_1.isIdentifier)(parentToCheck.parent.key) &&
            injectImportSpecifier) {
            return identifiers.concat(parentToCheck.parent.key);
        }
        return identifiers;
    }, []);
    return { identifiers, sourceCode };
}
function getNgRxEffectActions(context) {
    return getInjectedParametersWithSourceCode(context, ngrx_modules_1.NGRX_MODULE_PATHS.effects, 'Actions');
}
function getNgRxComponentStores(context) {
    return getInjectedParametersWithSourceCode(context, ngrx_modules_1.NGRX_MODULE_PATHS['component-store'], 'ComponentStore');
}
function getNgRxStores(context) {
    return getInjectedParametersWithSourceCode(context, ngrx_modules_1.NGRX_MODULE_PATHS.store, 'Store');
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeText(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function asPattern(identifiers) {
    const escapedNames = identifiers.map(({ name }) => escapeText(name));
    return new RegExp(`^(${escapedNames.join('|')})$`);
}
function getNgrxComponentStoreNames(context) {
    const { identifiers = [] } = getNgRxComponentStores(context);
    return identifiers.length > 0 ? asPattern(identifiers) : null;
}
//# sourceMappingURL=utils.js.map
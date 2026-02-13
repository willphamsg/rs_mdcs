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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.possibleFlatConfigPaths = void 0;
exports.default = default_1;
const strip_json_comments_1 = __importDefault(require("strip-json-comments"));
const ts = __importStar(require("typescript"));
exports.possibleFlatConfigPaths = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
];
function default_1(schema) {
    return (host, context) => {
        const jsonConfigPath = '.eslintrc.json';
        const flatConfigPath = exports.possibleFlatConfigPaths.find((path) => host.exists(path));
        const docs = 'https://ngrx.io/guide/eslint-plugin';
        if (flatConfigPath) {
            updateFlatConfig(host, context, flatConfigPath, schema, docs);
            return host;
        }
        if (!host.exists(jsonConfigPath)) {
            context.logger.warn(`
Could not find an ESLint config at any of ${exports.possibleFlatConfigPaths.join(', ')} or \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.
Please see ${docs} to configure the NgRx ESLint Plugin.
      `);
            return host;
        }
        updateJsonConfig(host, context, jsonConfigPath, schema, docs);
        return host;
    };
}
function updateFlatConfig(host, context, flatConfigPath, schema, docs) {
    const ngrxPlugin = '@ngrx/eslint-plugin/v9';
    const content = host.read(flatConfigPath)?.toString('utf-8');
    if (!content) {
        context.logger.error(`Could not read the ESLint flat config at \`${flatConfigPath}\`.`);
        return;
    }
    if (content.includes(ngrxPlugin)) {
        context.logger.info(`Skipping installation, the NgRx ESLint Plugin is already installed in your flat config.`);
        return;
    }
    if (!content.includes('tseslint.config')) {
        context.logger.warn(`No tseslint found, skipping the installation of the NgRx ESLint Plugin in your flat config.`);
        return;
    }
    const source = ts.createSourceFile(flatConfigPath, content, ts.ScriptTarget.Latest, true);
    const recorder = host.beginUpdate(flatConfigPath);
    addImport();
    addNgRxPlugin();
    host.commitUpdate(recorder);
    context.logger.info(`
The NgRx ESLint Plugin is installed and configured using the '${schema.config}' configuration in your flat config.
See ${docs} for more details.
  `);
    function addImport() {
        const isESM = content.includes('export default');
        if (isESM) {
            const lastImport = source.statements
                .filter((statement) => ts.isImportDeclaration(statement))
                .reverse()[0];
            recorder.insertRight(lastImport?.end ?? 0, `\nimport ngrx from '${ngrxPlugin}';`);
        }
        else {
            const lastRequireVariableDeclaration = source.statements
                .filter((statement) => {
                if (!ts.isVariableStatement(statement))
                    return false;
                const decl = statement.declarationList.declarations[0];
                if (!decl.initializer)
                    return false;
                return (ts.isCallExpression(decl.initializer) &&
                    decl.initializer.expression.getText() === 'require');
            })
                .reverse()[0];
            recorder.insertRight(lastRequireVariableDeclaration?.end ?? 0, `\nconst ngrx = require('${ngrxPlugin}');`);
        }
    }
    function addNgRxPlugin() {
        let tseslintConfigCall = null;
        function findTsEslintConfigCalls(node) {
            if (tseslintConfigCall) {
                return;
            }
            if (ts.isCallExpression(node) &&
                node.expression.getText() === 'tseslint.config') {
                tseslintConfigCall = node;
            }
            ts.forEachChild(node, findTsEslintConfigCalls);
        }
        findTsEslintConfigCalls(source);
        if (tseslintConfigCall) {
            tseslintConfigCall = tseslintConfigCall;
            const lastArgument = tseslintConfigCall.arguments[tseslintConfigCall.arguments.length - 1];
            const plugin = `  {
    files: ['**/*.ts'],
    extends: [
      ...ngrx.configs.${schema.config},
    ],
    rules: {},
  }`;
            if (lastArgument) {
                recorder.remove(lastArgument.pos, lastArgument.end - lastArgument.pos);
                recorder.insertRight(lastArgument.pos, `${lastArgument.getFullText()},\n${plugin}`);
            }
            else {
                recorder.insertRight(tseslintConfigCall.end - 1, `\n${plugin}\n`);
            }
        }
    }
}
function updateJsonConfig(host, context, jsonConfigPath, schema, docs) {
    const eslint = host.read(jsonConfigPath)?.toString('utf-8');
    if (!eslint) {
        context.logger.error(`
Could not find the ESLint config at \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.
Please see ${docs} to configure the NgRx ESLint Plugin.
`);
        return;
    }
    try {
        const json = JSON.parse((0, strip_json_comments_1.default)(eslint));
        const plugin = {
            files: ['*.ts'],
            extends: [`plugin:@ngrx/${schema.config}`],
        };
        if (json.overrides) {
            if (!json.overrides.some((override) => override.extends?.some((extend) => extend.startsWith('plugin:@ngrx')))) {
                json.overrides.push(plugin);
            }
        }
        else if (!json.extends?.some((extend) => extend.startsWith('plugin:@ngrx'))) {
            json.overrides = [plugin];
        }
        host.overwrite(jsonConfigPath, JSON.stringify(json, null, 2));
        context.logger.info(`
The NgRx ESLint Plugin is installed and configured with the '${schema.config}' config.
Take a look at the docs at ${docs} if you want to change the default configuration.
`);
    }
    catch (err) {
        const detailsContent = err instanceof Error
            ? `
Details:
${err.message}
`
            : '';
        context.logger.warn(`
Something went wrong while adding the NgRx ESLint Plugin.
The NgRx ESLint Plugin is installed but not configured.
Please see ${docs} to configure the NgRx ESLint Plugin.
${detailsContent}
`);
    }
}
//# sourceMappingURL=index.js.map
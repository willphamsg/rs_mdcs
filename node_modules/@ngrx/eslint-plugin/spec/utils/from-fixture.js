"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFixture = fromFixture;
function fromFixture(fixture, invalidTestCase = {}) {
    const { suggestions, ...rest } = invalidTestCase;
    return {
        ...rest,
        ...parseFixture(fixture, suggestions),
    };
}
function getSuggestions(suggestions, suggest, indices) {
    if (!suggestions || !suggest) {
        return {};
    }
    if (!indices) {
        return { suggestions };
    }
    return {
        suggestions: indices
            .split(/\s+/)
            .map((index) => suggestions[Number.parseInt(index, 10)]),
    };
}
function parseFixture(fixture, suggestions) {
    const errorRegExp = /^(?<indent>\s*)(?<error>~+)\s*\[(?<id>\w+)\s*(?<data>.*?)(?:\s*(?<suggest>suggest)\s*(?<indices>[\d\s]*))?\]\s*$/;
    const lines = [];
    const errors = [];
    let suggestFound = false;
    fixture.split('\n').forEach((line) => {
        const match = line.match(errorRegExp);
        if (match?.groups) {
            const column = match.groups.indent.length + 1;
            const endColumn = column + match.groups.error.length;
            const { length } = lines;
            errors.push({
                column,
                data: JSON.parse(match.groups.data || '{}'),
                endColumn,
                endLine: length,
                line: length,
                messageId: match.groups.id,
                // TODO: Remove type assertion once https://github.com/typescript-eslint/typescript-eslint/pull/3844 is available.
                ...getSuggestions(suggestions, Boolean(match.groups.suggest), match.groups.indices?.trim()),
            });
            if (match.groups.suggest) {
                suggestFound = true;
            }
        }
        else {
            lines.push(line);
        }
    });
    if (suggestions && !suggestFound) {
        throw new Error("Suggestions specified but no 'suggest' annotation found.");
    }
    return {
        code: lines.join('\n'),
        errors,
    };
}
//# sourceMappingURL=from-fixture.js.map
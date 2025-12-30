(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/blockquote.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Blockquote, Parents} from 'mdast'
 * @import {Info, Map, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {Blockquote} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */ __turbopack_context__.s([
    "blockquote",
    ()=>blockquote
]);
function blockquote(node, _, state, info) {
    const exit = state.enter('blockquote');
    const tracker = state.createTracker(info);
    tracker.move('> ');
    tracker.shift(2);
    const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
    exit();
    return value;
}
/** @type {Map} */ function map(line, _, blank) {
    return '>' + (blank ? '' : ' ') + line;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
 */ /**
 * @param {Array<ConstructName>} stack
 * @param {Unsafe} pattern
 * @returns {boolean}
 */ __turbopack_context__.s([
    "patternInScope",
    ()=>patternInScope
]);
function patternInScope(stack, pattern) {
    return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}
/**
 * @param {Array<ConstructName>} stack
 * @param {Unsafe['inConstruct']} list
 * @param {boolean} none
 * @returns {boolean}
 */ function listInScope(stack, list, none) {
    if (typeof list === 'string') {
        list = [
            list
        ];
    }
    if (!list || list.length === 0) {
        return none;
    }
    let index = -1;
    while(++index < list.length){
        if (stack.includes(list[index])) {
            return true;
        }
    }
    return false;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/break.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Break, Parents} from 'mdast'
 * @import {Info, State} from 'mdast-util-to-markdown'
 */ __turbopack_context__.s([
    "hardBreak",
    ()=>hardBreak
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$pattern$2d$in$2d$scope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js [app-client] (ecmascript)");
;
function hardBreak(_, _1, state, info) {
    let index = -1;
    while(++index < state.unsafe.length){
        // If we can’t put eols in this construct (setext headings, tables), use a
        // space instead.
        if (state.unsafe[index].character === '\n' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$pattern$2d$in$2d$scope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patternInScope"])(state.stack, state.unsafe[index])) {
            return /[ \t]/.test(info.before) ? '' : ' ';
        }
    }
    return '\\\n';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Code} from 'mdast'
 */ /**
 * @param {Code} node
 * @param {State} state
 * @returns {boolean}
 */ __turbopack_context__.s([
    "formatCodeAsIndented",
    ()=>formatCodeAsIndented
]);
function formatCodeAsIndented(node, state) {
    return Boolean(state.options.fences === false && node.value && // If there’s no info…
    !node.lang && // And there’s a non-whitespace character…
    /[^ \r\n]/.test(node.value) && // And the value doesn’t start or end in a blank…
    !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value));
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-fence.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['fence'], null | undefined>}
 */ __turbopack_context__.s([
    "checkFence",
    ()=>checkFence
]);
function checkFence(state) {
    const marker = state.options.fence || '`';
    if (marker !== '`' && marker !== '~') {
        throw new Error('Cannot serialize code with `' + marker + '` for `options.fence`, expected `` ` `` or `~`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/code.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, Map, State} from 'mdast-util-to-markdown'
 * @import {Code, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "code",
    ()=>code
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$longest$2d$streak$40$3$2e$1$2e$0$2f$node_modules$2f$longest$2d$streak$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$code$2d$as$2d$indented$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$fence$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-fence.js [app-client] (ecmascript)");
;
;
;
function code(node, _, state, info) {
    const marker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$fence$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkFence"])(state);
    const raw = node.value || '';
    const suffix = marker === '`' ? 'GraveAccent' : 'Tilde';
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$code$2d$as$2d$indented$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCodeAsIndented"])(node, state)) {
        const exit = state.enter('codeIndented');
        const value = state.indentLines(raw, map);
        exit();
        return value;
    }
    const tracker = state.createTracker(info);
    const sequence = marker.repeat(Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$longest$2d$streak$40$3$2e$1$2e$0$2f$node_modules$2f$longest$2d$streak$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["longestStreak"])(raw, marker) + 1, 3));
    const exit = state.enter('codeFenced');
    let value = tracker.move(sequence);
    if (node.lang) {
        const subexit = state.enter(`codeFencedLang${suffix}`);
        value += tracker.move(state.safe(node.lang, {
            before: value,
            after: ' ',
            encode: [
                '`'
            ],
            ...tracker.current()
        }));
        subexit();
    }
    if (node.lang && node.meta) {
        const subexit = state.enter(`codeFencedMeta${suffix}`);
        value += tracker.move(' ');
        value += tracker.move(state.safe(node.meta, {
            before: value,
            after: '\n',
            encode: [
                '`'
            ],
            ...tracker.current()
        }));
        subexit();
    }
    value += tracker.move('\n');
    if (raw) {
        value += tracker.move(raw + '\n');
    }
    value += tracker.move(sequence);
    exit();
    return value;
}
/** @type {Map} */ function map(line, _, blank) {
    return (blank ? '' : '    ') + line;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['quote'], null | undefined>}
 */ __turbopack_context__.s([
    "checkQuote",
    ()=>checkQuote
]);
function checkQuote(state) {
    const marker = state.options.quote || '"';
    if (marker !== '"' && marker !== "'") {
        throw new Error('Cannot serialize title with `' + marker + '` for `options.quote`, expected `"`, or `\'`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/definition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Definition, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "definition",
    ()=>definition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js [app-client] (ecmascript)");
;
function definition(node, _, state, info) {
    const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkQuote"])(state);
    const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
    const exit = state.enter('definition');
    let subexit = state.enter('label');
    const tracker = state.createTracker(info);
    let value = tracker.move('[');
    value += tracker.move(state.safe(state.associationId(node), {
        before: value,
        after: ']',
        ...tracker.current()
    }));
    value += tracker.move(']: ');
    subexit();
    if (// If there’s no url, or…
    !node.url || // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)) {
        subexit = state.enter('destinationLiteral');
        value += tracker.move('<');
        value += tracker.move(state.safe(node.url, {
            before: value,
            after: '>',
            ...tracker.current()
        }));
        value += tracker.move('>');
    } else {
        // No whitespace, raw is prettier.
        subexit = state.enter('destinationRaw');
        value += tracker.move(state.safe(node.url, {
            before: value,
            after: node.title ? ' ' : '\n',
            ...tracker.current()
        }));
    }
    subexit();
    if (node.title) {
        subexit = state.enter(`title${suffix}`);
        value += tracker.move(' ' + quote);
        value += tracker.move(state.safe(node.title, {
            before: value,
            after: quote,
            ...tracker.current()
        }));
        value += tracker.move(quote);
        subexit();
    }
    exit();
    return value;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['emphasis'], null | undefined>}
 */ __turbopack_context__.s([
    "checkEmphasis",
    ()=>checkEmphasis
]);
function checkEmphasis(state) {
    const marker = state.options.emphasis || '*';
    if (marker !== '*' && marker !== '_') {
        throw new Error('Cannot serialize emphasis with `' + marker + '` for `options.emphasis`, expected `*`, or `_`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Encode a code point as a character reference.
 *
 * @param {number} code
 *   Code point to encode.
 * @returns {string}
 *   Encoded character reference.
 */ __turbopack_context__.s([
    "encodeCharacterReference",
    ()=>encodeCharacterReference
]);
function encodeCharacterReference(code) {
    return '&#x' + code.toString(16).toUpperCase() + ';';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-info.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {EncodeSides} from '../types.js'
 */ __turbopack_context__.s([
    "encodeInfo",
    ()=>encodeInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$micromark$2d$util$2d$classify$2d$character$40$2$2e$0$2e$1$2f$node_modules$2f$micromark$2d$util$2d$classify$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/micromark-util-classify-character@2.0.1/node_modules/micromark-util-classify-character/dev/index.js [app-client] (ecmascript)");
;
function encodeInfo(outside, inside, marker) {
    const outsideKind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$micromark$2d$util$2d$classify$2d$character$40$2$2e$0$2e$1$2f$node_modules$2f$micromark$2d$util$2d$classify$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classifyCharacter"])(outside);
    const insideKind = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$micromark$2d$util$2d$classify$2d$character$40$2$2e$0$2e$1$2f$node_modules$2f$micromark$2d$util$2d$classify$2d$character$2f$dev$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classifyCharacter"])(inside);
    // Letter outside:
    if (outsideKind === undefined) {
        return insideKind === undefined ? // we have to encode *both* letters for `_` as it is looser.
        // it already forms for `*` (and GFMs `~`).
        marker === '_' ? {
            inside: true,
            outside: true
        } : {
            inside: false,
            outside: false
        } : insideKind === 1 ? {
            inside: true,
            outside: true
        } : {
            inside: false,
            outside: true
        };
    }
    // Whitespace outside:
    if (outsideKind === 1) {
        return insideKind === undefined ? {
            inside: false,
            outside: false
        } : insideKind === 1 ? {
            inside: true,
            outside: true
        } : {
            inside: false,
            outside: false
        };
    }
    // Punctuation outside:
    return insideKind === undefined ? {
        inside: false,
        outside: false
    } : insideKind === 1 ? {
        inside: true,
        outside: false
    } : {
        inside: false,
        outside: false
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/emphasis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Emphasis, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "emphasis",
    ()=>emphasis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$emphasis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-emphasis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-info.js [app-client] (ecmascript)");
;
;
;
emphasis.peek = emphasisPeek;
function emphasis(node, _, state, info) {
    const marker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$emphasis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkEmphasis"])(state);
    const exit = state.enter('emphasis');
    const tracker = state.createTracker(info);
    const before = tracker.move(marker);
    let between = tracker.move(state.containerPhrasing(node, {
        after: marker,
        before,
        ...tracker.current()
    }));
    const betweenHead = between.charCodeAt(0);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeInfo"])(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
    if (open.inside) {
        between = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(betweenHead) + between.slice(1);
    }
    const betweenTail = between.charCodeAt(between.length - 1);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeInfo"])(info.after.charCodeAt(0), betweenTail, marker);
    if (close.inside) {
        between = between.slice(0, -1) + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(betweenTail);
    }
    const after = tracker.move(marker);
    exit();
    state.attentionEncodeSurroundingInfo = {
        after: close.outside,
        before: open.outside
    };
    return before + between + after;
}
/**
 * @param {Emphasis} _
 * @param {Parents | undefined} _1
 * @param {State} state
 * @returns {string}
 */ function emphasisPeek(_, _1, state) {
    return state.options.emphasis || '*';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Heading} from 'mdast'
 */ __turbopack_context__.s([
    "formatHeadingAsSetext",
    ()=>formatHeadingAsSetext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$2d$parents$40$6$2e$0$2e$2$2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$string$40$4$2e$0$2e$0$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js [app-client] (ecmascript)");
;
;
function formatHeadingAsSetext(node, state) {
    let literalWithBreak = false;
    // Look for literals with a line break.
    // Note that this also
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["visit"])(node, function(node) {
        if ('value' in node && /\r?\n|\r/.test(node.value) || node.type === 'break') {
            literalWithBreak = true;
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$2d$parents$40$6$2e$0$2e$2$2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXIT"];
        }
    });
    return Boolean((!node.depth || node.depth < 3) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$string$40$4$2e$0$2e$0$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toString"])(node) && (state.options.setext || literalWithBreak));
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/heading.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Heading, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "heading",
    ()=>heading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$heading$2d$as$2d$setext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js [app-client] (ecmascript)");
;
;
function heading(node, _, state, info) {
    const rank = Math.max(Math.min(6, node.depth || 1), 1);
    const tracker = state.createTracker(info);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$heading$2d$as$2d$setext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHeadingAsSetext"])(node, state)) {
        const exit = state.enter('headingSetext');
        const subexit = state.enter('phrasing');
        const value = state.containerPhrasing(node, {
            ...tracker.current(),
            before: '\n',
            after: '\n'
        });
        subexit();
        exit();
        return value + '\n' + (rank === 1 ? '=' : '-').repeat(// The whole size…
        value.length - // Minus the position of the character after the last EOL (or
        // 0 if there is none)…
        (Math.max(value.lastIndexOf('\r'), value.lastIndexOf('\n')) + 1));
    }
    const sequence = '#'.repeat(rank);
    const exit = state.enter('headingAtx');
    const subexit = state.enter('phrasing');
    // Note: for proper tracking, we should reset the output positions when there
    // is no content returned, because then the space is not output.
    // Practically, in that case, there is no content, so it doesn’t matter that
    // we’ve tracked one too many characters.
    tracker.move(sequence + ' ');
    let value = state.containerPhrasing(node, {
        before: '# ',
        after: '\n',
        ...tracker.current()
    });
    if (/^[\t ]/.test(value)) {
        // To do: what effect has the character reference on tracking?
        value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(value.charCodeAt(0)) + value.slice(1);
    }
    value = value ? sequence + ' ' + value : sequence;
    if (state.options.closeAtx) {
        value += ' ' + sequence;
    }
    subexit();
    exit();
    return value;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/html.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Html} from 'mdast'
 */ __turbopack_context__.s([
    "html",
    ()=>html
]);
html.peek = htmlPeek;
function html(node) {
    return node.value || '';
}
/**
 * @returns {string}
 */ function htmlPeek() {
    return '<';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Image, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "image",
    ()=>image
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js [app-client] (ecmascript)");
;
image.peek = imagePeek;
function image(node, _, state, info) {
    const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkQuote"])(state);
    const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
    const exit = state.enter('image');
    let subexit = state.enter('label');
    const tracker = state.createTracker(info);
    let value = tracker.move('![');
    value += tracker.move(state.safe(node.alt, {
        before: value,
        after: ']',
        ...tracker.current()
    }));
    value += tracker.move('](');
    subexit();
    if (// If there’s no url but there is a title…
    !node.url && node.title || // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)) {
        subexit = state.enter('destinationLiteral');
        value += tracker.move('<');
        value += tracker.move(state.safe(node.url, {
            before: value,
            after: '>',
            ...tracker.current()
        }));
        value += tracker.move('>');
    } else {
        // No whitespace, raw is prettier.
        subexit = state.enter('destinationRaw');
        value += tracker.move(state.safe(node.url, {
            before: value,
            after: node.title ? ' ' : ')',
            ...tracker.current()
        }));
    }
    subexit();
    if (node.title) {
        subexit = state.enter(`title${suffix}`);
        value += tracker.move(' ' + quote);
        value += tracker.move(state.safe(node.title, {
            before: value,
            after: quote,
            ...tracker.current()
        }));
        value += tracker.move(quote);
        subexit();
    }
    value += tracker.move(')');
    exit();
    return value;
}
/**
 * @returns {string}
 */ function imagePeek() {
    return '!';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image-reference.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {ImageReference, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "imageReference",
    ()=>imageReference
]);
imageReference.peek = imageReferencePeek;
function imageReference(node, _, state, info) {
    const type = node.referenceType;
    const exit = state.enter('imageReference');
    let subexit = state.enter('label');
    const tracker = state.createTracker(info);
    let value = tracker.move('![');
    const alt = state.safe(node.alt, {
        before: value,
        after: ']',
        ...tracker.current()
    });
    value += tracker.move(alt + '][');
    subexit();
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter('reference');
    // Note: for proper tracking, we should reset the output positions when we end
    // up making a `shortcut` reference, because then there is no brace output.
    // Practically, in that case, there is no content, so it doesn’t matter that
    // we’ve tracked one too many characters.
    const reference = state.safe(state.associationId(node), {
        before: value,
        after: ']',
        ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit();
    if (type === 'full' || !alt || alt !== reference) {
        value += tracker.move(reference + ']');
    } else if (type === 'shortcut') {
        // Remove the unwanted `[`.
        value = value.slice(0, -1);
    } else {
        value += tracker.move(']');
    }
    return value;
}
/**
 * @returns {string}
 */ function imageReferencePeek() {
    return '!';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/inline-code.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {InlineCode, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "inlineCode",
    ()=>inlineCode
]);
inlineCode.peek = inlineCodePeek;
function inlineCode(node, _, state) {
    let value = node.value || '';
    let sequence = '`';
    let index = -1;
    // If there is a single grave accent on its own in the code, use a fence of
    // two.
    // If there are two in a row, use one.
    while(new RegExp('(^|[^`])' + sequence + '([^`]|$)').test(value)){
        sequence += '`';
    }
    // If this is not just spaces or eols (tabs don’t count), and either the
    // first or last character are a space, eol, or tick, then pad with spaces.
    if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^`|`$/.test(value))) {
        value = ' ' + value + ' ';
    }
    // We have a potential problem: certain characters after eols could result in
    // blocks being seen.
    // For example, if someone injected the string `'\n# b'`, then that would
    // result in an ATX heading.
    // We can’t escape characters in `inlineCode`, but because eols are
    // transformed to spaces when going from markdown to HTML anyway, we can swap
    // them out.
    while(++index < state.unsafe.length){
        const pattern = state.unsafe[index];
        const expression = state.compilePattern(pattern);
        /** @type {RegExpExecArray | null} */ let match;
        // Only look for `atBreak`s.
        // Btw: note that `atBreak` patterns will always start the regex at LF or
        // CR.
        if (!pattern.atBreak) continue;
        while(match = expression.exec(value)){
            let position = match.index;
            // Support CRLF (patterns only look for one of the characters).
            if (value.charCodeAt(position) === 10 /* `\n` */  && value.charCodeAt(position - 1) === 13 /* `\r` */ ) {
                position--;
            }
            value = value.slice(0, position) + ' ' + value.slice(match.index + 1);
        }
    }
    return sequence + value + sequence;
}
/**
 * @returns {string}
 */ function inlineCodePeek() {
    return '`';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Link} from 'mdast'
 */ __turbopack_context__.s([
    "formatLinkAsAutolink",
    ()=>formatLinkAsAutolink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$string$40$4$2e$0$2e$0$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js [app-client] (ecmascript)");
;
function formatLinkAsAutolink(node, state) {
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$string$40$4$2e$0$2e$0$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toString"])(node);
    return Boolean(!state.options.resourceLink && // If there’s a url…
    node.url && // And there’s a no title…
    !node.title && // And the content of `node` is a single text node…
    node.children && node.children.length === 1 && node.children[0].type === 'text' && // And if the url is the same as the content…
    (raw === node.url || 'mailto:' + raw === node.url) && // And that starts w/ a protocol…
    /^[a-z][a-z+.-]+:/i.test(node.url) && // And that doesn’t contain ASCII control codes (character escapes and
    // references don’t work), space, or angle brackets…
    !/[\0- <>\u007F]/.test(node.url));
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Link, Parents} from 'mdast'
 * @import {Exit} from '../types.js'
 */ __turbopack_context__.s([
    "link",
    ()=>link
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-quote.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$link$2d$as$2d$autolink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-link-as-autolink.js [app-client] (ecmascript)");
;
;
link.peek = linkPeek;
function link(node, _, state, info) {
    const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$quote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkQuote"])(state);
    const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
    const tracker = state.createTracker(info);
    /** @type {Exit} */ let exit;
    /** @type {Exit} */ let subexit;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$link$2d$as$2d$autolink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatLinkAsAutolink"])(node, state)) {
        // Hide the fact that we’re in phrasing, because escapes don’t work.
        const stack = state.stack;
        state.stack = [];
        exit = state.enter('autolink');
        let value = tracker.move('<');
        value += tracker.move(state.containerPhrasing(node, {
            before: value,
            after: '>',
            ...tracker.current()
        }));
        value += tracker.move('>');
        exit();
        state.stack = stack;
        return value;
    }
    exit = state.enter('link');
    subexit = state.enter('label');
    let value = tracker.move('[');
    value += tracker.move(state.containerPhrasing(node, {
        before: value,
        after: '](',
        ...tracker.current()
    }));
    value += tracker.move('](');
    subexit();
    if (// If there’s no url but there is a title…
    !node.url && node.title || // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)) {
        subexit = state.enter('destinationLiteral');
        value += tracker.move('<');
        value += tracker.move(state.safe(node.url, {
            before: value,
            after: '>',
            ...tracker.current()
        }));
        value += tracker.move('>');
    } else {
        // No whitespace, raw is prettier.
        subexit = state.enter('destinationRaw');
        value += tracker.move(state.safe(node.url, {
            before: value,
            after: node.title ? ' ' : ')',
            ...tracker.current()
        }));
    }
    subexit();
    if (node.title) {
        subexit = state.enter(`title${suffix}`);
        value += tracker.move(' ' + quote);
        value += tracker.move(state.safe(node.title, {
            before: value,
            after: quote,
            ...tracker.current()
        }));
        value += tracker.move(quote);
        subexit();
    }
    value += tracker.move(')');
    exit();
    return value;
}
/**
 * @param {Link} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @returns {string}
 */ function linkPeek(node, _, state) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$link$2d$as$2d$autolink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatLinkAsAutolink"])(node, state) ? '<' : '[';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link-reference.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {LinkReference, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "linkReference",
    ()=>linkReference
]);
linkReference.peek = linkReferencePeek;
function linkReference(node, _, state, info) {
    const type = node.referenceType;
    const exit = state.enter('linkReference');
    let subexit = state.enter('label');
    const tracker = state.createTracker(info);
    let value = tracker.move('[');
    const text = state.containerPhrasing(node, {
        before: value,
        after: ']',
        ...tracker.current()
    });
    value += tracker.move(text + '][');
    subexit();
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = state.stack;
    state.stack = [];
    subexit = state.enter('reference');
    // Note: for proper tracking, we should reset the output positions when we end
    // up making a `shortcut` reference, because then there is no brace output.
    // Practically, in that case, there is no content, so it doesn’t matter that
    // we’ve tracked one too many characters.
    const reference = state.safe(state.associationId(node), {
        before: value,
        after: ']',
        ...tracker.current()
    });
    subexit();
    state.stack = stack;
    exit();
    if (type === 'full' || !text || text !== reference) {
        value += tracker.move(reference + ']');
    } else if (type === 'shortcut') {
        // Remove the unwanted `[`.
        value = value.slice(0, -1);
    } else {
        value += tracker.move(']');
    }
    return value;
}
/**
 * @returns {string}
 */ function linkReferencePeek() {
    return '[';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['bullet'], null | undefined>}
 */ __turbopack_context__.s([
    "checkBullet",
    ()=>checkBullet
]);
function checkBullet(state) {
    const marker = state.options.bullet || '*';
    if (marker !== '*' && marker !== '+' && marker !== '-') {
        throw new Error('Cannot serialize items with `' + marker + '` for `options.bullet`, expected `*`, `+`, or `-`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ __turbopack_context__.s([
    "checkBulletOther",
    ()=>checkBulletOther
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js [app-client] (ecmascript)");
;
function checkBulletOther(state) {
    const bullet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkBullet"])(state);
    const bulletOther = state.options.bulletOther;
    if (!bulletOther) {
        return bullet === '*' ? '-' : '*';
    }
    if (bulletOther !== '*' && bulletOther !== '+' && bulletOther !== '-') {
        throw new Error('Cannot serialize items with `' + bulletOther + '` for `options.bulletOther`, expected `*`, `+`, or `-`');
    }
    if (bulletOther === bullet) {
        throw new Error('Expected `bullet` (`' + bullet + '`) and `bulletOther` (`' + bulletOther + '`) to be different');
    }
    return bulletOther;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['bulletOrdered'], null | undefined>}
 */ __turbopack_context__.s([
    "checkBulletOrdered",
    ()=>checkBulletOrdered
]);
function checkBulletOrdered(state) {
    const marker = state.options.bulletOrdered || '.';
    if (marker !== '.' && marker !== ')') {
        throw new Error('Cannot serialize items with `' + marker + '` for `options.bulletOrdered`, expected `.` or `)`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['rule'], null | undefined>}
 */ __turbopack_context__.s([
    "checkRule",
    ()=>checkRule
]);
function checkRule(state) {
    const marker = state.options.rule || '*';
    if (marker !== '*' && marker !== '-' && marker !== '_') {
        throw new Error('Cannot serialize rules with `' + marker + '` for `options.rule`, expected `*`, `-`, or `_`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {List, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "list",
    ()=>list
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2d$other$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-other.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2d$ordered$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet-ordered.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$rule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule.js [app-client] (ecmascript)");
;
;
;
;
function list(node, parent, state, info) {
    const exit = state.enter('list');
    const bulletCurrent = state.bulletCurrent;
    /** @type {string} */ let bullet = node.ordered ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2d$ordered$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkBulletOrdered"])(state) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkBullet"])(state);
    /** @type {string} */ const bulletOther = node.ordered ? bullet === '.' ? ')' : '.' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2d$other$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkBulletOther"])(state);
    let useDifferentMarker = parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;
    if (!node.ordered) {
        const firstListItem = node.children ? node.children[0] : undefined;
        // If there’s an empty first list item directly in two list items,
        // we have to use a different bullet:
        //
        // ```markdown
        // * - *
        // ```
        //
        // …because otherwise it would become one big thematic break.
        if (// Bullet could be used as a thematic break marker:
        (bullet === '*' || bullet === '-') && // Empty first list item:
        firstListItem && (!firstListItem.children || !firstListItem.children[0]) && // Directly in two other list items:
        state.stack[state.stack.length - 1] === 'list' && state.stack[state.stack.length - 2] === 'listItem' && state.stack[state.stack.length - 3] === 'list' && state.stack[state.stack.length - 4] === 'listItem' && // That are each the first child.
        state.indexStack[state.indexStack.length - 1] === 0 && state.indexStack[state.indexStack.length - 2] === 0 && state.indexStack[state.indexStack.length - 3] === 0) {
            useDifferentMarker = true;
        }
        // If there’s a thematic break at the start of the first list item,
        // we have to use a different bullet:
        //
        // ```markdown
        // * ---
        // ```
        //
        // …because otherwise it would become one big thematic break.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$rule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRule"])(state) === bullet && firstListItem) {
            let index = -1;
            while(++index < node.children.length){
                const item = node.children[index];
                if (item && item.type === 'listItem' && item.children && item.children[0] && item.children[0].type === 'thematicBreak') {
                    useDifferentMarker = true;
                    break;
                }
            }
        }
    }
    if (useDifferentMarker) {
        bullet = bulletOther;
    }
    state.bulletCurrent = bullet;
    const value = state.containerFlow(node, info);
    state.bulletLastUsed = bullet;
    state.bulletCurrent = bulletCurrent;
    exit();
    return value;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['listItemIndent'], null | undefined>}
 */ __turbopack_context__.s([
    "checkListItemIndent",
    ()=>checkListItemIndent
]);
function checkListItemIndent(state) {
    const style = state.options.listItemIndent || 'one';
    if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
        throw new Error('Cannot serialize items with `' + style + '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`');
    }
    return style;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list-item.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, Map, State} from 'mdast-util-to-markdown'
 * @import {ListItem, Parents} from 'mdast'
 */ __turbopack_context__.s([
    "listItem",
    ()=>listItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-bullet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$list$2d$item$2d$indent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-list-item-indent.js [app-client] (ecmascript)");
;
;
function listItem(node, parent, state, info) {
    const listItemIndent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$list$2d$item$2d$indent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkListItemIndent"])(state);
    let bullet = state.bulletCurrent || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$bullet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkBullet"])(state);
    // Add the marker value for ordered lists.
    if (parent && parent.type === 'list' && parent.ordered) {
        bullet = (typeof parent.start === 'number' && parent.start > -1 ? parent.start : 1) + (state.options.incrementListMarker === false ? 0 : parent.children.indexOf(node)) + bullet;
    }
    let size = bullet.length + 1;
    if (listItemIndent === 'tab' || listItemIndent === 'mixed' && (parent && parent.type === 'list' && parent.spread || node.spread)) {
        size = Math.ceil(size / 4) * 4;
    }
    const tracker = state.createTracker(info);
    tracker.move(bullet + ' '.repeat(size - bullet.length));
    tracker.shift(size);
    const exit = state.enter('listItem');
    const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
    exit();
    return value;
    //TURBOPACK unreachable
    ;
    /** @type {Map} */ function map(line, index, blank) {
        if (index) {
            return (blank ? '' : ' '.repeat(size)) + line;
        }
        return (blank ? bullet : bullet + ' '.repeat(size - bullet.length)) + line;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/paragraph.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Paragraph, Parents} from 'mdast'
 */ /**
 * @param {Paragraph} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */ __turbopack_context__.s([
    "paragraph",
    ()=>paragraph
]);
function paragraph(node, _, state, info) {
    const exit = state.enter('paragraph');
    const subexit = state.enter('phrasing');
    const value = state.containerPhrasing(node, info);
    subexit();
    exit();
    return value;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/root.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Root} from 'mdast'
 */ __turbopack_context__.s([
    "root",
    ()=>root
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$phrasing$40$4$2e$1$2e$0$2f$node_modules$2f$mdast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-phrasing@4.1.0/node_modules/mdast-util-phrasing/lib/index.js [app-client] (ecmascript)");
;
function root(node, _, state, info) {
    // Note: `html` nodes are ambiguous.
    const hasPhrasing = node.children.some(function(d) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$phrasing$40$4$2e$1$2e$0$2f$node_modules$2f$mdast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phrasing"])(d);
    });
    const container = hasPhrasing ? state.containerPhrasing : state.containerFlow;
    return container.call(state, node, info);
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-strong.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['strong'], null | undefined>}
 */ __turbopack_context__.s([
    "checkStrong",
    ()=>checkStrong
]);
function checkStrong(state) {
    const marker = state.options.strong || '*';
    if (marker !== '*' && marker !== '_') {
        throw new Error('Cannot serialize strong with `' + marker + '` for `options.strong`, expected `*`, or `_`');
    }
    return marker;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/strong.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Strong} from 'mdast'
 */ __turbopack_context__.s([
    "strong",
    ()=>strong
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-strong.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-info.js [app-client] (ecmascript)");
;
;
;
strong.peek = strongPeek;
function strong(node, _, state, info) {
    const marker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkStrong"])(state);
    const exit = state.enter('strong');
    const tracker = state.createTracker(info);
    const before = tracker.move(marker + marker);
    let between = tracker.move(state.containerPhrasing(node, {
        after: marker,
        before,
        ...tracker.current()
    }));
    const betweenHead = between.charCodeAt(0);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeInfo"])(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);
    if (open.inside) {
        between = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(betweenHead) + between.slice(1);
    }
    const betweenTail = between.charCodeAt(between.length - 1);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeInfo"])(info.after.charCodeAt(0), betweenTail, marker);
    if (close.inside) {
        between = between.slice(0, -1) + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(betweenTail);
    }
    const after = tracker.move(marker + marker);
    exit();
    state.attentionEncodeSurroundingInfo = {
        after: close.outside,
        before: open.outside
    };
    return before + between + after;
}
/**
 * @param {Strong} _
 * @param {Parents | undefined} _1
 * @param {State} state
 * @returns {string}
 */ function strongPeek(_, _1, state) {
    return state.options.strong || '*';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Text} from 'mdast'
 */ /**
 * @param {Text} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */ __turbopack_context__.s([
    "text",
    ()=>text
]);
function text(node, _, state, info) {
    return state.safe(node.value, info);
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */ /**
 * @param {State} state
 * @returns {Exclude<Options['ruleRepetition'], null | undefined>}
 */ __turbopack_context__.s([
    "checkRuleRepetition",
    ()=>checkRuleRepetition
]);
function checkRuleRepetition(state) {
    const repetition = state.options.ruleRepetition || 3;
    if (repetition < 3) {
        throw new Error('Cannot serialize rules with repetition `' + repetition + '` for `options.ruleRepetition`, expected `3` or more');
    }
    return repetition;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Parents, ThematicBreak} from 'mdast'
 */ __turbopack_context__.s([
    "thematicBreak",
    ()=>thematicBreak
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$rule$2d$repetition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule-repetition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$rule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/check-rule.js [app-client] (ecmascript)");
;
;
function thematicBreak(_, _1, state) {
    const value = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$rule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRule"])(state) + (state.options.ruleSpaces ? ' ' : '')).repeat((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$check$2d$rule$2d$repetition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRuleRepetition"])(state));
    return state.options.ruleSpaces ? value.slice(0, -1) : value;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handle",
    ()=>handle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$blockquote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/blockquote.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/break.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/code.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$definition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/definition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$emphasis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/emphasis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/heading.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$image$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/image-reference.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/inline-code.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$link$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/link-reference.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$list$2d$item$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/list-item.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$paragraph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/paragraph.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$root$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/root.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/strong.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$thematic$2d$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/thematic-break.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const handle = {
    blockquote: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$blockquote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blockquote"],
    break: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hardBreak"],
    code: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["code"],
    definition: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$definition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["definition"],
    emphasis: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$emphasis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emphasis"],
    hardBreak: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hardBreak"],
    heading: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    html: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["html"],
    image: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["image"],
    imageReference: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$image$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["imageReference"],
    inlineCode: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inlineCode"],
    link: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["link"],
    linkReference: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$link$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linkReference"],
    list: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["list"],
    listItem: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$list$2d$item$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listItem"],
    paragraph: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$paragraph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["paragraph"],
    root: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$root$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["root"],
    strong: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strong"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["text"],
    thematicBreak: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$thematic$2d$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["thematicBreak"]
};
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js [app-client] (ecmascript) <export handle as defaultHandlers>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultHandlers",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handle"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js [app-client] (ecmascript)");
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/configure.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options, State} from './types.js'
 */ __turbopack_context__.s([
    "configure",
    ()=>configure
]);
const own = {}.hasOwnProperty;
function configure(base, extension) {
    let index = -1;
    /** @type {keyof Options} */ let key;
    // First do subextensions.
    if (extension.extensions) {
        while(++index < extension.extensions.length){
            configure(base, extension.extensions[index]);
        }
    }
    for(key in extension){
        if (own.call(extension, key)) {
            switch(key){
                case 'extensions':
                    {
                        break;
                    }
                /* c8 ignore next 4 */ case 'unsafe':
                    {
                        list(base[key], extension[key]);
                        break;
                    }
                case 'join':
                    {
                        list(base[key], extension[key]);
                        break;
                    }
                case 'handlers':
                    {
                        map(base[key], extension[key]);
                        break;
                    }
                default:
                    {
                        // @ts-expect-error: matches.
                        base.options[key] = extension[key];
                    }
            }
        }
    }
    return base;
}
/**
 * @template T
 * @param {Array<T>} left
 * @param {Array<T> | null | undefined} right
 */ function list(left, right) {
    if (right) {
        left.push(...right);
    }
}
/**
 * @template T
 * @param {Record<string, T>} left
 * @param {Record<string, T> | null | undefined} right
 */ function map(left, right) {
    if (right) {
        Object.assign(left, right);
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/join.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Join} from 'mdast-util-to-markdown'
 */ __turbopack_context__.s([
    "join",
    ()=>join
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$code$2d$as$2d$indented$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-code-as-indented.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$heading$2d$as$2d$setext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/format-heading-as-setext.js [app-client] (ecmascript)");
;
;
const join = [
    joinDefaults
];
/** @type {Join} */ function joinDefaults(left, right, parent, state) {
    // Indented code after list or another indented code.
    if (right.type === 'code' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$code$2d$as$2d$indented$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCodeAsIndented"])(right, state) && (left.type === 'list' || left.type === right.type && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$code$2d$as$2d$indented$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCodeAsIndented"])(left, state))) {
        return false;
    }
    // Join children of a list or an item.
    // In which case, `parent` has a `spread` field.
    if ('spread' in parent && typeof parent.spread === 'boolean') {
        if (left.type === 'paragraph' && // Two paragraphs.
        (left.type === right.type || right.type === 'definition' || right.type === 'heading' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$format$2d$heading$2d$as$2d$setext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatHeadingAsSetext"])(right, state))) {
            return;
        }
        return parent.spread ? 1 : 0;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/unsafe.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
 */ /**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain things like attention (emphasis, strong), images, or links.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 *
 * @type {Array<ConstructName>}
 */ __turbopack_context__.s([
    "unsafe",
    ()=>unsafe
]);
const fullPhrasingSpans = [
    'autolink',
    'destinationLiteral',
    'destinationRaw',
    'reference',
    'titleQuote',
    'titleApostrophe'
];
const unsafe = [
    {
        character: '\t',
        after: '[\\r\\n]',
        inConstruct: 'phrasing'
    },
    {
        character: '\t',
        before: '[\\r\\n]',
        inConstruct: 'phrasing'
    },
    {
        character: '\t',
        inConstruct: [
            'codeFencedLangGraveAccent',
            'codeFencedLangTilde'
        ]
    },
    {
        character: '\r',
        inConstruct: [
            'codeFencedLangGraveAccent',
            'codeFencedLangTilde',
            'codeFencedMetaGraveAccent',
            'codeFencedMetaTilde',
            'destinationLiteral',
            'headingAtx'
        ]
    },
    {
        character: '\n',
        inConstruct: [
            'codeFencedLangGraveAccent',
            'codeFencedLangTilde',
            'codeFencedMetaGraveAccent',
            'codeFencedMetaTilde',
            'destinationLiteral',
            'headingAtx'
        ]
    },
    {
        character: ' ',
        after: '[\\r\\n]',
        inConstruct: 'phrasing'
    },
    {
        character: ' ',
        before: '[\\r\\n]',
        inConstruct: 'phrasing'
    },
    {
        character: ' ',
        inConstruct: [
            'codeFencedLangGraveAccent',
            'codeFencedLangTilde'
        ]
    },
    // An exclamation mark can start an image, if it is followed by a link or
    // a link reference.
    {
        character: '!',
        after: '\\[',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    // A quote can break out of a title.
    {
        character: '"',
        inConstruct: 'titleQuote'
    },
    // A number sign could start an ATX heading if it starts a line.
    {
        atBreak: true,
        character: '#'
    },
    {
        character: '#',
        inConstruct: 'headingAtx',
        after: '(?:[\r\n]|$)'
    },
    // Dollar sign and percentage are not used in markdown.
    // An ampersand could start a character reference.
    {
        character: '&',
        after: '[#A-Za-z]',
        inConstruct: 'phrasing'
    },
    // An apostrophe can break out of a title.
    {
        character: "'",
        inConstruct: 'titleApostrophe'
    },
    // A left paren could break out of a destination raw.
    {
        character: '(',
        inConstruct: 'destinationRaw'
    },
    // A left paren followed by `]` could make something into a link or image.
    {
        before: '\\]',
        character: '(',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    // A right paren could start a list item or break out of a destination
    // raw.
    {
        atBreak: true,
        before: '\\d+',
        character: ')'
    },
    {
        character: ')',
        inConstruct: 'destinationRaw'
    },
    // An asterisk can start thematic breaks, list items, emphasis, strong.
    {
        atBreak: true,
        character: '*',
        after: '(?:[ \t\r\n*])'
    },
    {
        character: '*',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    // A plus sign could start a list item.
    {
        atBreak: true,
        character: '+',
        after: '(?:[ \t\r\n])'
    },
    // A dash can start thematic breaks, list items, and setext heading
    // underlines.
    {
        atBreak: true,
        character: '-',
        after: '(?:[ \t\r\n-])'
    },
    // A dot could start a list item.
    {
        atBreak: true,
        before: '\\d+',
        character: '.',
        after: '(?:[ \t\r\n]|$)'
    },
    // Slash, colon, and semicolon are not used in markdown for constructs.
    // A less than can start html (flow or text) or an autolink.
    // HTML could start with an exclamation mark (declaration, cdata, comment),
    // slash (closing tag), question mark (instruction), or a letter (tag).
    // An autolink also starts with a letter.
    // Finally, it could break out of a destination literal.
    {
        atBreak: true,
        character: '<',
        after: '[!/?A-Za-z]'
    },
    {
        character: '<',
        after: '[!/?A-Za-z]',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    {
        character: '<',
        inConstruct: 'destinationLiteral'
    },
    // An equals to can start setext heading underlines.
    {
        atBreak: true,
        character: '='
    },
    // A greater than can start block quotes and it can break out of a
    // destination literal.
    {
        atBreak: true,
        character: '>'
    },
    {
        character: '>',
        inConstruct: 'destinationLiteral'
    },
    // Question mark and at sign are not used in markdown for constructs.
    // A left bracket can start definitions, references, labels,
    {
        atBreak: true,
        character: '['
    },
    {
        character: '[',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    {
        character: '[',
        inConstruct: [
            'label',
            'reference'
        ]
    },
    // A backslash can start an escape (when followed by punctuation) or a
    // hard break (when followed by an eol).
    // Note: typical escapes are handled in `safe`!
    {
        character: '\\',
        after: '[\\r\\n]',
        inConstruct: 'phrasing'
    },
    // A right bracket can exit labels.
    {
        character: ']',
        inConstruct: [
            'label',
            'reference'
        ]
    },
    // Caret is not used in markdown for constructs.
    // An underscore can start emphasis, strong, or a thematic break.
    {
        atBreak: true,
        character: '_'
    },
    {
        character: '_',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    // A grave accent can start code (fenced or text), or it can break out of
    // a grave accent code fence.
    {
        atBreak: true,
        character: '`'
    },
    {
        character: '`',
        inConstruct: [
            'codeFencedLangGraveAccent',
            'codeFencedMetaGraveAccent'
        ]
    },
    {
        character: '`',
        inConstruct: 'phrasing',
        notInConstruct: fullPhrasingSpans
    },
    // Left brace, vertical bar, right brace are not used in markdown for
    // constructs.
    // A tilde can start code (fenced).
    {
        atBreak: true,
        character: '~'
    }
];
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/association.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {AssociationId} from '../types.js'
 */ __turbopack_context__.s([
    "association",
    ()=>association
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$micromark$2d$util$2d$decode$2d$string$40$2$2e$0$2e$1$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$string$2f$dev$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/micromark-util-decode-string@2.0.1/node_modules/micromark-util-decode-string/dev/index.js [app-client] (ecmascript)");
;
function association(node) {
    if (node.label || !node.identifier) {
        return node.label || '';
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$micromark$2d$util$2d$decode$2d$string$40$2$2e$0$2e$1$2f$node_modules$2f$micromark$2d$util$2d$decode$2d$string$2f$dev$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeString"])(node.identifier);
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/compile-pattern.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {CompilePattern} from '../types.js'
 */ /**
 * @type {CompilePattern}
 */ __turbopack_context__.s([
    "compilePattern",
    ()=>compilePattern
]);
function compilePattern(pattern) {
    if (!pattern._compiled) {
        const before = (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') + (pattern.before ? '(?:' + pattern.before + ')' : '');
        pattern._compiled = new RegExp((before ? '(' + before + ')' : '') + (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') + pattern.character + (pattern.after ? '(?:' + pattern.after + ')' : ''), 'g');
    }
    return pattern._compiled;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/container-phrasing.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Handle, Info, State} from 'mdast-util-to-markdown'
 * @import {PhrasingParents} from '../types.js'
 */ __turbopack_context__.s([
    "containerPhrasing",
    ()=>containerPhrasing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js [app-client] (ecmascript)");
;
function containerPhrasing(parent, state, info) {
    const indexStack = state.indexStack;
    const children = parent.children || [];
    /** @type {Array<string>} */ const results = [];
    let index = -1;
    let before = info.before;
    /** @type {string | undefined} */ let encodeAfter;
    indexStack.push(-1);
    let tracker = state.createTracker(info);
    while(++index < children.length){
        const child = children[index];
        /** @type {string} */ let after;
        indexStack[indexStack.length - 1] = index;
        if (index + 1 < children.length) {
            /** @type {Handle} */ // @ts-expect-error: hush, it’s actually a `zwitch`.
            let handle = state.handle.handlers[children[index + 1].type];
            /** @type {Handle} */ // @ts-expect-error: hush, it’s actually a `zwitch`.
            if (handle && handle.peek) handle = handle.peek;
            after = handle ? handle(children[index + 1], parent, state, {
                before: '',
                after: '',
                ...tracker.current()
            }).charAt(0) : '';
        } else {
            after = info.after;
        }
        // In some cases, html (text) can be found in phrasing right after an eol.
        // When we’d serialize that, in most cases that would be seen as html
        // (flow).
        // As we can’t escape or so to prevent it from happening, we take a somewhat
        // reasonable approach: replace that eol with a space.
        // See: <https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
        if (results.length > 0 && (before === '\r' || before === '\n') && child.type === 'html') {
            results[results.length - 1] = results[results.length - 1].replace(/(\r?\n|\r)$/, ' ');
            before = ' ';
            // To do: does this work to reset tracker?
            tracker = state.createTracker(info);
            tracker.move(results.join(''));
        }
        let value = state.handle(child, parent, state, {
            ...tracker.current(),
            after,
            before
        });
        // If we had to encode the first character after the previous node and it’s
        // still the same character,
        // encode it.
        if (encodeAfter && encodeAfter === value.slice(0, 1)) {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(encodeAfter.charCodeAt(0)) + value.slice(1);
        }
        const encodingInfo = state.attentionEncodeSurroundingInfo;
        state.attentionEncodeSurroundingInfo = undefined;
        encodeAfter = undefined;
        // If we have to encode the first character before the current node and
        // it’s still the same character,
        // encode it.
        if (encodingInfo) {
            if (results.length > 0 && encodingInfo.before && before === results[results.length - 1].slice(-1)) {
                results[results.length - 1] = results[results.length - 1].slice(0, -1) + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(before.charCodeAt(0));
            }
            if (encodingInfo.after) encodeAfter = after;
        }
        tracker.move(value);
        results.push(value);
        before = value.slice(-1);
    }
    indexStack.pop();
    return results.join('');
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/container-flow.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {FlowChildren, FlowParents, TrackFields} from '../types.js'
 */ /**
 * @param {FlowParents} parent
 *   Parent of flow nodes.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {TrackFields} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined by (blank) lines.
 */ __turbopack_context__.s([
    "containerFlow",
    ()=>containerFlow
]);
function containerFlow(parent, state, info) {
    const indexStack = state.indexStack;
    const children = parent.children || [];
    const tracker = state.createTracker(info);
    /** @type {Array<string>} */ const results = [];
    let index = -1;
    indexStack.push(-1);
    while(++index < children.length){
        const child = children[index];
        indexStack[indexStack.length - 1] = index;
        results.push(tracker.move(state.handle(child, parent, state, {
            before: '\n',
            after: '\n',
            ...tracker.current()
        })));
        if (child.type !== 'list') {
            state.bulletLastUsed = undefined;
        }
        if (index < children.length - 1) {
            results.push(tracker.move(between(child, children[index + 1], parent, state)));
        }
    }
    indexStack.pop();
    return results.join('');
}
/**
 * @param {FlowChildren} left
 * @param {FlowChildren} right
 * @param {FlowParents} parent
 * @param {State} state
 * @returns {string}
 */ function between(left, right, parent, state) {
    let index = state.join.length;
    while(index--){
        const result = state.join[index](left, right, parent, state);
        if (result === true || result === 1) {
            break;
        }
        if (typeof result === 'number') {
            return '\n'.repeat(1 + result);
        }
        if (result === false) {
            return '\n\n<!---->\n\n';
        }
    }
    return '\n\n';
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/indent-lines.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {IndentLines} from '../types.js'
 */ __turbopack_context__.s([
    "indentLines",
    ()=>indentLines
]);
const eol = /\r?\n|\r/g;
function indentLines(value, map) {
    /** @type {Array<string>} */ const result = [];
    let start = 0;
    let line = 0;
    /** @type {RegExpExecArray | null} */ let match;
    while(match = eol.exec(value)){
        one(value.slice(start, match.index));
        result.push(match[0]);
        start = match.index + match[0].length;
        line++;
    }
    one(value.slice(start));
    return result.join('');
    //TURBOPACK unreachable
    ;
    /**
   * @param {string} value
   */ function one(value) {
        result.push(map(value, line, !value));
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/safe.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {SafeConfig, State} from 'mdast-util-to-markdown'
 */ __turbopack_context__.s([
    "safe",
    ()=>safe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/encode-character-reference.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$pattern$2d$in$2d$scope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/pattern-in-scope.js [app-client] (ecmascript)");
;
;
function safe(state, input, config) {
    const value = (config.before || '') + (input || '') + (config.after || '');
    /** @type {Array<number>} */ const positions = [];
    /** @type {Array<string>} */ const result = [];
    /** @type {Record<number, {before: boolean, after: boolean}>} */ const infos = {};
    let index = -1;
    while(++index < state.unsafe.length){
        const pattern = state.unsafe[index];
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$pattern$2d$in$2d$scope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patternInScope"])(state.stack, pattern)) {
            continue;
        }
        const expression = state.compilePattern(pattern);
        /** @type {RegExpExecArray | null} */ let match;
        while(match = expression.exec(value)){
            const before = 'before' in pattern || Boolean(pattern.atBreak);
            const after = 'after' in pattern;
            const position = match.index + (before ? match[1].length : 0);
            if (positions.includes(position)) {
                if (infos[position].before && !before) {
                    infos[position].before = false;
                }
                if (infos[position].after && !after) {
                    infos[position].after = false;
                }
            } else {
                positions.push(position);
                infos[position] = {
                    before,
                    after
                };
            }
        }
    }
    positions.sort(numerical);
    let start = config.before ? config.before.length : 0;
    const end = value.length - (config.after ? config.after.length : 0);
    index = -1;
    while(++index < positions.length){
        const position = positions[index];
        // Character before or after matched:
        if (position < start || position >= end) {
            continue;
        }
        // If this character is supposed to be escaped because it has a condition on
        // the next character, and the next character is definitly being escaped,
        // then skip this escape.
        if (position + 1 < end && positions[index + 1] === position + 1 && infos[position].after && !infos[position + 1].before && !infos[position + 1].after || positions[index - 1] === position - 1 && infos[position].before && !infos[position - 1].before && !infos[position - 1].after) {
            continue;
        }
        if (start !== position) {
            // If we have to use a character reference, an ampersand would be more
            // correct, but as backslashes only care about punctuation, either will
            // do the trick
            result.push(escapeBackslashes(value.slice(start, position), '\\'));
        }
        start = position;
        if (/[!-/:-@[-`{-~]/.test(value.charAt(position)) && (!config.encode || !config.encode.includes(value.charAt(position)))) {
            // Character escape.
            result.push('\\');
        } else {
            // Character reference.
            result.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$encode$2d$character$2d$reference$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeCharacterReference"])(value.charCodeAt(position)));
            start++;
        }
    }
    result.push(escapeBackslashes(value.slice(start, end), config.after));
    return result.join('');
}
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */ function numerical(a, b) {
    return a - b;
}
/**
 * @param {string} value
 * @param {string} after
 * @returns {string}
 */ function escapeBackslashes(value, after) {
    const expression = /\\(?=[!-/:-@[-`{-~])/g;
    /** @type {Array<number>} */ const positions = [];
    /** @type {Array<string>} */ const results = [];
    const whole = value + after;
    let index = -1;
    let start = 0;
    /** @type {RegExpExecArray | null} */ let match;
    while(match = expression.exec(whole)){
        positions.push(match.index);
    }
    while(++index < positions.length){
        if (start !== positions[index]) {
            results.push(value.slice(start, positions[index]));
        }
        results.push('\\');
        start = positions[index];
    }
    results.push(value.slice(start));
    return results.join('');
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/track.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {CreateTracker, TrackCurrent, TrackMove, TrackShift} from '../types.js'
 */ /**
 * Track positional info in the output.
 *
 * @type {CreateTracker}
 */ __turbopack_context__.s([
    "track",
    ()=>track
]);
function track(config) {
    // Defaults are used to prevent crashes when older utilities somehow activate
    // this code.
    /* c8 ignore next 5 */ const options = config || {};
    const now = options.now || {};
    let lineShift = options.lineShift || 0;
    let line = now.line || 1;
    let column = now.column || 1;
    return {
        move,
        current,
        shift
    };
    //TURBOPACK unreachable
    ;
    /**
   * Get the current tracked info.
   *
   * @type {TrackCurrent}
   */ function current() {
        return {
            now: {
                line,
                column
            },
            lineShift
        };
    }
    /**
   * Define an increased line shift (the typical indent for lines).
   *
   * @type {TrackShift}
   */ function shift(value) {
        lineShift += value;
    }
    /**
   * Move past some generated markdown.
   *
   * @type {TrackMove}
   */ function move(input) {
        // eslint-disable-next-line unicorn/prefer-default-parameters
        const value = input || '';
        const chunks = value.split(/\r?\n|\r/g);
        const tail = chunks[chunks.length - 1];
        line += chunks.length - 1;
        column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
        return value;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Info, Join, Options, SafeConfig, State} from 'mdast-util-to-markdown'
 * @import {Nodes} from 'mdast'
 * @import {Enter, FlowParents, PhrasingParents, TrackFields} from './types.js'
 */ __turbopack_context__.s([
    "toMarkdown",
    ()=>toMarkdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$zwitch$40$2$2e$0$2e$4$2f$node_modules$2f$zwitch$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/zwitch@2.0.4/node_modules/zwitch/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/configure.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/handle/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$join$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/join.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$unsafe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/unsafe.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$association$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/association.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$compile$2d$pattern$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/compile-pattern.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$container$2d$phrasing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/container-phrasing.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$container$2d$flow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/container-flow.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$indent$2d$lines$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/indent-lines.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$safe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/safe.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$track$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-markdown@2.1.2/node_modules/mdast-util-to-markdown/lib/util/track.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
function toMarkdown(tree, options) {
    const settings = options || {};
    /** @type {State} */ const state = {
        associationId: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$association$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["association"],
        containerPhrasing: containerPhrasingBound,
        containerFlow: containerFlowBound,
        createTracker: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$track$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["track"],
        compilePattern: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$compile$2d$pattern$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compilePattern"],
        enter,
        // @ts-expect-error: GFM / frontmatter are typed in `mdast` but not defined
        // here.
        handlers: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$handle$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handle"]
        },
        // @ts-expect-error: add `handle` in a second.
        handle: undefined,
        indentLines: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$indent$2d$lines$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indentLines"],
        indexStack: [],
        join: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$join$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["join"]
        ],
        options: {},
        safe: safeBound,
        stack: [],
        unsafe: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$unsafe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsafe"]
        ]
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["configure"])(state, settings);
    if (state.options.tightDefinitions) {
        state.join.push(joinDefinition);
    }
    state.handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$zwitch$40$2$2e$0$2e$4$2f$node_modules$2f$zwitch$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zwitch"])('type', {
        invalid,
        unknown,
        handlers: state.handlers
    });
    let result = state.handle(tree, undefined, state, {
        before: '\n',
        after: '\n',
        now: {
            line: 1,
            column: 1
        },
        lineShift: 0
    });
    if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) {
        result += '\n';
    }
    return result;
    //TURBOPACK unreachable
    ;
    /** @type {Enter} */ function enter(name) {
        state.stack.push(name);
        return exit;
        //TURBOPACK unreachable
        ;
        /**
     * @returns {undefined}
     */ function exit() {
            state.stack.pop();
        }
    }
}
/**
 * @param {unknown} value
 * @returns {never}
 */ function invalid(value) {
    throw new Error('Cannot handle value `' + value + '`, expected node');
}
/**
 * @param {unknown} value
 * @returns {never}
 */ function unknown(value) {
    // Always a node.
    const node = value;
    throw new Error('Cannot handle unknown node `' + node.type + '`');
}
/** @type {Join} */ function joinDefinition(left, right) {
    // No blank line between adjacent definitions.
    if (left.type === 'definition' && left.type === right.type) {
        return 0;
    }
}
/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * These children will be joined flush together.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {PhrasingParents} parent
 *   Parent of flow nodes.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined together.
 */ function containerPhrasingBound(parent, info) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$container$2d$phrasing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["containerPhrasing"])(parent, this, info);
}
/**
 * Serialize the children of a parent that contains flow children.
 *
 * These children will typically be joined by blank lines.
 * What they are joined by exactly is defined by `Join` functions.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {FlowParents} parent
 *   Parent of flow nodes.
 * @param {TrackFields} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined by (blank) lines.
 */ function containerFlowBound(parent, info) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$container$2d$flow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["containerFlow"])(parent, this, info);
}
/**
 * Make a string safe for embedding in markdown constructs.
 *
 * In markdown, almost all punctuation characters can, in certain cases,
 * result in something.
 * Whether they do is highly subjective to where they happen and in what
 * they happen.
 *
 * To solve this, `mdast-util-to-markdown` tracks:
 *
 * * Characters before and after something;
 * * What “constructs” we are in.
 *
 * This information is then used by this function to escape or encode
 * special characters.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {string | null | undefined} value
 *   Raw value to make safe.
 * @param {SafeConfig} config
 *   Configuration.
 * @returns {string}
 *   Serialized markdown safe for embedding.
 */ function safeBound(value, config) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$markdown$40$2$2e$1$2e$2$2f$node_modules$2f$mdast$2d$util$2d$to$2d$markdown$2f$lib$2f$util$2f$safe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["safe"])(this, value, config);
}
}),
]);

//# sourceMappingURL=e20fa_mdast-util-to-markdown_lib_f28066b3._.js.map
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/a.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Link, PhrasingContent} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Link}
 *   mdast node.
 */ __turbopack_context__.s([
    "a",
    ()=>a
]);
function a(state, node) {
    const properties = node.properties || {};
    // Allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    const children = state.all(node);
    /** @type {Link} */ const result = {
        type: 'link',
        url: state.resolve(String(properties.href || '') || null),
        title: properties.title ? String(properties.title) : null,
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/base.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {undefined}
 *   Nothing.
 */ __turbopack_context__.s([
    "base",
    ()=>base
]);
function base(state, node) {
    if (!state.baseFound) {
        state.frozenBaseUrl = String(node.properties && node.properties.href || '') || undefined;
        state.baseFound = true;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/blockquote.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Blockquote} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Blockquote}
 *   mdast node.
 */ __turbopack_context__.s([
    "blockquote",
    ()=>blockquote
]);
function blockquote(state, node) {
    /** @type {Blockquote} */ const result = {
        type: 'blockquote',
        children: state.toFlow(state.all(node))
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/br.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Break} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Break}
 *   mdast node.
 */ __turbopack_context__.s([
    "br",
    ()=>br
]);
function br(state, node) {
    /** @type {Break} */ const result = {
        type: 'break'
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/code.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Code} from 'mdast'
 */ __turbopack_context__.s([
    "code",
    ()=>code
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-text@4.0.2/node_modules/hast-util-to-text/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$trim$2d$trailing$2d$lines$40$2$2e$1$2e$0$2f$node_modules$2f$trim$2d$trailing$2d$lines$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/trim-trailing-lines@2.1.0/node_modules/trim-trailing-lines/index.js [app-client] (ecmascript)");
;
;
const prefix = 'language-';
function code(state, node) {
    const children = node.children;
    let index = -1;
    /** @type {Array<number | string> | undefined} */ let classList;
    /** @type {string | undefined} */ let lang;
    if (node.tagName === 'pre') {
        while(++index < children.length){
            const child = children[index];
            if (child.type === 'element' && child.tagName === 'code' && child.properties && child.properties.className && Array.isArray(child.properties.className)) {
                classList = child.properties.className;
                break;
            }
        }
    }
    if (classList) {
        index = -1;
        while(++index < classList.length){
            if (String(classList[index]).slice(0, prefix.length) === prefix) {
                lang = String(classList[index]).slice(prefix.length);
                break;
            }
        }
    }
    /** @type {Code} */ const result = {
        type: 'code',
        lang: lang || null,
        meta: null,
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$trim$2d$trailing$2d$lines$40$2$2e$1$2e$0$2f$node_modules$2f$trim$2d$trailing$2d$lines$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trimTrailingLines"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toText"])(node))
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/comment.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Comment} from 'hast'
 * @import {Html} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Comment>} node
 *   hast element to transform.
 * @returns {Html}
 *   mdast node.
 */ __turbopack_context__.s([
    "comment",
    ()=>comment
]);
function comment(state, node) {
    /** @type {Html} */ const result = {
        type: 'html',
        value: '<!--' + node.value + '-->'
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/del.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Delete, PhrasingContent} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Delete}
 *   mdast node.
 */ __turbopack_context__.s([
    "del",
    ()=>del
]);
function del(state, node) {
    // Allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    const children = state.all(node);
    /** @type {Delete} */ const result = {
        type: 'delete',
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/list-items-spread.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {ListContent} from 'mdast'
 */ /**
 * Infer whether list items are spread.
 *
 * @param {Readonly<Array<Readonly<ListContent>>>} children
 *   List items.
 * @returns {boolean}
 *   Whether one or more list items are spread.
 */ __turbopack_context__.s([
    "listItemsSpread",
    ()=>listItemsSpread
]);
function listItemsSpread(children) {
    let index = -1;
    if (children.length > 1) {
        while(++index < children.length){
            if (children[index].spread) {
                return true;
            }
        }
    }
    return false;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/dl.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {ElementContent, Element} from 'hast'
 * @import {BlockContent, DefinitionContent, ListContent, ListItem, List} from 'mdast'
 */ /**
 * @typedef Group
 *   Title/definition group.
 * @property {Array<Element>} titles
 *   One or more titles.
 * @property {Array<ElementContent>} definitions
 *   One or more definitions.
 */ __turbopack_context__.s([
    "dl",
    ()=>dl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$list$2d$items$2d$spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/list-items-spread.js [app-client] (ecmascript)");
;
function dl(state, node) {
    /** @type {Array<ElementContent>} */ const clean = [];
    /** @type {Array<Group>} */ const groups = [];
    let index = -1;
    // Unwrap `<div>`s
    while(++index < node.children.length){
        const child = node.children[index];
        if (child.type === 'element' && child.tagName === 'div') {
            clean.push(...child.children);
        } else {
            clean.push(child);
        }
    }
    /** @type {Group} */ let group = {
        definitions: [],
        titles: []
    };
    index = -1;
    // Group titles and definitions.
    while(++index < clean.length){
        const child = clean[index];
        if (child.type === 'element' && child.tagName === 'dt') {
            const previous = clean[index - 1];
            if (previous && previous.type === 'element' && previous.tagName === 'dd') {
                groups.push(group);
                group = {
                    definitions: [],
                    titles: []
                };
            }
            group.titles.push(child);
        } else {
            group.definitions.push(child);
        }
    }
    groups.push(group);
    // Create items.
    index = -1;
    /** @type {Array<ListContent>} */ const content = [];
    while(++index < groups.length){
        const result = [
            ...handle(state, groups[index].titles),
            ...handle(state, groups[index].definitions)
        ];
        if (result.length > 0) {
            content.push({
                type: 'listItem',
                spread: result.length > 1,
                checked: null,
                children: result
            });
        }
    }
    // Create a list if there are items.
    if (content.length > 0) {
        /** @type {List} */ const result = {
            type: 'list',
            ordered: false,
            start: null,
            spread: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$list$2d$items$2d$spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listItemsSpread"])(content),
            children: content
        };
        state.patch(node, result);
        return result;
    }
}
/**
 * @param {State} state
 *   State.
 * @param {Array<ElementContent>} children
 *   hast element children to transform.
 * @returns {Array<BlockContent | DefinitionContent>}
 *   mdast nodes.
 */ function handle(state, children) {
    const nodes = state.all({
        type: 'root',
        children
    });
    const listItems = state.toSpecificContent(nodes, create);
    if (listItems.length === 0) {
        return [];
    }
    if (listItems.length === 1) {
        return listItems[0].children;
    }
    return [
        {
            type: 'list',
            ordered: false,
            start: null,
            spread: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$list$2d$items$2d$spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listItemsSpread"])(listItems),
            children: listItems
        }
    ];
}
/**
 * @returns {ListItem}
 */ function create() {
    return {
        type: 'listItem',
        spread: false,
        checked: null,
        children: []
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/em.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Emphasis, PhrasingContent} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Emphasis}
 *   mdast node.
 */ __turbopack_context__.s([
    "em",
    ()=>em
]);
function em(state, node) {
    // Allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    const children = state.all(node);
    /** @type {Emphasis} */ const result = {
        type: 'emphasis',
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/drop-surrounding-breaks.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Nodes} from 'mdast'
 */ /**
 * Drop trailing initial and final `br`s.
 *
 * @template {Nodes} Node
 *   Node type.
 * @param {Array<Node>} nodes
 *   List of nodes.
 * @returns {Array<Node>}
 *   List of nodes w/o `break`s.
 */ __turbopack_context__.s([
    "dropSurroundingBreaks",
    ()=>dropSurroundingBreaks
]);
function dropSurroundingBreaks(nodes) {
    let start = 0;
    let end = nodes.length;
    while(start < end && nodes[start].type === 'break')start++;
    while(end > start && nodes[end - 1].type === 'break')end--;
    return start === 0 && end === nodes.length ? nodes : nodes.slice(start, end);
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/heading.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Heading, PhrasingContent} from 'mdast'
 */ __turbopack_context__.s([
    "heading",
    ()=>heading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$drop$2d$surrounding$2d$breaks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/drop-surrounding-breaks.js [app-client] (ecmascript)");
;
function heading(state, node) {
    const depth = /* c8 ignore next */ Number(node.tagName.charAt(1)) || 1;
    const children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$drop$2d$surrounding$2d$breaks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropSurroundingBreaks"])(state.all(node));
    /** @type {Heading} */ const result = {
        type: 'heading',
        depth,
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/hr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {ThematicBreak} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {ThematicBreak}
 *   mdast node.
 */ __turbopack_context__.s([
    "hr",
    ()=>hr
]);
function hr(state, node) {
    /** @type {ThematicBreak} */ const result = {
        type: 'thematicBreak'
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/iframe.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Link} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Link | undefined}
 *   mdast node.
 */ __turbopack_context__.s([
    "iframe",
    ()=>iframe
]);
function iframe(state, node) {
    const properties = node.properties || {};
    const source = String(properties.src || '');
    const title = String(properties.title || '');
    // Only create a link if there is a title.
    // We can’t use the content of the frame because conforming HTML parsers treat
    // it as text, whereas legacy parsers treat it as HTML, so it will likely
    // contain tags that will show up in text.
    if (source && title) {
        /** @type {Link} */ const result = {
            type: 'link',
            title: null,
            url: state.resolve(source),
            children: [
                {
                    type: 'text',
                    value: title
                }
            ]
        };
        state.patch(node, result);
        return result;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/img.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Image} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Image}
 *   mdast node.
 */ __turbopack_context__.s([
    "img",
    ()=>img
]);
function img(state, node) {
    const properties = node.properties || {};
    /** @type {Image} */ const result = {
        type: 'image',
        url: state.resolve(String(properties.src || '') || null),
        title: properties.title ? String(properties.title) : null,
        alt: properties.alt ? String(properties.alt) : ''
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/inline-code.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {InlineCode} from 'mdast'
 */ __turbopack_context__.s([
    "inlineCode",
    ()=>inlineCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-text@4.0.2/node_modules/hast-util-to-text/lib/index.js [app-client] (ecmascript)");
;
function inlineCode(state, node) {
    /** @type {InlineCode} */ const result = {
        type: 'inlineCode',
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toText"])(node)
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/find-selected-options.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Element, Properties} from 'hast'
 */ /**
 * @typedef {[string, Value]} Option
 *   Option, where the item at `0` is the label, the item at `1` the value.
 *
 * @typedef {Array<Option>} Options
 *   List of options.
 *
 * @typedef {string | undefined} Value
 *   `value` field of option.
 */ __turbopack_context__.s([
    "findSelectedOptions",
    ()=>findSelectedOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-text@4.0.2/node_modules/hast-util-to-text/lib/index.js [app-client] (ecmascript)");
;
function findSelectedOptions(node, explicitProperties) {
    /** @type {Array<Element>} */ const selectedOptions = [];
    /** @type {Options} */ const values = [];
    const properties = explicitProperties || node.properties || {};
    const options = findOptions(node);
    const size = Math.min(Number.parseInt(String(properties.size), 10), 0) || (properties.multiple ? 4 : 1);
    let index = -1;
    while(++index < options.length){
        const option = options[index];
        if (option && option.properties && option.properties.selected) {
            selectedOptions.push(option);
        }
    }
    const list = selectedOptions.length > 0 ? selectedOptions : options;
    const max = Math.min(list.length, size);
    index = -1;
    while(++index < max){
        const option = list[index];
        const properties = option.properties || {};
        const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toText"])(option);
        const label = content || String(properties.label || '');
        const value = String(properties.value || '') || content;
        values.push([
            value,
            label === value ? undefined : label
        ]);
    }
    return values;
}
/**
 * @param {Element} node
 *   Parent to find in.
 * @returns {Array<Element>}
 *   Option elements.
 */ function findOptions(node) {
    /** @type {Array<Element>} */ const results = [];
    let index = -1;
    while(++index < node.children.length){
        const child = node.children[index];
        if ('children' in child && Array.isArray(child.children)) {
            results.push(...findOptions(child));
        }
        if (child.type === 'element' && child.tagName === 'option' && (!child.properties || !child.properties.disabled)) {
            results.push(child);
        }
    }
    return results;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/input.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Image, Link, Text} from 'mdast'
 * @import {Options} from '../util/find-selected-options.js'
 */ __turbopack_context__.s([
    "input",
    ()=>input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$find$2d$selected$2d$options$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/find-selected-options.js [app-client] (ecmascript)");
;
const defaultChecked = '[x]';
const defaultUnchecked = '[ ]';
function input(state, node) {
    const properties = node.properties || {};
    const value = String(properties.value || properties.placeholder || '');
    if (properties.disabled || properties.type === 'hidden' || properties.type === 'file') {
        return;
    }
    if (properties.type === 'checkbox' || properties.type === 'radio') {
        /** @type {Text} */ const result = {
            type: 'text',
            value: properties.checked ? state.options.checked || defaultChecked : state.options.unchecked || defaultUnchecked
        };
        state.patch(node, result);
        return result;
    }
    if (properties.type === 'image') {
        const alt = properties.alt || value;
        if (alt) {
            /** @type {Image} */ const result = {
                type: 'image',
                url: state.resolve(String(properties.src || '') || null),
                title: String(properties.title || '') || null,
                alt: String(alt)
            };
            state.patch(node, result);
            return result;
        }
        return;
    }
    /** @type {Options} */ let values = [];
    if (value) {
        values = [
            [
                value,
                undefined
            ]
        ];
    } else if (// `list` is not supported on these types:
    properties.type !== 'button' && properties.type !== 'file' && properties.type !== 'password' && properties.type !== 'reset' && properties.type !== 'submit' && properties.list) {
        const list = String(properties.list);
        const datalist = state.elementById.get(list);
        if (datalist && datalist.tagName === 'datalist') {
            values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$find$2d$selected$2d$options$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSelectedOptions"])(datalist, properties);
        }
    }
    if (values.length === 0) {
        return;
    }
    // Hide password value.
    if (properties.type === 'password') {
        // Passwords don’t support `list`.
        values[0] = [
            '•'.repeat(values[0][0].length),
            undefined
        ];
    }
    if (properties.type === 'email' || properties.type === 'url') {
        /** @type {Array<Link | Text>} */ const results = [];
        let index = -1;
        while(++index < values.length){
            const value = state.resolve(values[index][0]);
            /** @type {Link} */ const result = {
                type: 'link',
                title: null,
                url: properties.type === 'email' ? 'mailto:' + value : value,
                children: [
                    {
                        type: 'text',
                        value: values[index][1] || value
                    }
                ]
            };
            results.push(result);
            if (index !== values.length - 1) {
                results.push({
                    type: 'text',
                    value: ', '
                });
            }
        }
        return results;
    }
    /** @type {Array<string>} */ const texts = [];
    let index = -1;
    while(++index < values.length){
        texts.push(values[index][1] ? values[index][1] + ' (' + values[index][0] + ')' : values[index][0]);
    }
    /** @type {Text} */ const result = {
        type: 'text',
        value: texts.join(', ')
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/li.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {ListItem} from 'mdast'
 */ /**
 * @typedef ExtractResult
 *   Result of extracting a leading checkbox.
 * @property {Element | undefined} checkbox
 *   The checkbox that was removed, if any.
 * @property {Element} rest
 *   If there was a leading checkbox, a deep clone of the node w/o the leading
 *   checkbox; otherwise a reference to the given, untouched, node.
 */ __turbopack_context__.s([
    "li",
    ()=>li
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$phrasing$40$3$2e$0$2e$1$2f$node_modules$2f$hast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-phrasing@3.0.1/node_modules/hast-util-phrasing/lib/index.js [app-client] (ecmascript)");
;
function li(state, node) {
    // If the list item starts with a checkbox, remove the checkbox and mark the
    // list item as a GFM task list item.
    const { rest, checkbox } = extractLeadingCheckbox(node);
    const checked = checkbox ? Boolean(checkbox.properties.checked) : null;
    const spread = spreadout(rest);
    const children = state.toFlow(state.all(rest));
    /** @type {ListItem} */ const result = {
        type: 'listItem',
        spread,
        checked,
        children
    };
    state.patch(node, result);
    return result;
}
/**
 * Check if an element should spread out.
 *
 * The reason to spread out a markdown list item is primarily whether writing
 * the equivalent in markdown, would yield a spread out item.
 *
 * A spread out item results in `<p>` and `</p>` tags.
 * Otherwise, the phrasing would be output directly.
 * We can check for that: if there’s a `<p>` element, spread it out.
 *
 * But what if there are no paragraphs?
 * In that case, we can also assume that if two “block” things were written in
 * an item, that it is spread out, because blocks are typically joined by blank
 * lines, which also means a spread item.
 *
 * Lastly, because in HTML things can be wrapped in a `<div>` or similar, we
 * delve into non-phrasing elements here to figure out if they themselves
 * contain paragraphs or 2 or more flow non-phrasing elements.
 *
 * @param {Readonly<Element>} node
 * @returns {boolean}
 */ function spreadout(node) {
    let index = -1;
    let seenFlow = false;
    while(++index < node.children.length){
        const child = node.children[index];
        if (child.type === 'element') {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$phrasing$40$3$2e$0$2e$1$2f$node_modules$2f$hast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phrasing"])(child)) continue;
            if (child.tagName === 'p' || seenFlow || spreadout(child)) {
                return true;
            }
            seenFlow = true;
        }
    }
    return false;
}
/**
 * Extract a leading checkbox from a list item.
 *
 * If there was a leading checkbox, makes a deep clone of the node w/o the
 * leading checkbox; otherwise a reference to the given, untouched, node is
 * given back.
 *
 * So for example:
 *
 * ```html
 * <li><input type="checkbox">Text</li>
 * ```
 *
 * …becomes:
 *
 * ```html
 * <li>Text</li>
 * ```
 *
 * ```html
 * <li><p><input type="checkbox">Text</p></li>
 * ```
 *
 * …becomes:
 *
 * ```html
 * <li><p>Text</p></li>
 * ```
 *
 * @param {Readonly<Element>} node
 * @returns {ExtractResult}
 */ function extractLeadingCheckbox(node) {
    const head = node.children[0];
    if (head && head.type === 'element' && head.tagName === 'input' && head.properties && (head.properties.type === 'checkbox' || head.properties.type === 'radio')) {
        const rest = {
            ...node,
            children: node.children.slice(1)
        };
        return {
            checkbox: head,
            rest
        };
    }
    // The checkbox may be nested in another element.
    // If the first element has children, look for a leading checkbox inside it.
    //
    // This only handles nesting in `<p>` elements, which is most common.
    // It’s possible a leading checkbox might be nested in other types of flow or
    // phrasing elements (and *deeply* nested, which is not possible with `<p>`).
    // Limiting things to `<p>` elements keeps this simpler for now.
    if (head && head.type === 'element' && head.tagName === 'p') {
        const { checkbox, rest: restHead } = extractLeadingCheckbox(head);
        if (checkbox) {
            const rest = {
                ...node,
                children: [
                    restHead,
                    ...node.children.slice(1)
                ]
            };
            return {
                checkbox,
                rest
            };
        }
    }
    return {
        checkbox: undefined,
        rest: node
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/list.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {ListItem, List} from 'mdast'
 */ __turbopack_context__.s([
    "list",
    ()=>list
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$list$2d$items$2d$spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/list-items-spread.js [app-client] (ecmascript)");
;
function list(state, node) {
    const ordered = node.tagName === 'ol';
    const children = state.toSpecificContent(state.all(node), create);
    /** @type {number | null} */ let start = null;
    if (ordered) {
        start = node.properties && node.properties.start ? Number.parseInt(String(node.properties.start), 10) : 1;
    }
    /** @type {List} */ const result = {
        type: 'list',
        ordered,
        start,
        spread: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$list$2d$items$2d$spread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listItemsSpread"])(children),
        children
    };
    state.patch(node, result);
    return result;
}
/**
 * @returns {ListItem}
 */ function create() {
    return {
        type: 'listItem',
        spread: false,
        checked: null,
        children: []
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/wrap.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {} from 'mdast-util-to-hast'
 * @import {
 *   BlockContent,
 *   Delete,
 *   Link,
 *   Nodes,
 *   Paragraph,
 *   Parents,
 *   PhrasingContent,
 *   RootContent
 * } from 'mdast'
 */ __turbopack_context__.s([
    "wrap",
    ()=>wrap,
    "wrapNeeded",
    ()=>wrapNeeded
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$ungap$2b$structured$2d$clone$40$1$2e$3$2e$0$2f$node_modules$2f40$ungap$2f$structured$2d$clone$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$phrasing$40$3$2e$0$2e$1$2f$node_modules$2f$hast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-phrasing@3.0.1/node_modules/hast-util-phrasing/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$whitespace$40$3$2e$0$2e$0$2f$node_modules$2f$hast$2d$util$2d$whitespace$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-whitespace@3.0.0/node_modules/hast-util-whitespace/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$phrasing$40$4$2e$1$2e$0$2f$node_modules$2f$mdast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-phrasing@4.1.0/node_modules/mdast-util-phrasing/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$drop$2d$surrounding$2d$breaks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/drop-surrounding-breaks.js [app-client] (ecmascript)");
;
;
;
;
;
function wrapNeeded(nodes) {
    let index = -1;
    while(++index < nodes.length){
        const node = nodes[index];
        if (!phrasing(node) || 'children' in node && wrapNeeded(node.children)) {
            return true;
        }
    }
    return false;
}
function wrap(nodes) {
    return runs(nodes, onphrasing, function(d) {
        return d;
    });
    //TURBOPACK unreachable
    ;
    /**
   * @param {Array<PhrasingContent>} nodes
   * @returns {Array<Paragraph>}
   */ function onphrasing(nodes) {
        return nodes.every(function(d) {
            return d.type === 'text' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$whitespace$40$3$2e$0$2e$0$2f$node_modules$2f$hast$2d$util$2d$whitespace$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["whitespace"])(d.value) : false;
        }) ? [] : [
            {
                type: 'paragraph',
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$drop$2d$surrounding$2d$breaks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropSurroundingBreaks"])(nodes)
            }
        ];
    }
}
/**
 * @param {Delete | Link} node
 * @returns {Array<BlockContent>}
 */ function split(node) {
    return runs(node.children, onphrasing, onnonphrasing);
    //TURBOPACK unreachable
    ;
    /**
   * Use `parent`, put the phrasing run inside it.
   *
   * @param {Array<PhrasingContent>} nodes
   * @returns {Array<BlockContent>}
   */ function onphrasing(nodes) {
        const newParent = cloneWithoutChildren(node);
        newParent.children = nodes;
        // @ts-expect-error Assume fine.
        return [
            newParent
        ];
    }
    /**
   * Use `child`, add `parent` as its first child, put the original children
   * into `parent`.
   * If `child` is not a parent, `parent` will not be added.
   *
   * @param {BlockContent} child
   * @returns {BlockContent}
   */ function onnonphrasing(child) {
        if ('children' in child && 'children' in node) {
            const newParent = cloneWithoutChildren(node);
            const newChild = cloneWithoutChildren(child);
            // @ts-expect-error Assume fine.
            newParent.children = child.children;
            // @ts-expect-error Assume fine.
            newChild.children.push(newParent);
            return newChild;
        }
        return {
            ...child
        };
    }
}
/**
 * Wrap all runs of mdast phrasing content in `paragraph` nodes.
 *
 * @param {Array<RootContent>} nodes
 *   List of input nodes.
 * @param {(nodes: Array<PhrasingContent>) => Array<BlockContent>} onphrasing
 *   Turn phrasing content into block content.
 * @param {(node: BlockContent) => BlockContent} onnonphrasing
 *   Map block content (defaults to keeping them as-is).
 * @returns {Array<BlockContent>}
 */ function runs(nodes, onphrasing, onnonphrasing) {
    const flattened = flatten(nodes);
    /** @type {Array<BlockContent>} */ const result = [];
    /** @type {Array<PhrasingContent>} */ let queue = [];
    let index = -1;
    while(++index < flattened.length){
        const node = flattened[index];
        if (phrasing(node)) {
            queue.push(node);
        } else {
            if (queue.length > 0) {
                result.push(...onphrasing(queue));
                queue = [];
            }
            // @ts-expect-error Assume non-phrasing.
            result.push(onnonphrasing(node));
        }
    }
    if (queue.length > 0) {
        result.push(...onphrasing(queue));
        queue = [];
    }
    return result;
}
/**
 * Flatten a list of nodes.
 *
 * @param {Array<RootContent>} nodes
 *   List of nodes, will unravel `delete` and `link`.
 * @returns {Array<RootContent>}
 *   Unraveled nodes.
 */ function flatten(nodes) {
    /** @type {Array<RootContent>} */ const flattened = [];
    let index = -1;
    while(++index < nodes.length){
        const node = nodes[index];
        // Straddling: some elements are *weird*.
        // Namely: `map`, `ins`, `del`, and `a`, as they are hybrid elements.
        // See: <https://html.spec.whatwg.org/#paragraphs>.
        // Paragraphs are the weirdest of them all.
        // See the straddling fixture for more info!
        // `ins` is ignored in mdast, so we don’t need to worry about that.
        // `map` maps to its content, so we don’t need to worry about that either.
        // `del` maps to `delete` and `a` to `link`, so we do handle those.
        // What we’ll do is split `node` over each of its children.
        if ((node.type === 'delete' || node.type === 'link') && wrapNeeded(node.children)) {
            flattened.push(...split(node));
        } else {
            flattened.push(node);
        }
    }
    return flattened;
}
/**
 * Check if an mdast node is phrasing.
 *
 * Also supports checking embedded hast fields.
 *
 * @param {Nodes} node
 *   mdast node to check.
 * @returns {node is PhrasingContent}
 *   Whether `node` is phrasing content (includes nodes with `hName` fields
 *   set to phrasing hast element names).
 */ function phrasing(node) {
    const tagName = node.data && node.data.hName;
    return tagName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$phrasing$40$3$2e$0$2e$1$2f$node_modules$2f$hast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phrasing"])({
        type: 'element',
        tagName,
        properties: {},
        children: []
    }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$phrasing$40$4$2e$1$2e$0$2f$node_modules$2f$mdast$2d$util$2d$phrasing$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["phrasing"])(node);
}
/**
 * @template {Parents} ParentType
 *   Parent type.
 * @param {ParentType} node
 *   Node to clone.
 * @returns {ParentType}
 *   Cloned node, without children.
 */ function cloneWithoutChildren(node) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$ungap$2b$structured$2d$clone$40$1$2e$3$2e$0$2f$node_modules$2f40$ungap$2f$structured$2d$clone$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
        ...node,
        children: []
    });
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/media.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Image, Link, PhrasingContent, RootContent as MdastRootContent, Root} from 'mdast'
 */ __turbopack_context__.s([
    "media",
    ()=>media
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$string$40$4$2e$0$2e$0$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$2d$parents$40$6$2e$0$2e$2$2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/wrap.js [app-client] (ecmascript)");
;
;
;
function media(state, node) {
    const properties = node.properties || {};
    const poster = node.tagName === 'video' ? String(properties.poster || '') : '';
    let source = String(properties.src || '');
    let index = -1;
    let linkInFallbackContent = false;
    let nodes = state.all(node);
    /** @type {Root} */ const fragment = {
        type: 'root',
        children: nodes
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["visit"])(fragment, function(node) {
        if (node.type === 'link') {
            linkInFallbackContent = true;
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$2d$parents$40$6$2e$0$2e$2$2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EXIT"];
        }
    });
    // If the content links to something, or if it’s not phrasing…
    if (linkInFallbackContent || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapNeeded"])(nodes)) {
        return nodes;
    }
    // Find the source.
    while(!source && ++index < node.children.length){
        const child = node.children[index];
        if (child.type === 'element' && child.tagName === 'source' && child.properties) {
            source = String(child.properties.src || '');
        }
    }
    // If there’s a poster defined on the video, create an image.
    if (poster) {
        /** @type {Image} */ const image = {
            type: 'image',
            title: null,
            url: state.resolve(poster),
            alt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$mdast$2d$util$2d$to$2d$string$40$4$2e$0$2e$0$2f$node_modules$2f$mdast$2d$util$2d$to$2d$string$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toString"])(nodes)
        };
        state.patch(node, image);
        nodes = [
            image
        ];
    }
    // Allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    const children = nodes;
    // Link to the media resource.
    /** @type {Link} */ const result = {
        type: 'link',
        title: properties.title ? String(properties.title) : null,
        url: state.resolve(source),
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/p.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Paragraph, PhrasingContent} from 'mdast'
 */ __turbopack_context__.s([
    "p",
    ()=>p
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$drop$2d$surrounding$2d$breaks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/drop-surrounding-breaks.js [app-client] (ecmascript)");
;
function p(state, node) {
    const children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$drop$2d$surrounding$2d$breaks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropSurroundingBreaks"])(state.all(node));
    if (children.length > 0) {
        /** @type {Paragraph} */ const result = {
            type: 'paragraph',
            children
        };
        state.patch(node, result);
        return result;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/q.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {RootContent as MdastRootContent} from 'mdast'
 */ __turbopack_context__.s([
    "q",
    ()=>q
]);
const defaultQuotes = [
    '"'
];
function q(state, node) {
    const quotes = state.options.quotes || defaultQuotes;
    state.qNesting++;
    const contents = state.all(node);
    state.qNesting--;
    const quote = quotes[state.qNesting % quotes.length];
    const head = contents[0];
    const tail = contents[contents.length - 1];
    const open = quote.charAt(0);
    const close = quote.length > 1 ? quote.charAt(1) : quote;
    if (head && head.type === 'text') {
        head.value = open + head.value;
    } else {
        contents.unshift({
            type: 'text',
            value: open
        });
    }
    if (tail && tail.type === 'text') {
        tail.value += close;
    } else {
        contents.push({
            type: 'text',
            value: close
        });
    }
    return contents;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/root.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Root as HastRoot} from 'hast'
 * @import {Root as MdastRoot} from 'mdast'
 */ __turbopack_context__.s([
    "root",
    ()=>root
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/wrap.js [app-client] (ecmascript)");
;
function root(state, node) {
    let children = state.all(node);
    if (state.options.document || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapNeeded"])(children)) {
        children = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrap"])(children);
    }
    /** @type {MdastRoot} */ const result = {
        type: 'root',
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Text} from 'mdast'
 */ __turbopack_context__.s([
    "select",
    ()=>select
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$find$2d$selected$2d$options$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/find-selected-options.js [app-client] (ecmascript)");
;
function select(state, node) {
    const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$find$2d$selected$2d$options$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSelectedOptions"])(node);
    let index = -1;
    /** @type {Array<string>} */ const results = [];
    while(++index < values.length){
        const value = values[index];
        results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0]);
    }
    if (results.length > 0) {
        /** @type {Text} */ const result = {
            type: 'text',
            value: results.join(', ')
        };
        state.patch(node, result);
        return result;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/strong.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {PhrasingContent, Strong} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Strong}
 *   mdast node.
 */ __turbopack_context__.s([
    "strong",
    ()=>strong
]);
function strong(state, node) {
    // Allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    const children = state.all(node);
    /** @type {Strong} */ const result = {
        type: 'strong',
        children
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/table-cell.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {PhrasingContent, TableCell} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {TableCell}
 *   mdast node.
 */ __turbopack_context__.s([
    "tableCell",
    ()=>tableCell
]);
function tableCell(state, node) {
    // Allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    const children = state.all(node);
    /** @type {TableCell} */ const result = {
        type: 'tableCell',
        children
    };
    state.patch(node, result);
    if (node.properties) {
        const rowSpan = node.properties.rowSpan;
        const colSpan = node.properties.colSpan;
        if (rowSpan || colSpan) {
            const data = result.data || (result.data = {});
            if (rowSpan) data.hastUtilToMdastTemporaryRowSpan = rowSpan;
            if (colSpan) data.hastUtilToMdastTemporaryColSpan = colSpan;
        }
    }
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/table-row.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {RowContent, TableRow} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {TableRow}
 *   mdast node.
 */ __turbopack_context__.s([
    "tableRow",
    ()=>tableRow
]);
function tableRow(state, node) {
    const children = state.toSpecificContent(state.all(node), create);
    /** @type {TableRow} */ const result = {
        type: 'tableRow',
        children
    };
    state.patch(node, result);
    return result;
}
/**
 * @returns {RowContent}
 */ function create() {
    return {
        type: 'tableCell',
        children: []
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/table.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {AlignType, RowContent, TableContent, Table, Text} from 'mdast'
 */ /**
 * @typedef Info
 *   Inferred info on a table.
 * @property {Array<AlignType>} align
 *   Alignment.
 * @property {boolean} headless
 *   Whether a `thead` is missing.
 */ __turbopack_context__.s([
    "table",
    ()=>table
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-text@4.0.2/node_modules/hast-util-to-text/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$2d$parents$40$6$2e$0$2e$2$2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit-parents@6.0.2/node_modules/unist-util-visit-parents/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js [app-client] (ecmascript) <locals>");
;
;
function table(state, node) {
    // Ignore nested tables.
    if (state.inTable) {
        /** @type {Text} */ const result = {
            type: 'text',
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toText"])(node)
        };
        state.patch(node, result);
        return result;
    }
    state.inTable = true;
    const { align, headless } = inspect(node);
    const rows = state.toSpecificContent(state.all(node), createRow);
    // Add an empty header row.
    if (headless) {
        rows.unshift(createRow());
    }
    let rowIndex = -1;
    while(++rowIndex < rows.length){
        const row = rows[rowIndex];
        const cells = state.toSpecificContent(row.children, createCell);
        row.children = cells;
    }
    let columns = 1;
    rowIndex = -1;
    while(++rowIndex < rows.length){
        const cells = rows[rowIndex].children;
        let cellIndex = -1;
        while(++cellIndex < cells.length){
            const cell = cells[cellIndex];
            if (cell.data) {
                const data = cell.data;
                const colSpan = Number.parseInt(String(data.hastUtilToMdastTemporaryColSpan), 10) || 1;
                const rowSpan = Number.parseInt(String(data.hastUtilToMdastTemporaryRowSpan), 10) || 1;
                if (colSpan > 1 || rowSpan > 1) {
                    let otherRowIndex = rowIndex - 1;
                    while(++otherRowIndex < rowIndex + rowSpan){
                        let colIndex = cellIndex - 1;
                        while(++colIndex < cellIndex + colSpan){
                            if (!rows[otherRowIndex]) {
                                break;
                            }
                            /** @type {Array<RowContent>} */ const newCells = [];
                            if (otherRowIndex !== rowIndex || colIndex !== cellIndex) {
                                newCells.push({
                                    type: 'tableCell',
                                    children: []
                                });
                            }
                            rows[otherRowIndex].children.splice(colIndex, 0, ...newCells);
                        }
                    }
                }
                // Clean the data fields.
                if ('hastUtilToMdastTemporaryColSpan' in cell.data) delete cell.data.hastUtilToMdastTemporaryColSpan;
                if ('hastUtilToMdastTemporaryRowSpan' in cell.data) delete cell.data.hastUtilToMdastTemporaryRowSpan;
                if (Object.keys(cell.data).length === 0) delete cell.data;
            }
        }
        if (cells.length > columns) columns = cells.length;
    }
    // Add extra empty cells.
    rowIndex = -1;
    while(++rowIndex < rows.length){
        const cells = rows[rowIndex].children;
        let cellIndex = cells.length - 1;
        while(++cellIndex < columns){
            cells.push({
                type: 'tableCell',
                children: []
            });
        }
    }
    let alignIndex = align.length - 1;
    while(++alignIndex < columns){
        align.push(null);
    }
    state.inTable = false;
    /** @type {Table} */ const result = {
        type: 'table',
        align,
        children: rows
    };
    state.patch(node, result);
    return result;
}
/**
 * Infer whether the HTML table has a head and how it aligns.
 *
 * @param {Readonly<Element>} node
 *   Table element to check.
 * @returns {Info}
 *   Info.
 */ function inspect(node) {
    /** @type {Info} */ const info = {
        align: [
            null
        ],
        headless: true
    };
    let rowIndex = 0;
    let cellIndex = 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["visit"])(node, function(child) {
        if (child.type === 'element') {
            // Don’t enter nested tables.
            if (child.tagName === 'table' && node !== child) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$2d$parents$40$6$2e$0$2e$2$2f$node_modules$2f$unist$2d$util$2d$visit$2d$parents$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKIP"];
            }
            if ((child.tagName === 'th' || child.tagName === 'td') && child.properties) {
                if (!info.align[cellIndex]) {
                    const value = String(child.properties.align || '') || null;
                    if (value === 'center' || value === 'left' || value === 'right' || value === null) {
                        info.align[cellIndex] = value;
                    }
                }
                // If there is a `th` in the first row, assume there is a header row.
                if (info.headless && rowIndex < 2 && child.tagName === 'th') {
                    info.headless = false;
                }
                cellIndex++;
            } else if (child.tagName === 'thead') {
                info.headless = false;
            } else if (child.tagName === 'tr') {
                rowIndex++;
                cellIndex = 0;
            }
        }
    });
    return info;
}
/**
 * @returns {RowContent}
 */ function createCell() {
    return {
        type: 'tableCell',
        children: []
    };
}
/**
 * @returns {TableContent}
 */ function createRow() {
    return {
        type: 'tableRow',
        children: []
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Text as HastText} from 'hast'
 * @import {Text as MdastText} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<HastText>} node
 *   hast element to transform.
 * @returns {MdastText}
 *   mdast node.
 */ __turbopack_context__.s([
    "text",
    ()=>text
]);
function text(state, node) {
    /** @type {MdastText} */ const result = {
        type: 'text',
        value: node.value
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/textarea.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Text} from 'mdast'
 */ __turbopack_context__.s([
    "textarea",
    ()=>textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-text@4.0.2/node_modules/hast-util-to-text/lib/index.js [app-client] (ecmascript)");
;
function textarea(state, node) {
    /** @type {Text} */ const result = {
        type: 'text',
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$text$40$4$2e$0$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$text$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toText"])(node)
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/wbr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Text} from 'mdast'
 */ /**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Text}
 *   mdast node.
 */ __turbopack_context__.s([
    "wbr",
    ()=>wbr
]);
function wbr(state, node) {
    /** @type {Text} */ const result = {
        type: 'text',
        value: '\u200B'
    };
    state.patch(node, result);
    return result;
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Parents} from 'hast'
 */ __turbopack_context__.s([
    "handlers",
    ()=>handlers,
    "nodeHandlers",
    ()=>nodeHandlers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/a.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$base$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/base.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$blockquote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/blockquote.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$br$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/br.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/code.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$comment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/comment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$del$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/del.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$dl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/dl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$em$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/em.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/heading.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$hr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/hr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$iframe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/iframe.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$img$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/img.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/inline-code.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/input.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$li$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/li.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/list.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$media$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/media.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$p$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/p.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$q$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/q.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$root$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/root.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/select.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/strong.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2d$cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/table-cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2d$row$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/table-row.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/table.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$textarea$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/textarea.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$wbr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/wbr.js [app-client] (ecmascript)");
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
const nodeHandlers = {
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$comment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["comment"],
    doctype: ignore,
    root: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$root$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["root"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["text"]
};
const handlers = {
    // Ignore:
    applet: ignore,
    area: ignore,
    basefont: ignore,
    bgsound: ignore,
    caption: ignore,
    col: ignore,
    colgroup: ignore,
    command: ignore,
    content: ignore,
    datalist: ignore,
    dialog: ignore,
    element: ignore,
    embed: ignore,
    frame: ignore,
    frameset: ignore,
    isindex: ignore,
    keygen: ignore,
    link: ignore,
    math: ignore,
    menu: ignore,
    menuitem: ignore,
    meta: ignore,
    nextid: ignore,
    noembed: ignore,
    noframes: ignore,
    optgroup: ignore,
    option: ignore,
    param: ignore,
    script: ignore,
    shadow: ignore,
    source: ignore,
    spacer: ignore,
    style: ignore,
    svg: ignore,
    template: ignore,
    title: ignore,
    track: ignore,
    // Use children:
    abbr: all,
    acronym: all,
    bdi: all,
    bdo: all,
    big: all,
    blink: all,
    button: all,
    canvas: all,
    cite: all,
    data: all,
    details: all,
    dfn: all,
    font: all,
    ins: all,
    label: all,
    map: all,
    marquee: all,
    meter: all,
    nobr: all,
    noscript: all,
    object: all,
    output: all,
    progress: all,
    rb: all,
    rbc: all,
    rp: all,
    rt: all,
    rtc: all,
    ruby: all,
    slot: all,
    small: all,
    span: all,
    sup: all,
    sub: all,
    tbody: all,
    tfoot: all,
    thead: all,
    time: all,
    // Use children as flow.
    address: flow,
    article: flow,
    aside: flow,
    body: flow,
    center: flow,
    div: flow,
    fieldset: flow,
    figcaption: flow,
    figure: flow,
    form: flow,
    footer: flow,
    header: flow,
    hgroup: flow,
    html: flow,
    legend: flow,
    main: flow,
    multicol: flow,
    nav: flow,
    picture: flow,
    section: flow,
    // Handle.
    a: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"],
    audio: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$media$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["media"],
    b: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strong"],
    base: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$base$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["base"],
    blockquote: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$blockquote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blockquote"],
    br: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$br$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["br"],
    code: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inlineCode"],
    dir: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["list"],
    dl: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$dl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dl"],
    dt: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$li$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["li"],
    dd: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$li$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["li"],
    del: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$del$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["del"],
    em: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$em$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["em"],
    h1: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    h2: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    h3: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    h4: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    h5: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    h6: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$heading$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heading"],
    hr: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$hr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hr"],
    i: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$em$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["em"],
    iframe: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$iframe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iframe"],
    img: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$img$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["img"],
    image: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$img$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["img"],
    input: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$input$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["input"],
    kbd: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inlineCode"],
    li: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$li$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["li"],
    listing: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["code"],
    mark: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$em$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["em"],
    ol: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["list"],
    p: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$p$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"],
    plaintext: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["code"],
    pre: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["code"],
    q: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$q$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["q"],
    s: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$del$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["del"],
    samp: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inlineCode"],
    select: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["select"],
    strike: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$del$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["del"],
    strong: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$strong$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strong"],
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$p$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"],
    table: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["table"],
    td: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2d$cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tableCell"],
    textarea: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$textarea$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["textarea"],
    th: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2d$cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tableCell"],
    tr: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$table$2d$row$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tableRow"],
    tt: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inlineCode"],
    u: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$em$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["em"],
    ul: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["list"],
    var: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$inline$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inlineCode"],
    video: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$media$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["media"],
    wbr: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$wbr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wbr"],
    xmp: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["code"]
};
/**
 * @param {State} state
 *   State.
 * @param {Parents} node
 *   Parent to transform.
 */ function all(state, node) {
    return state.all(node);
}
/**
 * @param {State} state
 *   State.
 * @param {Parents} node
 *   Parent to transform.
 */ function flow(state, node) {
    return state.toFlow(state.all(node));
}
/**
 * @returns {undefined}
 */ function ignore() {}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/state.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Element, Nodes, Parents} from 'hast'
 * @import {
 *   BlockContent as MdastBlockContent,
 *   DefinitionContent as MdastDefinitionContent,
 *   Nodes as MdastNodes,
 *   Parents as MdastParents,
 *   RootContent as MdastRootContent
 * } from 'mdast'
 */ /**
 * @typedef {MdastBlockContent | MdastDefinitionContent} MdastFlowContent
 */ /**
 * @callback All
 *   Transform the children of a hast parent to mdast.
 * @param {Parents} parent
 *   Parent.
 * @returns {Array<MdastRootContent>}
 *   mdast children.
 *
 * @callback Handle
 *   Handle a particular element.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Element} element
 *   Element to transform.
 * @param {Parents | undefined} parent
 *   Parent of `element`.
 * @returns {Array<MdastNodes> | MdastNodes | undefined | void}
 *   mdast node or nodes.
 *
 *   Note: `void` is included until TS nicely infers `undefined`.
 *
 * @callback NodeHandle
 *   Handle a particular node.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {any} node
 *   Node to transform.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Array<MdastNodes> | MdastNodes | undefined | void}
 *   mdast node or nodes.
 *
 *   Note: `void` is included until TS nicely infers `undefined`.
 *
 * @callback One
 *   Transform a hast node to mdast.
 * @param {Nodes} node
 *   Expected hast node.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Array<MdastNodes> | MdastNodes | undefined}
 *   mdast result.
 *
 * @typedef Options
 *   Configuration.
 * @property {string | null | undefined} [checked='[x]']
 *   Value to use for a checked checkbox or radio input (default: `'[x]'`)
 * @property {boolean | null | undefined} [document]
 *   Whether the given tree represents a complete document (optional).
 *
 *   Applies when the `tree` is a `root` node.
 *   When the tree represents a complete document, then things are wrapped in
 *   paragraphs when needed, and otherwise they’re left as-is.
 *   The default checks for whether there’s mixed content: some phrasing nodes
 *   *and* some non-phrasing nodes.
 * @property {Record<string, Handle | null | undefined> | null | undefined} [handlers]
 *   Object mapping tag names to functions handling the corresponding elements
 *   (optional).
 *
 *   Merged into the defaults.
 * @property {boolean | null | undefined} [newlines=false]
 *   Keep line endings when collapsing whitespace (default: `false`).
 *
 *   The default collapses to a single space.
 * @property {Record<string, NodeHandle | null | undefined> | null | undefined} [nodeHandlers]
 *   Object mapping node types to functions handling the corresponding nodes
 *   (optional).
 *
 *   Merged into the defaults.
 * @property {Array<string> | null | undefined} [quotes=['"']]
 *   List of quotes to use (default: `['"']`).
 *
 *   Each value can be one or two characters.
 *   When two, the first character determines the opening quote and the second
 *   the closing quote at that level.
 *   When one, both the opening and closing quote are that character.
 *
 *   The order in which the preferred quotes appear determines which quotes to
 *   use at which level of nesting.
 *   So, to prefer `‘’` at the first level of nesting, and `“”` at the second,
 *   pass `['‘’', '“”']`.
 *   If `<q>`s are nested deeper than the given amount of quotes, the markers
 *   wrap around: a third level of nesting when using `['«»', '‹›']` should
 *   have double guillemets, a fourth single, a fifth double again, etc.
 * @property {string | null | undefined} [unchecked='[ ]']
 *   Value to use for an unchecked checkbox or radio input (default: `'[ ]'`).
 *
 * @callback Patch
 *   Copy a node’s positional info.
 * @param {Nodes} from
 *   hast node to copy from.
 * @param {MdastNodes} to
 *   mdast node to copy into.
 * @returns {undefined}
 *   Nothing.
 *
 * @callback Resolve
 *   Resolve a URL relative to a base.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
 *
 * @typedef State
 *   Info passed around about the current state.
 * @property {All} all
 *   Transform the children of a hast parent to mdast.
 * @property {boolean} baseFound
 *   Whether a `<base>` element was seen.
 * @property {Map<string, Element>} elementById
 *   Elements by their `id`.
 * @property {string | undefined} frozenBaseUrl
 *   `href` of `<base>`, if any.
 * @property {Record<string, Handle>} handlers
 *   Applied element handlers.
 * @property {boolean} inTable
 *   Whether we’re in a table.
 * @property {Record<string, NodeHandle>} nodeHandlers
 *   Applied node handlers.
 * @property {One} one
 *   Transform a hast node to mdast.
 * @property {Options} options
 *   User configuration.
 * @property {Patch} patch
 *   Copy a node’s positional info.
 * @property {number} qNesting
 *   Non-negative finite integer representing how deep we’re in `<q>`s.
 * @property {Resolve} resolve
 *   Resolve a URL relative to a base.
 * @property {ToFlow} toFlow
 *   Transform a list of mdast nodes to flow.
 * @property {<ChildType extends MdastNodes, ParentType extends MdastParents & {'children': Array<ChildType>}>(nodes: Array<MdastRootContent>, build: (() => ParentType)) => Array<ParentType>} toSpecificContent
 *   Turn arbitrary content into a list of a particular node type.
 *
 *   This is useful for example for lists, which must have list items as
 *   content.
 *   in this example, when non-items are found, they will be queued, and
 *   inserted into an adjacent item.
 *   When no actual items exist, one will be made with `build`.
 *
 * @callback ToFlow
 *   Transform a list of mdast nodes to flow.
 * @param {Array<MdastRootContent>} nodes
 *   mdast nodes.
 * @returns {Array<MdastFlowContent>}
 *   mdast flow children.
 */ __turbopack_context__.s([
    "createState",
    ()=>createState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$position$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-position@5.0.0/node_modules/unist-util-position/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/handlers/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/util/wrap.js [app-client] (ecmascript)");
;
;
;
const own = {}.hasOwnProperty;
function createState(options) {
    return {
        all,
        baseFound: false,
        elementById: new Map(),
        frozenBaseUrl: undefined,
        handlers: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handlers"],
            ...options.handlers
        },
        inTable: false,
        nodeHandlers: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$handlers$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nodeHandlers"],
            ...options.nodeHandlers
        },
        one,
        options,
        patch,
        qNesting: 0,
        resolve,
        toFlow,
        toSpecificContent
    };
}
/**
 * Transform the children of a hast parent to mdast.
 *
 * You might want to combine this with `toFlow` or `toSpecificContent`.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Parents} parent
 *   Parent.
 * @returns {Array<MdastRootContent>}
 *   mdast children.
 */ function all(parent) {
    const children = parent.children || [];
    /** @type {Array<MdastRootContent>} */ const results = [];
    let index = -1;
    while(++index < children.length){
        const child = children[index];
        // Content -> content.
        const result = this.one(child, parent);
        if (Array.isArray(result)) {
            results.push(...result);
        } else if (result) {
            results.push(result);
        }
    }
    return results;
}
/**
 * Transform a hast node to mdast.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Nodes} node
 *   hast node to transform.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Array<MdastNodes> | MdastNodes | undefined}
 *   mdast result.
 */ function one(node, parent) {
    if (node.type === 'element') {
        if (node.properties && node.properties.dataMdast === 'ignore') {
            return;
        }
        if (own.call(this.handlers, node.tagName)) {
            return this.handlers[node.tagName](this, node, parent) || undefined;
        }
    } else if (own.call(this.nodeHandlers, node.type)) {
        return this.nodeHandlers[node.type](this, node, parent) || undefined;
    }
    // Unknown literal.
    if ('value' in node && typeof node.value === 'string') {
        /** @type {MdastRootContent} */ const result = {
            type: 'text',
            value: node.value
        };
        this.patch(node, result);
        return result;
    }
    // Unknown parent.
    if ('children' in node) {
        return this.all(node);
    }
}
/**
 * Copy a node’s positional info.
 *
 * @param {Nodes} origin
 *   hast node to copy from.
 * @param {MdastNodes} node
 *   mdast node to copy into.
 * @returns {undefined}
 *   Nothing.
 */ function patch(origin, node) {
    if (origin.position) node.position = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$position$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$position$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["position"])(origin);
}
/**
 * @this {State}
 *   Info passed around about the current state.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
 */ function resolve(url) {
    const base = this.frozenBaseUrl;
    if (url === null || url === undefined) {
        return '';
    }
    if (base) {
        return String(new URL(url, base));
    }
    return url;
}
/**
 * Transform a list of mdast nodes to flow.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Array<MdastRootContent>} nodes
 *   Parent.
 * @returns {Array<MdastFlowContent>}
 *   mdast flow children.
 */ function toFlow(nodes) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$util$2f$wrap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrap"])(nodes);
}
/**
 * Turn arbitrary content into a particular node type.
 *
 * This is useful for example for lists, which must have list items as content.
 * in this example, when non-items are found, they will be queued, and
 * inserted into an adjacent item.
 * When no actual items exist, one will be made with `build`.
 *
 * @template {MdastNodes} ChildType
 *   Node type of children.
 * @template {MdastParents & {'children': Array<ChildType>}} ParentType
 *   Node type of parent.
 * @param {Array<MdastRootContent>} nodes
 *   Nodes, which are either `ParentType`, or will be wrapped in one.
 * @param {() => ParentType} build
 *   Build a parent if needed (must have empty `children`).
 * @returns {Array<ParentType>}
 *   List of parents.
 */ function toSpecificContent(nodes, build) {
    const reference = build();
    /** @type {Array<ParentType>} */ const results = [];
    /** @type {Array<ChildType>} */ let queue = [];
    let index = -1;
    while(++index < nodes.length){
        const node = nodes[index];
        if (expectedParent(node)) {
            if (queue.length > 0) {
                node.children.unshift(...queue);
                queue = [];
            }
            results.push(node);
        } else {
            // Assume `node` can be a child of `ParentType`.
            // If we start checking nodes, we’d run into problems with unknown nodes,
            // which we do want to support.
            const child = node;
            queue.push(child);
        }
    }
    if (queue.length > 0) {
        let node = results[results.length - 1];
        if (!node) {
            node = build();
            results.push(node);
        }
        node.children.push(...queue);
        queue = [];
    }
    return results;
    //TURBOPACK unreachable
    ;
    /**
   * @param {MdastNodes} node
   * @returns {node is ParentType}
   */ function expectedParent(node) {
        return node.type === reference.type;
    }
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @import {Options} from 'hast-util-to-mdast'
 * @import {Nodes} from 'hast'
 * @import {Nodes as MdastNodes, RootContent as MdastRootContent} from 'mdast'
 */ __turbopack_context__.s([
    "toMdast",
    ()=>toMdast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$ungap$2b$structured$2d$clone$40$1$2e$3$2e$0$2f$node_modules$2f40$ungap$2f$structured$2d$clone$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@ungap+structured-clone@1.3.0/node_modules/@ungap/structured-clone/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$rehype$2d$minify$2d$whitespace$40$6$2e$0$2e$2$2f$node_modules$2f$rehype$2d$minify$2d$whitespace$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/rehype-minify-whitespace@6.0.2/node_modules/rehype-minify-whitespace/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/hast-util-to-mdast@10.1.2/node_modules/hast-util-to-mdast/lib/state.js [app-client] (ecmascript)");
;
;
;
;
/** @type {Readonly<Options>} */ const emptyOptions = {};
function toMdast(tree, options) {
    // We have to clone, cause we’ll use `rehype-minify-whitespace` on the tree,
    // which modifies.
    const cleanTree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$ungap$2b$structured$2d$clone$40$1$2e$3$2e$0$2f$node_modules$2f40$ungap$2f$structured$2d$clone$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(tree);
    const settings = options || emptyOptions;
    const transformWhitespace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$rehype$2d$minify$2d$whitespace$40$6$2e$0$2e$2$2f$node_modules$2f$rehype$2d$minify$2d$whitespace$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        newlines: settings.newlines === true
    });
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$hast$2d$util$2d$to$2d$mdast$40$10$2e$1$2e$2$2f$node_modules$2f$hast$2d$util$2d$to$2d$mdast$2f$lib$2f$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createState"])(settings);
    /** @type {MdastNodes} */ let mdast;
    // @ts-expect-error: fine to pass an arbitrary node.
    transformWhitespace(cleanTree);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["visit"])(cleanTree, function(node) {
        if (node && node.type === 'element' && node.properties) {
            const id = String(node.properties.id || '') || undefined;
            if (id && !state.elementById.has(id)) {
                state.elementById.set(id, node);
            }
        }
    });
    const result = state.one(cleanTree, undefined);
    if (!result) {
        mdast = {
            type: 'root',
            children: []
        };
    } else if (Array.isArray(result)) {
        // Assume content.
        const children = result;
        mdast = {
            type: 'root',
            children
        };
    } else {
        mdast = result;
    }
    // Collapse text nodes, and fix whitespace.
    //
    // Most of this is taken care of by `rehype-minify-whitespace`, but
    // we’re generating some whitespace too, and some nodes are in the end
    // ignored.
    // So clean up.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$unist$2d$util$2d$visit$40$5$2e$0$2e$0$2f$node_modules$2f$unist$2d$util$2d$visit$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["visit"])(mdast, function(node, index, parent) {
        if (node.type === 'text' && index !== undefined && parent) {
            const previous = parent.children[index - 1];
            if (previous && previous.type === node.type) {
                previous.value += node.value;
                parent.children.splice(index, 1);
                if (previous.position && node.position) {
                    previous.position.end = node.position.end;
                }
                // Iterate over the previous node again, to handle its total value.
                return index - 1;
            }
            node.value = node.value.replace(/[\t ]*(\r?\n|\r)[\t ]*/, '$1');
            // We don’t care about other phrasing nodes in between (e.g., `[ asd ]()`),
            // as there the whitespace matters.
            if (parent && (parent.type === 'heading' || parent.type === 'paragraph' || parent.type === 'root')) {
                if (!index) {
                    node.value = node.value.replace(/^[\t ]+/, '');
                }
                if (index === parent.children.length - 1) {
                    node.value = node.value.replace(/[\t ]+$/, '');
                }
            }
            if (!node.value) {
                parent.children.splice(index, 1);
                return index;
            }
        }
    });
    return mdast;
}
}),
]);

//# sourceMappingURL=80607_hast-util-to-mdast_lib_391e4b92._.js.map
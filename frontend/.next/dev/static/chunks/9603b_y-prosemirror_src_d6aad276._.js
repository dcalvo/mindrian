(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/keys.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "yCursorPluginKey",
    ()=>yCursorPluginKey,
    "ySyncPluginKey",
    ()=>ySyncPluginKey,
    "yUndoPluginKey",
    ()=>yUndoPluginKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-state@1.4.4/node_modules/prosemirror-state/dist/index.js [app-client] (ecmascript)"); // eslint-disable-line
;
const ySyncPluginKey = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('y-sync');
const yUndoPluginKey = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('y-undo');
const yCursorPluginKey = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]('yjs-cursor');
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/lib.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "absolutePositionToRelativePosition",
    ()=>absolutePositionToRelativePosition,
    "initProseMirrorDoc",
    ()=>initProseMirrorDoc,
    "prosemirrorJSONToYDoc",
    ()=>prosemirrorJSONToYDoc,
    "prosemirrorJSONToYXmlFragment",
    ()=>prosemirrorJSONToYXmlFragment,
    "prosemirrorToYDoc",
    ()=>prosemirrorToYDoc,
    "prosemirrorToYXmlFragment",
    ()=>prosemirrorToYXmlFragment,
    "relativePositionToAbsolutePosition",
    ()=>relativePositionToAbsolutePosition,
    "setMeta",
    ()=>setMeta,
    "yDocToProsemirror",
    ()=>yDocToProsemirror,
    "yDocToProsemirrorJSON",
    ()=>yDocToProsemirrorJSON,
    "yXmlFragmentToProseMirrorFragment",
    ()=>yXmlFragmentToProseMirrorFragment,
    "yXmlFragmentToProseMirrorRootNode",
    ()=>yXmlFragmentToProseMirrorRootNode,
    "yXmlFragmentToProsemirror",
    ()=>yXmlFragmentToProsemirror,
    "yXmlFragmentToProsemirrorJSON",
    ()=>yXmlFragmentToProsemirrorJSON
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/sync-plugin.js [app-client] (ecmascript)"); // eslint-disable-line
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/keys.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/dist/yjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-model@1.25.4/node_modules/prosemirror-model/dist/index.js [app-client] (ecmascript)"); // eslint-disable-line
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/error.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/map.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$eventloop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/eventloop.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
/**
 * Either a node if type is YXmlElement or an Array of text nodes if YXmlText
 * @typedef {Map<Y.AbstractType, Node | Array<Node>>} ProsemirrorMapping
 */ /**
 * Is null if no timeout is in progress.
 * Is defined if a timeout is in progress.
 * Maps from view
 * @type {Map<EditorView, Map<any, any>>|null}
 */ let viewsToUpdate = null;
const updateMetas = ()=>{
    const ups = viewsToUpdate;
    viewsToUpdate = null;
    ups.forEach((metas, view)=>{
        const tr = view.state.tr;
        const syncState = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(view.state);
        if (syncState && syncState.binding && !syncState.binding.isDestroyed) {
            metas.forEach((val, key)=>{
                tr.setMeta(key, val);
            });
            view.dispatch(tr);
        }
    });
};
const setMeta = (view, key, value)=>{
    if (!viewsToUpdate) {
        viewsToUpdate = new Map();
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$eventloop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"](0, updateMetas);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setIfUndefined"](viewsToUpdate, view, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"]).set(key, value);
};
const absolutePositionToRelativePosition = (pos, type, mapping)=>{
    if (pos === 0) {
        // if the type is later populated, we want to retain the 0 position (hence assoc=-1)
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromTypeIndex"](type, 0, type.length === 0 ? -1 : 0);
    }
    /**
   * @type {any}
   */ let n = type._first === null ? null : /** @type {Y.ContentType} */ type._first.content.type;
    while(n !== null && type !== n){
        if (n instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]) {
            if (n._length >= pos) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromTypeIndex"](n, pos, type.length === 0 ? -1 : 0);
            } else {
                pos -= n._length;
            }
            if (n._item !== null && n._item.next !== null) {
                n = /** @type {Y.ContentType} */ n._item.next.content.type;
            } else {
                do {
                    n = n._item === null ? null : n._item.parent;
                    pos--;
                }while (n !== type && n !== null && n._item !== null && n._item.next === null)
                if (n !== null && n !== type) {
                    // @ts-gnore we know that n.next !== null because of above loop conditition
                    n = n._item === null ? null : /** @type {Y.ContentType} */ /** @type Y.Item */ n._item.next.content.type;
                }
            }
        } else {
            const pNodeSize = /** @type {any} */ (mapping.get(n) || {
                nodeSize: 0
            }).nodeSize;
            if (n._first !== null && pos < pNodeSize) {
                n = /** @type {Y.ContentType} */ n._first.content.type;
                pos--;
            } else {
                if (pos === 1 && n._length === 0 && pNodeSize > 1) {
                    // edge case, should end in this paragraph
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelativePosition"](n._item === null ? null : n._item.id, n._item === null ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRootTypeKey"](n) : null, null);
                }
                pos -= pNodeSize;
                if (n._item !== null && n._item.next !== null) {
                    n = /** @type {Y.ContentType} */ n._item.next.content.type;
                } else {
                    if (pos === 0) {
                        // set to end of n.parent
                        n = n._item === null ? n : n._item.parent;
                        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelativePosition"](n._item === null ? null : n._item.id, n._item === null ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRootTypeKey"](n) : null, null);
                    }
                    do {
                        n = /** @type {Y.Item} */ n._item.parent;
                        pos--;
                    }while (n !== type && /** @type {Y.Item} */ n._item.next === null)
                    // if n is null at this point, we have an unexpected case
                    if (n !== type) {
                        // We know that n._item.next is defined because of above loop condition
                        n = /** @type {Y.ContentType} */ /** @type {Y.Item} */ /** @type {Y.Item} */ n._item.next.content.type;
                    }
                }
            }
        }
        if (n === null) {
            throw __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unexpectedCase"]();
        }
        if (pos === 0 && n.constructor !== __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"] && n !== type) {
            return createRelativePosition(n._item.parent, n._item);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromTypeIndex"](type, type._length, type.length === 0 ? -1 : 0);
};
const createRelativePosition = (type, item)=>{
    let typeid = null;
    let tname = null;
    if (type._item === null) {
        tname = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRootTypeKey"](type);
    } else {
        typeid = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createID"](type._item.id.client, type._item.id.clock);
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelativePosition"](typeid, tname, item.id);
};
const relativePositionToAbsolutePosition = (y, documentType, relPos, mapping)=>{
    const decodedPos = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAbsolutePositionFromRelativePosition"](relPos, y);
    if (decodedPos === null || decodedPos.type !== documentType && !__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isParentOf"](documentType, decodedPos.type._item)) {
        return null;
    }
    let type = decodedPos.type;
    let pos = 0;
    if (type.constructor === __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]) {
        pos = decodedPos.index;
    } else if (type._item === null || !type._item.deleted) {
        let n = type._first;
        let i = 0;
        while(i < type._length && i < decodedPos.index && n !== null){
            if (!n.deleted) {
                const t = /** @type {Y.ContentType} */ n.content.type;
                i++;
                if (t instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]) {
                    pos += t._length;
                } else {
                    pos += /** @type {any} */ mapping.get(t).nodeSize;
                }
            }
            n = n.right;
        }
        pos += 1; // increase because we go out of n
    }
    while(type !== documentType && type._item !== null){
        // @ts-ignore
        const parent = type._item.parent;
        // @ts-ignore
        if (parent._item === null || !parent._item.deleted) {
            pos += 1; // the start tag
            let n = /** @type {Y.AbstractType} */ parent._first;
            // now iterate until we found type
            while(n !== null){
                const contentType = /** @type {Y.ContentType} */ n.content.type;
                if (contentType === type) {
                    break;
                }
                if (!n.deleted) {
                    if (contentType instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]) {
                        pos += contentType._length;
                    } else {
                        pos += /** @type {any} */ mapping.get(contentType).nodeSize;
                    }
                }
                n = n.right;
            }
        }
        type = parent;
    }
    return pos - 1 // we don't count the most outer tag, because it is a fragment
    ;
};
const yXmlFragmentToProseMirrorFragment = (yXmlFragment, schema)=>{
    const fragmentContent = yXmlFragment.toArray().map((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createNodeFromYElement"])(t, schema, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyMeta"])())).filter((n)=>n !== null);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].fromArray(fragmentContent);
};
const yXmlFragmentToProseMirrorRootNode = (yXmlFragment, schema)=>schema.topNodeType.create(null, yXmlFragmentToProseMirrorFragment(yXmlFragment, schema));
const initProseMirrorDoc = (yXmlFragment, schema)=>{
    const meta = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyMeta"])();
    const fragmentContent = yXmlFragment.toArray().map((t)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createNodeFromYElement"])(t, schema, meta)).filter((n)=>n !== null);
    const doc = schema.topNodeType.create(null, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].fromArray(fragmentContent));
    return {
        doc,
        meta,
        mapping: meta.mapping
    };
};
function prosemirrorToYDoc(doc, xmlFragment = 'prosemirror') {
    const ydoc = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Doc"]();
    const type = ydoc.get(xmlFragment, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlFragment"]);
    if (!type.doc) {
        return ydoc;
    }
    prosemirrorToYXmlFragment(doc, type);
    return type.doc;
}
function prosemirrorToYXmlFragment(doc, xmlFragment) {
    const type = xmlFragment || new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlFragment"]();
    const ydoc = type.doc ? type.doc : {
        transact: (transaction)=>transaction(undefined)
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateYFragment"])(ydoc, type, doc, {
        mapping: new Map(),
        isOMark: new Map()
    });
    return type;
}
function prosemirrorJSONToYDoc(schema, state, xmlFragment = 'prosemirror') {
    const doc = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].fromJSON(schema, state);
    return prosemirrorToYDoc(doc, xmlFragment);
}
function prosemirrorJSONToYXmlFragment(schema, state, xmlFragment) {
    const doc = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].fromJSON(schema, state);
    return prosemirrorToYXmlFragment(doc, xmlFragment);
}
function yDocToProsemirror(schema, ydoc) {
    const state = yDocToProsemirrorJSON(ydoc);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].fromJSON(schema, state);
}
function yXmlFragmentToProsemirror(schema, xmlFragment) {
    const state = yXmlFragmentToProsemirrorJSON(xmlFragment);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].fromJSON(schema, state);
}
function yDocToProsemirrorJSON(ydoc, xmlFragment = 'prosemirror') {
    return yXmlFragmentToProsemirrorJSON(ydoc.getXmlFragment(xmlFragment));
}
function yXmlFragmentToProsemirrorJSON(xmlFragment) {
    const items = xmlFragment.toArray();
    /**
   * @param {Y.AbstractType} item
   */ const serialize = (item)=>{
        /**
     * @type {Object} NodeObject
     * @property {string} NodeObject.type
     * @property {Record<string, string>=} NodeObject.attrs
     * @property {Array<NodeObject>=} NodeObject.content
     */ let response;
        // TODO: Must be a better way to detect text nodes than this
        if (item instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]) {
            const delta = item.toDelta();
            response = delta.map(/** @param {any} d */ (d)=>{
                const text = {
                    type: 'text',
                    text: d.insert
                };
                if (d.attributes) {
                    text.marks = Object.keys(d.attributes).map((type_)=>{
                        const attrs = d.attributes[type_];
                        const type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yattr2markname"])(type_);
                        const mark = {
                            type
                        };
                        if (Object.keys(attrs)) {
                            mark.attrs = attrs;
                        }
                        return mark;
                    });
                }
                return text;
            });
        } else if (item instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"]) {
            response = {
                type: item.nodeName
            };
            const attrs = item.getAttributes();
            if (Object.keys(attrs).length) {
                response.attrs = attrs;
            }
            const children = item.toArray();
            if (children.length) {
                response.content = children.map(serialize).flat();
            }
        } else {
            // expected either Y.XmlElement or Y.XmlText
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unexpectedCase"]();
        }
        return response;
    };
    return {
        type: 'doc',
        content: items.map(serialize)
    };
}
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashOfJSON",
    ()=>hashOfJSON
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$hash$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/hash/sha256.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$buffer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/buffer.js [app-client] (ecmascript)");
;
;
/**
 * Custom function to transform sha256 hash to N byte
 *
 * @param {Uint8Array} digest
 */ const _convolute = (digest)=>{
    const N = 6;
    for(let i = N; i < digest.length; i++){
        digest[i % N] = digest[i % N] ^ digest[i];
    }
    return digest.slice(0, N);
};
const hashOfJSON = (json)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$buffer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBase64"](_convolute(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$hash$2f$sha256$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["digest"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$buffer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeAny"](json))));
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/sync-plugin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @module bindings/prosemirror
 */ __turbopack_context__.s([
    "ProsemirrorBinding",
    ()=>ProsemirrorBinding,
    "attributesToMarks",
    ()=>attributesToMarks,
    "createEmptyMeta",
    ()=>createEmptyMeta,
    "createNodeFromYElement",
    ()=>createNodeFromYElement,
    "getRelativeSelection",
    ()=>getRelativeSelection,
    "isVisible",
    ()=>isVisible,
    "updateYFragment",
    ()=>updateYFragment,
    "ySyncPlugin",
    ()=>ySyncPlugin,
    "yattr2markname",
    ()=>yattr2markname
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$mutex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/mutex.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-model@1.25.4/node_modules/prosemirror-model/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-state@1.4.4/node_modules/prosemirror-state/dist/index.js [app-client] (ecmascript)"); // eslint-disable-line
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/math.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/object.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$set$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/set.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$diff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/diff.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/error.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/keys.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/dist/yjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/lib.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$random$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/random.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$environment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/environment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/dom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$eventloop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/eventloop.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/map.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/utils.js [app-client] (ecmascript)");
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
const createEmptyMeta = ()=>({
        mapping: new Map(),
        isOMark: new Map()
    });
const isVisible = (item, snapshot)=>snapshot === undefined ? !item.deleted : snapshot.sv.has(item.id.client) && /** @type {number} */ snapshot.sv.get(item.id.client) > item.id.clock && !__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDeleted"](snapshot.ds, item.id);
/**
 * Either a node if type is YXmlElement or an Array of text nodes if YXmlText
 * @typedef {Map<Y.AbstractType<any>, PModel.Node | Array<PModel.Node>>} ProsemirrorMapping
 */ /**
 * @typedef {Object} ColorDef
 * @property {string} ColorDef.light
 * @property {string} ColorDef.dark
 */ /**
 * @typedef {Object} YSyncOpts
 * @property {Array<ColorDef>} [YSyncOpts.colors]
 * @property {Map<string,ColorDef>} [YSyncOpts.colorMapping]
 * @property {Y.PermanentUserData|null} [YSyncOpts.permanentUserData]
 * @property {ProsemirrorMapping} [YSyncOpts.mapping]
 * @property {function} [YSyncOpts.onFirstRender] Fired when the content from Yjs is initially rendered to ProseMirror
 */ /**
 * @type {Array<ColorDef>}
 */ const defaultColors = [
    {
        light: '#ecd44433',
        dark: '#ecd444'
    }
];
/**
 * @param {Map<string,ColorDef>} colorMapping
 * @param {Array<ColorDef>} colors
 * @param {string} user
 * @return {ColorDef}
 */ const getUserColor = (colorMapping, colors, user)=>{
    // @todo do not hit the same color twice if possible
    if (!colorMapping.has(user)) {
        if (colorMapping.size < colors.length) {
            const usedColors = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$set$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"]();
            colorMapping.forEach((color)=>usedColors.add(color));
            colors = colors.filter((color)=>!usedColors.has(color));
        }
        colorMapping.set(user, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$random$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["oneOf"](colors));
    }
    return colorMapping.get(user);
};
const ySyncPlugin = (yXmlFragment, { colors = defaultColors, colorMapping = new Map(), permanentUserData = null, onFirstRender = ()=>{}, mapping } = {})=>{
    let initialContentChanged = false;
    const binding = new ProsemirrorBinding(yXmlFragment, mapping);
    const plugin = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
        props: {
            editable: (state)=>{
                const syncState = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(state);
                return syncState.snapshot == null && syncState.prevSnapshot == null;
            }
        },
        key: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"],
        state: {
            /**
       * @returns {any}
       */ init: (_initargs, _state)=>{
                return {
                    type: yXmlFragment,
                    doc: yXmlFragment.doc,
                    binding,
                    snapshot: null,
                    prevSnapshot: null,
                    isChangeOrigin: false,
                    isUndoRedoOperation: false,
                    addToHistory: true,
                    colors,
                    colorMapping,
                    permanentUserData
                };
            },
            apply: (tr, pluginState)=>{
                const change = tr.getMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
                if (change !== undefined) {
                    pluginState = Object.assign({}, pluginState);
                    for(const key in change){
                        pluginState[key] = change[key];
                    }
                }
                pluginState.addToHistory = tr.getMeta('addToHistory') !== false;
                // always set isChangeOrigin. If undefined, this is not change origin.
                pluginState.isChangeOrigin = change !== undefined && !!change.isChangeOrigin;
                pluginState.isUndoRedoOperation = change !== undefined && !!change.isChangeOrigin && !!change.isUndoRedoOperation;
                if (binding.prosemirrorView !== null) {
                    if (change !== undefined && (change.snapshot != null || change.prevSnapshot != null)) {
                        // snapshot changed, rerender next
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$eventloop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"](0, ()=>{
                            if (binding.prosemirrorView == null) {
                                return;
                            }
                            if (change.restore == null) {
                                binding._renderSnapshot(change.snapshot, change.prevSnapshot, pluginState);
                            } else {
                                binding._renderSnapshot(change.snapshot, change.snapshot, pluginState);
                                // reset to current prosemirror state
                                delete pluginState.restore;
                                delete pluginState.snapshot;
                                delete pluginState.prevSnapshot;
                                binding.mux(()=>{
                                    binding._prosemirrorChanged(binding.prosemirrorView.state.doc);
                                });
                            }
                        });
                    }
                }
                return pluginState;
            }
        },
        view: (view)=>{
            binding.initView(view);
            if (mapping == null) {
                // force rerender to update the bindings mapping
                binding._forceRerender();
            }
            onFirstRender();
            return {
                update: ()=>{
                    const pluginState = plugin.getState(view.state);
                    if (pluginState.snapshot == null && pluginState.prevSnapshot == null) {
                        if (// If the content doesn't change initially, we don't render anything to Yjs
                        // If the content was cleared by a user action, we want to catch the change and
                        // represent it in Yjs
                        initialContentChanged || view.state.doc.content.findDiffStart(view.state.doc.type.createAndFill().content) !== null) {
                            initialContentChanged = true;
                            if (pluginState.addToHistory === false && !pluginState.isChangeOrigin) {
                                const yUndoPluginState = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(view.state);
                                /**
                 * @type {Y.UndoManager}
                 */ const um = yUndoPluginState && yUndoPluginState.undoManager;
                                if (um) {
                                    um.stopCapturing();
                                }
                            }
                            binding.mux(()=>{
                                /** @type {Y.Doc} */ pluginState.doc.transact((tr)=>{
                                    tr.meta.set('addToHistory', pluginState.addToHistory);
                                    binding._prosemirrorChanged(view.state.doc);
                                }, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
                            });
                        }
                    }
                },
                destroy: ()=>{
                    binding.destroy();
                }
            };
        }
    });
    return plugin;
};
/**
 * @param {import('prosemirror-state').Transaction} tr
 * @param {ReturnType<typeof getRelativeSelection>} relSel
 * @param {ProsemirrorBinding} binding
 */ const restoreRelativeSelection = (tr, relSel, binding)=>{
    if (relSel !== null && relSel.anchor !== null && relSel.head !== null) {
        if (relSel.type === 'all') {
            tr.setSelection(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AllSelection"](tr.doc));
        } else if (relSel.type === 'node') {
            const anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePositionToAbsolutePosition"])(binding.doc, binding.type, relSel.anchor, binding.mapping);
            tr.setSelection(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NodeSelection"].create(tr.doc, anchor));
        } else {
            const anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePositionToAbsolutePosition"])(binding.doc, binding.type, relSel.anchor, binding.mapping);
            const head = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePositionToAbsolutePosition"])(binding.doc, binding.type, relSel.head, binding.mapping);
            if (anchor !== null && head !== null) {
                const sel = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].between(tr.doc.resolve(anchor), tr.doc.resolve(head));
                tr.setSelection(sel);
            }
        }
    }
};
const getRelativeSelection = (pmbinding, state)=>({
        type: /** @type {any} */ state.selection.jsonID,
        anchor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absolutePositionToRelativePosition"])(state.selection.anchor, pmbinding.type, pmbinding.mapping),
        head: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absolutePositionToRelativePosition"])(state.selection.head, pmbinding.type, pmbinding.mapping)
    });
class ProsemirrorBinding {
    /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */ constructor(yXmlFragment, mapping = new Map()){
        this.type = yXmlFragment;
        /**
     * this will be set once the view is created
     * @type {any}
     */ this.prosemirrorView = null;
        this.mux = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$mutex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createMutex"])();
        this.mapping = mapping;
        /**
     * Is overlapping mark - i.e. mark does not exclude itself.
     *
     * @type {Map<import('prosemirror-model').MarkType, boolean>}
     */ this.isOMark = new Map();
        this._observeFunction = this._typeChanged.bind(this);
        /**
     * @type {Y.Doc}
     */ // @ts-ignore
        this.doc = yXmlFragment.doc;
        /**
     * current selection as relative positions in the Yjs model
     */ this.beforeTransactionSelection = null;
        this.beforeAllTransactions = ()=>{
            if (this.beforeTransactionSelection === null && this.prosemirrorView != null) {
                this.beforeTransactionSelection = getRelativeSelection(this, this.prosemirrorView.state);
            }
        };
        this.afterAllTransactions = ()=>{
            this.beforeTransactionSelection = null;
        };
        this._domSelectionInView = null;
    }
    /**
   * Create a transaction for changing the prosemirror state.
   *
   * @returns
   */ get _tr() {
        return this.prosemirrorView.state.tr.setMeta('addToHistory', false);
    }
    _isLocalCursorInView() {
        if (!this.prosemirrorView.hasFocus()) return false;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$environment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBrowser"] && this._domSelectionInView === null) {
            // Calculate the domSelectionInView and clear by next tick after all events are finished
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$eventloop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeout"](0, ()=>{
                this._domSelectionInView = null;
            });
            this._domSelectionInView = this._isDomSelectionInView();
        }
        return this._domSelectionInView;
    }
    _isDomSelectionInView() {
        const selection = this.prosemirrorView._root.getSelection();
        if (selection == null || selection.anchorNode == null) return false;
        const range = this.prosemirrorView._root.createRange();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.setEnd(selection.focusNode, selection.focusOffset);
        // This is a workaround for an edgecase where getBoundingClientRect will
        // return zero values if the selection is collapsed at the start of a newline
        // see reference here: https://stackoverflow.com/a/59780954
        const rects = range.getClientRects();
        if (rects.length === 0) {
            // probably buggy newline behavior, explicitly select the node contents
            if (range.startContainer && range.collapsed) {
                range.selectNodeContents(range.startContainer);
            }
        }
        const bounding = range.getBoundingClientRect();
        const documentElement = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"].documentElement;
        return bounding.bottom >= 0 && bounding.right >= 0 && bounding.left <= (window.innerWidth || documentElement.clientWidth || 0) && bounding.top <= (window.innerHeight || documentElement.clientHeight || 0);
    }
    /**
   * @param {Y.Snapshot} snapshot
   * @param {Y.Snapshot} prevSnapshot
   */ renderSnapshot(snapshot, prevSnapshot) {
        if (!prevSnapshot) {
            prevSnapshot = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSnapshot"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDeleteSet"](), new Map());
        }
        this.prosemirrorView.dispatch(this._tr.setMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"], {
            snapshot,
            prevSnapshot
        }));
    }
    unrenderSnapshot() {
        this.mapping.clear();
        this.mux(()=>{
            const fragmentContent = this.type.toArray().map((t)=>createNodeFromYElement(t, this.prosemirrorView.state.schema, this)).filter((n)=>n !== null);
            // @ts-ignore
            const tr = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slice"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(fragmentContent), 0, 0));
            tr.setMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"], {
                snapshot: null,
                prevSnapshot: null
            });
            this.prosemirrorView.dispatch(tr);
        });
    }
    _forceRerender() {
        this.mapping.clear();
        this.mux(()=>{
            // If this is a forced rerender, this might neither happen as a pm change nor within a Yjs
            // transaction. Then the "before selection" doesn't exist. In this case, we need to create a
            // relative position before replacing content. Fixes #126
            const sel = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection;
            const fragmentContent = this.type.toArray().map((t)=>createNodeFromYElement(t, this.prosemirrorView.state.schema, this)).filter((n)=>n !== null);
            // @ts-ignore
            const tr = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slice"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(fragmentContent), 0, 0));
            if (sel) {
                /**
         * If the Prosemirror document we just created from this.type is
         * smaller than the previous document, the selection might be
         * out of bound, which would make Prosemirror throw an error.
         */ const clampedAnchor = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"](sel.anchor, 0), tr.doc.content.size);
                const clampedHead = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"](sel.head, 0), tr.doc.content.size);
                tr.setSelection(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(tr.doc, clampedAnchor, clampedHead));
            }
            this.prosemirrorView.dispatch(tr.setMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"], {
                isChangeOrigin: true,
                binding: this
            }));
        });
    }
    /**
   * @param {Y.Snapshot|Uint8Array} snapshot
   * @param {Y.Snapshot|Uint8Array} prevSnapshot
   * @param {Object} pluginState
   */ _renderSnapshot(snapshot, prevSnapshot, pluginState) {
        /**
     * The document that contains the full history of this document.
     * @type {Y.Doc}
     */ let historyDoc = this.doc;
        let historyType = this.type;
        if (!snapshot) {
            snapshot = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapshot"](this.doc);
        }
        if (snapshot instanceof Uint8Array || prevSnapshot instanceof Uint8Array) {
            if (!(snapshot instanceof Uint8Array) || !(prevSnapshot instanceof Uint8Array)) {
                // expected both snapshots to be v2 updates
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unexpectedCase"]();
            }
            historyDoc = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Doc"]({
                gc: false
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyUpdateV2"](historyDoc, prevSnapshot);
            prevSnapshot = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapshot"](historyDoc);
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyUpdateV2"](historyDoc, snapshot);
            snapshot = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapshot"](historyDoc);
            if (historyType._item === null) {
                /**
         * If is a root type, we need to find the root key in the initial document
         * and use it to get the history type.
         */ const rootKey = Array.from(this.doc.share.keys()).find((key)=>this.doc.share.get(key) === this.type);
                historyType = historyDoc.getXmlFragment(rootKey);
            } else {
                /**
         * If it is a sub type, we use the item id to find the history type.
         */ const historyStructs = historyDoc.store.clients.get(historyType._item.id.client) ?? [];
                const itemIndex = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findIndexSS"](historyStructs, historyType._item.id.clock);
                const item = historyStructs[itemIndex];
                const content = item.content;
                historyType = content.type;
            }
        }
        // clear mapping because we are going to rerender
        this.mapping.clear();
        this.mux(()=>{
            historyDoc.transact((transaction)=>{
                // before rendering, we are going to sanitize ops and split deleted ops
                // if they were deleted by seperate users.
                /**
         * @type {Y.PermanentUserData}
         */ const pud = pluginState.permanentUserData;
                if (pud) {
                    pud.dss.forEach((ds)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iterateDeletedStructs"](transaction, ds, (_item)=>{});
                    });
                }
                /**
         * @param {'removed'|'added'} type
         * @param {Y.ID} id
         */ const computeYChange = (type, id)=>{
                    const user = type === 'added' ? pud.getUserByClientId(id.client) : pud.getUserByDeletedId(id);
                    return {
                        user,
                        type,
                        color: getUserColor(pluginState.colorMapping, pluginState.colors, user)
                    };
                };
                // Create document fragment and render
                const fragmentContent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeListToArraySnapshot"](historyType, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Snapshot"](prevSnapshot.ds, snapshot.sv)).map((t)=>{
                    if (!t._item.deleted || isVisible(t._item, snapshot) || isVisible(t._item, prevSnapshot)) {
                        return createNodeFromYElement(t, this.prosemirrorView.state.schema, {
                            mapping: new Map(),
                            isOMark: new Map()
                        }, snapshot, prevSnapshot, computeYChange);
                    } else {
                        // No need to render elements that are not visible by either snapshot.
                        // If a client adds and deletes content in the same snapshot the element is not visible by either snapshot.
                        return null;
                    }
                }).filter((n)=>n !== null);
                // @ts-ignore
                const tr = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slice"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(fragmentContent), 0, 0));
                this.prosemirrorView.dispatch(tr.setMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"], {
                    isChangeOrigin: true
                }));
            }, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
        });
    }
    /**
   * @param {Array<Y.YEvent<any>>} events
   * @param {Y.Transaction} transaction
   */ _typeChanged(events, transaction) {
        if (this.prosemirrorView == null) return;
        const syncState = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(this.prosemirrorView.state);
        if (events.length === 0 || syncState.snapshot != null || syncState.prevSnapshot != null) {
            // drop out if snapshot is active
            this.renderSnapshot(syncState.snapshot, syncState.prevSnapshot);
            return;
        }
        this.mux(()=>{
            /**
       * @param {any} _
       * @param {Y.AbstractType<any>} type
       */ const delType = (_, type)=>this.mapping.delete(type);
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iterateDeletedStructs"](transaction, transaction.deleteSet, (struct)=>{
                if (struct.constructor === __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"]) {
                    const type = /** @type {Y.ContentType} */ /** @type {Y.Item} */ struct.content.type;
                    type && this.mapping.delete(type);
                }
            });
            transaction.changed.forEach(delType);
            transaction.changedParentTypes.forEach(delType);
            const fragmentContent = this.type.toArray().map((t)=>createNodeIfNotExists(t, this.prosemirrorView.state.schema, this)).filter((n)=>n !== null);
            // @ts-ignore
            let tr = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slice"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$model$40$1$2e$25$2e$4$2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(fragmentContent), 0, 0));
            restoreRelativeSelection(tr, this.beforeTransactionSelection, this);
            tr = tr.setMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"], {
                isChangeOrigin: true,
                isUndoRedoOperation: transaction.origin instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UndoManager"]
            });
            if (this.beforeTransactionSelection !== null && this._isLocalCursorInView()) {
                tr.scrollIntoView();
            }
            this.prosemirrorView.dispatch(tr);
        });
    }
    /**
   * @param {import('prosemirror-model').Node} doc
   */ _prosemirrorChanged(doc) {
        this.doc.transact(()=>{
            updateYFragment(this.doc, this.type, doc, this);
            this.beforeTransactionSelection = getRelativeSelection(this, this.prosemirrorView.state);
        }, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
    }
    /**
   * View is ready to listen to changes. Register observers.
   * @param {any} prosemirrorView
   */ initView(prosemirrorView) {
        if (this.prosemirrorView != null) this.destroy();
        this.prosemirrorView = prosemirrorView;
        this.doc.on('beforeAllTransactions', this.beforeAllTransactions);
        this.doc.on('afterAllTransactions', this.afterAllTransactions);
        this.type.observeDeep(this._observeFunction);
    }
    destroy() {
        if (this.prosemirrorView == null) return;
        this.prosemirrorView = null;
        this.type.unobserveDeep(this._observeFunction);
        this.doc.off('beforeAllTransactions', this.beforeAllTransactions);
        this.doc.off('afterAllTransactions', this.afterAllTransactions);
    }
}
/**
 * @private
 * @param {Y.XmlElement | Y.XmlHook} el
 * @param {PModel.Schema} schema
 * @param {BindingMetadata} meta
 * @param {Y.Snapshot} [snapshot]
 * @param {Y.Snapshot} [prevSnapshot]
 * @param {function('removed' | 'added', Y.ID):any} [computeYChange]
 * @return {PModel.Node | null}
 */ const createNodeIfNotExists = (el, schema, meta, snapshot, prevSnapshot, computeYChange)=>{
    const node = meta.mapping.get(el);
    if (node === undefined) {
        if (el instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"]) {
            return createNodeFromYElement(el, schema, meta, snapshot, prevSnapshot, computeYChange);
        } else {
            throw __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["methodUnimplemented"]() // we are currently not handling hooks
            ;
        }
    }
    return node;
};
const createNodeFromYElement = (el, schema, meta, snapshot, prevSnapshot, computeYChange)=>{
    const children = [];
    /**
   * @param {Y.XmlElement | Y.XmlText} type
   */ const createChildren = (type)=>{
        if (type instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"]) {
            const n = createNodeIfNotExists(type, schema, meta, snapshot, prevSnapshot, computeYChange);
            if (n !== null) {
                children.push(n);
            }
        } else {
            // If the next ytext exists and was created by us, move the content to the current ytext.
            // This is a fix for #160 -- duplication of characters when two Y.Text exist next to each
            // other.
            const nextytext = /** @type {Y.ContentType} */ type._item.right?.content?.type;
            if (nextytext instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"] && !nextytext._item.deleted && nextytext._item.id.client === nextytext.doc.clientID) {
                type.applyDelta([
                    {
                        retain: type.length
                    },
                    ...nextytext.toDelta()
                ]);
                nextytext.doc.transact((tr)=>{
                    nextytext._item.delete(tr);
                });
            }
            // now create the prosemirror text nodes
            const ns = createTextNodesFromYText(type, schema, meta, snapshot, prevSnapshot, computeYChange);
            if (ns !== null) {
                ns.forEach((textchild)=>{
                    if (textchild !== null) {
                        children.push(textchild);
                    }
                });
            }
        }
    };
    if (snapshot === undefined || prevSnapshot === undefined) {
        el.toArray().forEach(createChildren);
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typeListToArraySnapshot"](el, new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Snapshot"](prevSnapshot.ds, snapshot.sv)).forEach(createChildren);
    }
    try {
        const attrs = el.getAttributes(snapshot);
        if (snapshot !== undefined) {
            if (!isVisible(el._item, snapshot)) {
                attrs.ychange = computeYChange ? computeYChange('removed', /** @type {Y.Item} */ el._item.id) : {
                    type: 'removed'
                };
            } else if (!isVisible(el._item, prevSnapshot)) {
                attrs.ychange = computeYChange ? computeYChange('added', /** @type {Y.Item} */ el._item.id) : {
                    type: 'added'
                };
            }
        }
        const node = schema.node(el.nodeName, attrs, children);
        meta.mapping.set(el, node);
        return node;
    } catch (e) {
        // an error occured while creating the node. This is probably a result of a concurrent action.
        /** @type {Y.Doc} */ el.doc.transact((transaction)=>{
            /** @type {Y.Item} */ el._item.delete(transaction);
        }, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
        meta.mapping.delete(el);
        return null;
    }
};
/**
 * @private
 * @param {Y.XmlText} text
 * @param {import('prosemirror-model').Schema} schema
 * @param {BindingMetadata} _meta
 * @param {Y.Snapshot} [snapshot]
 * @param {Y.Snapshot} [prevSnapshot]
 * @param {function('removed' | 'added', Y.ID):any} [computeYChange]
 * @return {Array<PModel.Node>|null}
 */ const createTextNodesFromYText = (text, schema, _meta, snapshot, prevSnapshot, computeYChange)=>{
    const nodes = [];
    const deltas = text.toDelta(snapshot, prevSnapshot, computeYChange);
    try {
        for(let i = 0; i < deltas.length; i++){
            const delta = deltas[i];
            nodes.push(schema.text(delta.insert, attributesToMarks(delta.attributes, schema)));
        }
    } catch (e) {
        // an error occured while creating the node. This is probably a result of a concurrent action.
        /** @type {Y.Doc} */ text.doc.transact((transaction)=>{
            /** @type {Y.Item} */ text._item.delete(transaction);
        }, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
        return null;
    }
    // @ts-ignore
    return nodes;
};
/**
 * @private
 * @param {Array<any>} nodes prosemirror node
 * @param {BindingMetadata} meta
 * @return {Y.XmlText}
 */ const createTypeFromTextNodes = (nodes, meta)=>{
    const type = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]();
    const delta = nodes.map((node)=>({
            // @ts-ignore
            insert: node.text,
            attributes: marksToAttributes(node.marks, meta)
        }));
    type.applyDelta(delta);
    meta.mapping.set(type, nodes);
    return type;
};
/**
 * @private
 * @param {any} node prosemirror node
 * @param {BindingMetadata} meta
 * @return {Y.XmlElement}
 */ const createTypeFromElementNode = (node, meta)=>{
    const type = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"](node.type.name);
    for(const key in node.attrs){
        const val = node.attrs[key];
        if (val !== null && key !== 'ychange') {
            type.setAttribute(key, val);
        }
    }
    type.insert(0, normalizePNodeContent(node).map((n)=>createTypeFromTextOrElementNode(n, meta)));
    meta.mapping.set(type, node);
    return type;
};
/**
 * @private
 * @param {PModel.Node|Array<PModel.Node>} node prosemirror text node
 * @param {BindingMetadata} meta
 * @return {Y.XmlElement|Y.XmlText}
 */ const createTypeFromTextOrElementNode = (node, meta)=>node instanceof Array ? createTypeFromTextNodes(node, meta) : createTypeFromElementNode(node, meta);
/**
 * @param {any} val
 */ const isObject = (val)=>typeof val === 'object' && val !== null;
/**
 * @param {any} pattrs
 * @param {any} yattrs
 */ const equalAttrs = (pattrs, yattrs)=>{
    const keys = Object.keys(pattrs).filter((key)=>pattrs[key] !== null);
    let eq = keys.length === (yattrs == null ? 0 : Object.keys(yattrs).filter((key)=>yattrs[key] !== null).length);
    for(let i = 0; i < keys.length && eq; i++){
        const key = keys[i];
        const l = pattrs[key];
        const r = yattrs[key];
        eq = key === 'ychange' || l === r || isObject(l) && isObject(r) && equalAttrs(l, r);
    }
    return eq;
};
/**
 * @typedef {Array<Array<PModel.Node>|PModel.Node>} NormalizedPNodeContent
 */ /**
 * @param {any} pnode
 * @return {NormalizedPNodeContent}
 */ const normalizePNodeContent = (pnode)=>{
    const c = pnode.content.content;
    const res = [];
    for(let i = 0; i < c.length; i++){
        const n = c[i];
        if (n.isText) {
            const textNodes = [];
            for(let tnode = c[i]; i < c.length && tnode.isText; tnode = c[++i]){
                textNodes.push(tnode);
            }
            i--;
            res.push(textNodes);
        } else {
            res.push(n);
        }
    }
    return res;
};
/**
 * @param {Y.XmlText} ytext
 * @param {Array<any>} ptexts
 */ const equalYTextPText = (ytext, ptexts)=>{
    const delta = ytext.toDelta();
    return delta.length === ptexts.length && delta.every(/** @type {(d:any,i:number) => boolean} */ (d, i)=>d.insert === /** @type {any} */ ptexts[i].text && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keys"](d.attributes || {}).length === ptexts[i].marks.length && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["every"](d.attributes, (attr, yattrname)=>{
            const markname = yattr2markname(yattrname);
            const pmarks = ptexts[i].marks;
            return equalAttrs(attr, pmarks.find(/** @param {any} mark */ (mark)=>mark.type.name === markname)?.attrs);
        }));
};
/**
 * @param {Y.XmlElement|Y.XmlText|Y.XmlHook} ytype
 * @param {any|Array<any>} pnode
 */ const equalYTypePNode = (ytype, pnode)=>{
    if (ytype instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"] && !(pnode instanceof Array) && matchNodeName(ytype, pnode)) {
        const normalizedContent = normalizePNodeContent(pnode);
        return ytype._length === normalizedContent.length && equalAttrs(ytype.getAttributes(), pnode.attrs) && ytype.toArray().every((ychild, i)=>equalYTypePNode(ychild, normalizedContent[i]));
    }
    return ytype instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"] && pnode instanceof Array && equalYTextPText(ytype, pnode);
};
/**
 * @param {PModel.Node | Array<PModel.Node> | undefined} mapped
 * @param {PModel.Node | Array<PModel.Node>} pcontent
 */ const mappedIdentity = (mapped, pcontent)=>mapped === pcontent || mapped instanceof Array && pcontent instanceof Array && mapped.length === pcontent.length && mapped.every((a, i)=>pcontent[i] === a);
/**
 * @param {Y.XmlElement} ytype
 * @param {PModel.Node} pnode
 * @param {BindingMetadata} meta
 * @return {{ foundMappedChild: boolean, equalityFactor: number }}
 */ const computeChildEqualityFactor = (ytype, pnode, meta)=>{
    const yChildren = ytype.toArray();
    const pChildren = normalizePNodeContent(pnode);
    const pChildCnt = pChildren.length;
    const yChildCnt = yChildren.length;
    const minCnt = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](yChildCnt, pChildCnt);
    let left = 0;
    let right = 0;
    let foundMappedChild = false;
    for(; left < minCnt; left++){
        const leftY = yChildren[left];
        const leftP = pChildren[left];
        if (mappedIdentity(meta.mapping.get(leftY), leftP)) {
            foundMappedChild = true; // definite (good) match!
        } else if (!equalYTypePNode(leftY, leftP)) {
            break;
        }
    }
    for(; left + right < minCnt; right++){
        const rightY = yChildren[yChildCnt - right - 1];
        const rightP = pChildren[pChildCnt - right - 1];
        if (mappedIdentity(meta.mapping.get(rightY), rightP)) {
            foundMappedChild = true;
        } else if (!equalYTypePNode(rightY, rightP)) {
            break;
        }
    }
    return {
        equalityFactor: left + right,
        foundMappedChild
    };
};
/**
 * @param {Y.Text} ytext
 */ const ytextTrans = (ytext)=>{
    let str = '';
    /**
   * @type {Y.Item|null}
   */ let n = ytext._start;
    const nAttrs = {};
    while(n !== null){
        if (!n.deleted) {
            if (n.countable && n.content instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContentString"]) {
                str += n.content.str;
            } else if (n.content instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContentFormat"]) {
                nAttrs[n.content.key] = null;
            }
        }
        n = n.right;
    }
    return {
        str,
        nAttrs
    };
};
/**
 * @todo test this more
 *
 * @param {Y.Text} ytext
 * @param {Array<any>} ptexts
 * @param {BindingMetadata} meta
 */ const updateYText = (ytext, ptexts, meta)=>{
    meta.mapping.set(ytext, ptexts);
    const { nAttrs, str } = ytextTrans(ytext);
    const content = ptexts.map((p)=>({
            insert: /** @type {any} */ p.text,
            attributes: Object.assign({}, nAttrs, marksToAttributes(p.marks, meta))
        }));
    const { insert, remove, index } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$diff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["simpleDiff"])(str, content.map((c)=>c.insert).join(''));
    ytext.delete(index, remove);
    ytext.insert(index, insert);
    ytext.applyDelta(content.map((c)=>({
            retain: c.insert.length,
            attributes: c.attributes
        })));
};
const hashedMarkNameRegex = /(.*)(--[a-zA-Z0-9+/=]{8})$/;
const yattr2markname = (attrName)=>hashedMarkNameRegex.exec(attrName)?.[1] ?? attrName;
const attributesToMarks = (attrs, schema)=>{
    /**
   * @type {Array<import('prosemirror-model').Mark>}
   */ const marks = [];
    for(const markName in attrs){
        // remove hashes if necessary
        marks.push(schema.mark(yattr2markname(markName), attrs[markName]));
    }
    return marks;
};
/**
 * @param {Array<import('prosemirror-model').Mark>} marks
 * @param {BindingMetadata} meta
 */ const marksToAttributes = (marks, meta)=>{
    const pattrs = {};
    marks.forEach((mark)=>{
        if (mark.type.name !== 'ychange') {
            const isOverlapping = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$map$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setIfUndefined"](meta.isOMark, mark.type, ()=>!mark.type.excludes(mark.type));
            pattrs[isOverlapping ? `${mark.type.name}--${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashOfJSON"](mark.toJSON())}` : mark.type.name] = mark.attrs;
        }
    });
    return pattrs;
};
const updateYFragment = (y, yDomFragment, pNode, meta)=>{
    if (yDomFragment instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"] && yDomFragment.nodeName !== pNode.type.name) {
        throw new Error('node name mismatch!');
    }
    meta.mapping.set(yDomFragment, pNode);
    // update attributes
    if (yDomFragment instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"]) {
        const yDomAttrs = yDomFragment.getAttributes();
        const pAttrs = pNode.attrs;
        for(const key in pAttrs){
            if (pAttrs[key] !== null) {
                if (yDomAttrs[key] !== pAttrs[key] && key !== 'ychange') {
                    yDomFragment.setAttribute(key, pAttrs[key]);
                }
            } else {
                yDomFragment.removeAttribute(key);
            }
        }
        // remove all keys that are no longer in pAttrs
        for(const key in yDomAttrs){
            if (pAttrs[key] === undefined) {
                yDomFragment.removeAttribute(key);
            }
        }
    }
    // update children
    const pChildren = normalizePNodeContent(pNode);
    const pChildCnt = pChildren.length;
    const yChildren = yDomFragment.toArray();
    const yChildCnt = yChildren.length;
    const minCnt = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](pChildCnt, yChildCnt);
    let left = 0;
    let right = 0;
    // find number of matching elements from left
    for(; left < minCnt; left++){
        const leftY = yChildren[left];
        const leftP = pChildren[left];
        if (!mappedIdentity(meta.mapping.get(leftY), leftP)) {
            if (equalYTypePNode(leftY, leftP)) {
                // update mapping
                meta.mapping.set(leftY, leftP);
            } else {
                break;
            }
        }
    }
    // find number of matching elements from right
    for(; right + left < minCnt; right++){
        const rightY = yChildren[yChildCnt - right - 1];
        const rightP = pChildren[pChildCnt - right - 1];
        if (!mappedIdentity(meta.mapping.get(rightY), rightP)) {
            if (equalYTypePNode(rightY, rightP)) {
                // update mapping
                meta.mapping.set(rightY, rightP);
            } else {
                break;
            }
        }
    }
    y.transact(()=>{
        // try to compare and update
        while(yChildCnt - left - right > 0 && pChildCnt - left - right > 0){
            const leftY = yChildren[left];
            const leftP = pChildren[left];
            const rightY = yChildren[yChildCnt - right - 1];
            const rightP = pChildren[pChildCnt - right - 1];
            if (leftY instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"] && leftP instanceof Array) {
                if (!equalYTextPText(leftY, leftP)) {
                    updateYText(leftY, leftP, meta);
                }
                left += 1;
            } else {
                let updateLeft = leftY instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"] && matchNodeName(leftY, leftP);
                let updateRight = rightY instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"] && matchNodeName(rightY, rightP);
                if (updateLeft && updateRight) {
                    // decide which which element to update
                    const equalityLeft = computeChildEqualityFactor(leftY, leftP, meta);
                    const equalityRight = computeChildEqualityFactor(rightY, rightP, meta);
                    if (equalityLeft.foundMappedChild && !equalityRight.foundMappedChild) {
                        updateRight = false;
                    } else if (!equalityLeft.foundMappedChild && equalityRight.foundMappedChild) {
                        updateLeft = false;
                    } else if (equalityLeft.equalityFactor < equalityRight.equalityFactor) {
                        updateLeft = false;
                    } else {
                        updateRight = false;
                    }
                }
                if (updateLeft) {
                    updateYFragment(y, leftY, leftP, meta);
                    left += 1;
                } else if (updateRight) {
                    updateYFragment(y, rightY, rightP, meta);
                    right += 1;
                } else {
                    meta.mapping.delete(yDomFragment.get(left));
                    yDomFragment.delete(left, 1);
                    yDomFragment.insert(left, [
                        createTypeFromTextOrElementNode(leftP, meta)
                    ]);
                    left += 1;
                }
            }
        }
        const yDelLen = yChildCnt - left - right;
        if (yChildCnt === 1 && pChildCnt === 0 && yChildren[0] instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlText"]) {
            meta.mapping.delete(yChildren[0]);
            // Edge case handling https://github.com/yjs/y-prosemirror/issues/108
            // Only delete the content of the Y.Text to retain remote changes on the same Y.Text object
            yChildren[0].delete(0, yChildren[0].length);
        } else if (yDelLen > 0) {
            yDomFragment.slice(left, left + yDelLen).forEach((type)=>meta.mapping.delete(type));
            yDomFragment.delete(left, yDelLen);
        }
        if (left + right < pChildCnt) {
            const ins = [];
            for(let i = left; i < pChildCnt - right; i++){
                ins.push(createTypeFromTextOrElementNode(pChildren[i], meta));
            }
            yDomFragment.insert(left, ins);
        }
    }, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]);
};
/**
 * @function
 * @param {Y.XmlElement} yElement
 * @param {any} pNode Prosemirror Node
 */ const matchNodeName = (yElement, pNode)=>!(pNode instanceof Array) && yElement.nodeName === pNode.type.name;
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/cursor-plugin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDecorations",
    ()=>createDecorations,
    "defaultAwarenessStateFilter",
    ()=>defaultAwarenessStateFilter,
    "defaultCursorBuilder",
    ()=>defaultCursorBuilder,
    "defaultSelectionBuilder",
    ()=>defaultSelectionBuilder,
    "yCursorPlugin",
    ()=>yCursorPlugin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/dist/yjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$41$2e$4$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-view@1.41.4/node_modules/prosemirror-view/dist/index.js [app-client] (ecmascript)"); // eslint-disable-line
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-state@1.4.4/node_modules/prosemirror-state/dist/index.js [app-client] (ecmascript)"); // eslint-disable-line
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$protocols$40$1$2e$0$2e$6_yjs$40$13$2e$6$2e$27$2f$node_modules$2f$y$2d$protocols$2f$awareness$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-protocols@1.0.6_yjs@13.6.27/node_modules/y-protocols/awareness.js [app-client] (ecmascript)"); // eslint-disable-line
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/lib.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/keys.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/lib0@0.2.114/node_modules/lib0/math.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
const defaultAwarenessStateFilter = (currentClientId, userClientId, _user)=>currentClientId !== userClientId;
const defaultCursorBuilder = (user)=>{
    const cursor = document.createElement('span');
    cursor.classList.add('ProseMirror-yjs-cursor');
    cursor.setAttribute('style', `border-color: ${user.color}`);
    const userDiv = document.createElement('div');
    userDiv.setAttribute('style', `background-color: ${user.color}`);
    userDiv.insertBefore(document.createTextNode(user.name), null);
    const nonbreakingSpace1 = document.createTextNode('\u2060');
    const nonbreakingSpace2 = document.createTextNode('\u2060');
    cursor.insertBefore(nonbreakingSpace1, null);
    cursor.insertBefore(userDiv, null);
    cursor.insertBefore(nonbreakingSpace2, null);
    return cursor;
};
const defaultSelectionBuilder = (user)=>{
    return {
        style: `background-color: ${user.color}70`,
        class: 'ProseMirror-yjs-selection'
    };
};
const rxValidColor = /^#[0-9a-fA-F]{6}$/;
const createDecorations = (state, awareness, awarenessFilter, createCursor, createSelection)=>{
    const ystate = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(state);
    const y = ystate.doc;
    const decorations = [];
    if (ystate.snapshot != null || ystate.prevSnapshot != null || ystate.binding.mapping.size === 0) {
        // do not render cursors while snapshot is active
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$41$2e$4$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecorationSet"].create(state.doc, []);
    }
    awareness.getStates().forEach((aw, clientId)=>{
        if (!awarenessFilter(y.clientID, clientId, aw)) {
            return;
        }
        if (aw.cursor != null) {
            const user = aw.user || {};
            if (user.color == null) {
                user.color = '#ffa500';
            } else if (!rxValidColor.test(user.color)) {
                // We only support 6-digit RGB colors in y-prosemirror
                console.warn('A user uses an unsupported color format', user);
            }
            if (user.name == null) {
                user.name = `User: ${clientId}`;
            }
            let anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePositionToAbsolutePosition"])(y, ystate.type, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromJSON"](aw.cursor.anchor), ystate.binding.mapping);
            let head = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePositionToAbsolutePosition"])(y, ystate.type, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromJSON"](aw.cursor.head), ystate.binding.mapping);
            if (anchor !== null && head !== null) {
                const maxsize = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"](state.doc.content.size - 1, 0);
                anchor = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](anchor, maxsize);
                head = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](head, maxsize);
                decorations.push(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$41$2e$4$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoration"].widget(head, ()=>createCursor(user, clientId), {
                    key: clientId + '',
                    side: 10
                }));
                const from = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["min"](anchor, head);
                const to = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$lib0$40$0$2e$2$2e$114$2f$node_modules$2f$lib0$2f$math$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["max"](anchor, head);
                decorations.push(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$41$2e$4$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoration"].inline(from, to, createSelection(user, clientId), {
                    inclusiveEnd: true,
                    inclusiveStart: false
                }));
            }
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$view$40$1$2e$41$2e$4$2f$node_modules$2f$prosemirror$2d$view$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecorationSet"].create(state.doc, decorations);
};
const yCursorPlugin = (awareness, { awarenessStateFilter = defaultAwarenessStateFilter, cursorBuilder = defaultCursorBuilder, selectionBuilder = defaultSelectionBuilder, getSelection = (state)=>state.selection } = {}, cursorStateField = 'cursor')=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
        key: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yCursorPluginKey"],
        state: {
            init (_, state) {
                return createDecorations(state, awareness, awarenessStateFilter, cursorBuilder, selectionBuilder);
            },
            apply (tr, prevState, _oldState, newState) {
                const ystate = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(newState);
                const yCursorState = tr.getMeta(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yCursorPluginKey"]);
                if (ystate && ystate.isChangeOrigin || yCursorState && yCursorState.awarenessUpdated) {
                    return createDecorations(newState, awareness, awarenessStateFilter, cursorBuilder, selectionBuilder);
                }
                return prevState.map(tr.mapping, tr.doc);
            }
        },
        props: {
            decorations: (state)=>{
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yCursorPluginKey"].getState(state);
            }
        },
        view: (view)=>{
            const awarenessListener = ()=>{
                // @ts-ignore
                if (view.docView) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setMeta"])(view, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yCursorPluginKey"], {
                        awarenessUpdated: true
                    });
                }
            };
            const updateCursorInfo = ()=>{
                const ystate = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(view.state);
                // @note We make implicit checks when checking for the cursor property
                const current = awareness.getLocalState() || {};
                if (view.hasFocus()) {
                    const selection = getSelection(view.state);
                    /**
           * @type {Y.RelativePosition}
           */ const anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absolutePositionToRelativePosition"])(selection.anchor, ystate.type, ystate.binding.mapping);
                    /**
           * @type {Y.RelativePosition}
           */ const head = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absolutePositionToRelativePosition"])(selection.head, ystate.type, ystate.binding.mapping);
                    if (current.cursor == null || !__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareRelativePositions"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromJSON"](current.cursor.anchor), anchor) || !__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compareRelativePositions"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromJSON"](current.cursor.head), head)) {
                        awareness.setLocalStateField(cursorStateField, {
                            anchor,
                            head
                        });
                    }
                } else if (current.cursor != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$lib$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePositionToAbsolutePosition"])(ystate.doc, ystate.type, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRelativePositionFromJSON"](current.cursor.anchor), ystate.binding.mapping) !== null) {
                    // delete cursor information if current cursor information is owned by this editor binding
                    awareness.setLocalStateField(cursorStateField, null);
                }
            };
            awareness.on('change', awarenessListener);
            view.dom.addEventListener('focusin', updateCursorInfo);
            view.dom.addEventListener('focusout', updateCursorInfo);
            return {
                update: updateCursorInfo,
                destroy: ()=>{
                    view.dom.removeEventListener('focusin', updateCursorInfo);
                    view.dom.removeEventListener('focusout', updateCursorInfo);
                    awareness.off('change', awarenessListener);
                    awareness.setLocalStateField(cursorStateField, null);
                }
            };
        }
    });
}),
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/undo-plugin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultDeleteFilter",
    ()=>defaultDeleteFilter,
    "defaultProtectedNodes",
    ()=>defaultProtectedNodes,
    "redo",
    ()=>redo,
    "redoCommand",
    ()=>redoCommand,
    "undo",
    ()=>undo,
    "undoCommand",
    ()=>undoCommand,
    "yUndoPlugin",
    ()=>yUndoPlugin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/prosemirror-state@1.4.4/node_modules/prosemirror-state/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/sync-plugin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/dist/yjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/y-prosemirror@1.3.7_prosemi_460e031d2d9443c4b2d7d439817082ff/node_modules/y-prosemirror/src/plugins/keys.js [app-client] (ecmascript)");
;
;
;
;
const undo = (state)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(state)?.undoManager?.undo() != null;
const redo = (state)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(state)?.undoManager?.redo() != null;
const undoCommand = (state, dispatch)=>dispatch == null ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(state)?.undoManager?.canUndo() : undo(state);
const redoCommand = (state, dispatch)=>dispatch == null ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(state)?.undoManager?.canRedo() : redo(state);
const defaultProtectedNodes = new Set([
    'paragraph'
]);
const defaultDeleteFilter = (item, protectedNodes)=>!(item instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"]) || !(item.content instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContentType"]) || !(item.content.type instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"] || item.content.type instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XmlElement"] && protectedNodes.has(item.content.type.nodeName)) || item.content.type._length === 0;
const yUndoPlugin = ({ protectedNodes = defaultProtectedNodes, trackedOrigins = [], undoManager = null } = {})=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$prosemirror$2d$state$40$1$2e$4$2e$4$2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
        key: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"],
        state: {
            init: (initargs, state)=>{
                // TODO: check if plugin order matches and fix
                const ystate = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(state);
                const _undoManager = undoManager || new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$yjs$40$13$2e$6$2e$27$2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UndoManager"](ystate.type, {
                    trackedOrigins: new Set([
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"]
                    ].concat(trackedOrigins)),
                    deleteFilter: (item)=>defaultDeleteFilter(item, protectedNodes),
                    captureTransaction: (tr)=>tr.meta.get('addToHistory') !== false
                });
                return {
                    undoManager: _undoManager,
                    prevSel: null,
                    hasUndoOps: _undoManager.undoStack.length > 0,
                    hasRedoOps: _undoManager.redoStack.length > 0
                };
            },
            apply: (tr, val, oldState, state)=>{
                const binding = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(state).binding;
                const undoManager = val.undoManager;
                const hasUndoOps = undoManager.undoStack.length > 0;
                const hasRedoOps = undoManager.redoStack.length > 0;
                if (binding) {
                    return {
                        undoManager,
                        prevSel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$sync$2d$plugin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRelativeSelection"])(binding, oldState),
                        hasUndoOps,
                        hasRedoOps
                    };
                } else {
                    if (hasUndoOps !== val.hasUndoOps || hasRedoOps !== val.hasRedoOps) {
                        return Object.assign({}, val, {
                            hasUndoOps: undoManager.undoStack.length > 0,
                            hasRedoOps: undoManager.redoStack.length > 0
                        });
                    } else {
                        return val;
                    }
                }
            }
        },
        view: (view)=>{
            const ystate = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ySyncPluginKey"].getState(view.state);
            const undoManager = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(view.state).undoManager;
            undoManager.on('stack-item-added', ({ stackItem })=>{
                const binding = ystate.binding;
                if (binding) {
                    stackItem.meta.set(binding, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$y$2d$prosemirror$40$1$2e$3$2e$7_prosemi_460e031d2d9443c4b2d7d439817082ff$2f$node_modules$2f$y$2d$prosemirror$2f$src$2f$plugins$2f$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yUndoPluginKey"].getState(view.state).prevSel);
                }
            });
            undoManager.on('stack-item-popped', ({ stackItem })=>{
                const binding = ystate.binding;
                if (binding) {
                    binding.beforeTransactionSelection = stackItem.meta.get(binding) || binding.beforeTransactionSelection;
                }
            });
            return {
                destroy: ()=>{
                    undoManager.destroy();
                }
            };
        }
    });
}),
]);

//# sourceMappingURL=9603b_y-prosemirror_src_d6aad276._.js.map
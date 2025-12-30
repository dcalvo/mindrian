(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/internship/mindrian/frontend/src/components/BlueButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Keeping in here as a reference for now. Delete later.
__turbopack_context__.s([
    "BlueButton",
    ()=>BlueButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/next@16.0.6_@babel+core@7.2_93f69288f48f055a6d20b711204fdcd7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+react@0.44.1_@fl_6010d10a2001a7a907b5c3eb3727758b/node_modules/@blocknote/react/dist/blocknote-react.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function BlueButton() {
    _s();
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBlockNoteEditor"])();
    const Components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComponentsContext"])();
    // Tracks whether the text & background are both blue.
    const isSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditorState"])({
        editor,
        selector: {
            "BlueButton.useEditorState[isSelected]": ({ editor })=>editor.getActiveStyles().textColor === "blue" && editor.getActiveStyles().backgroundColor === "blue"
        }["BlueButton.useEditorState[isSelected]"]
    });
    // Doesn't render unless a at least one block with inline content is
    // selected. You can use a similar pattern of returning `null` to
    // conditionally render buttons based on the editor state.
    const blocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelectedBlocks"])();
    if (blocks.filter((block)=>block.content !== undefined).length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Components.FormattingToolbar.Button, {
        mainTooltip: "Blue Text & Background",
        onClick: ()=>{
            editor.toggleStyles({
                textColor: "blue",
                backgroundColor: "blue"
            });
        },
        isSelected: isSelected,
        children: "Blue"
    }, void 0, false, {
        fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/BlueButton.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(BlueButton, "vLJEylJGhB033Q0c1s35OfmaNjs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBlockNoteEditor"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComponentsContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditorState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelectedBlocks"]
    ];
});
_c = BlueButton;
var _c;
__turbopack_context__.k.register(_c, "BlueButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Editor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/next@16.0.6_@babel+core@7.2_93f69288f48f055a6d20b711204fdcd7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+react@0.44.1_@fl_6010d10a2001a7a907b5c3eb3727758b/node_modules/@blocknote/react/dist/blocknote-react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$mantine$40$0$2e$44$2e$1_$40$_5ebbfc40f450b37b00ad4d50c844cd7d$2f$node_modules$2f40$blocknote$2f$mantine$2f$dist$2f$blocknote$2d$mantine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+mantine@0.44.1_@_5ebbfc40f450b37b00ad4d50c844cd7d/node_modules/@blocknote/mantine/dist/blocknote-mantine.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$src$2f$components$2f$BlueButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/src/components/BlueButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function Editor() {
    _s();
    // Creates a new editor instance.
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateBlockNote"])({
        initialContent: [
            {
                type: "paragraph",
                content: "Welcome to this demo!"
            },
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: "You can now toggle ",
                        styles: {}
                    },
                    {
                        type: "text",
                        text: "blue",
                        styles: {
                            textColor: "blue",
                            backgroundColor: "blue"
                        }
                    },
                    {
                        type: "text",
                        text: " and ",
                        styles: {}
                    },
                    {
                        type: "text",
                        text: "code",
                        styles: {
                            code: true
                        }
                    },
                    {
                        type: "text",
                        text: " styles with new buttons in the Formatting Toolbar",
                        styles: {}
                    }
                ]
            },
            {
                type: "paragraph",
                content: "Select some text to try them out"
            },
            {
                type: "image",
                props: {
                    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                }
            },
            {
                type: "paragraph",
                content: "Notice that the buttons don't appear when the image block above is selected, as it has no inline content."
            },
            {
                type: "paragraph"
            }
        ]
    });
    // Renders the editor instance using a React component.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$mantine$40$0$2e$44$2e$1_$40$_5ebbfc40f450b37b00ad4d50c844cd7d$2f$node_modules$2f40$blocknote$2f$mantine$2f$dist$2f$blocknote$2d$mantine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockNoteView"], {
        editor: editor,
        formattingToolbar: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattingToolbarController"], {
            formattingToolbar: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattingToolbar"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockTypeSelect"], {}, "blockTypeSelect", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$src$2f$components$2f$BlueButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlueButton"], {}, "customButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileCaptionButton"], {}, "fileCaptionButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 90,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileReplaceButton"], {}, "replaceFileButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BasicTextStyleButton"], {
                            basicTextStyle: "bold"
                        }, "boldStyleButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BasicTextStyleButton"], {
                            basicTextStyle: "italic"
                        }, "italicStyleButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BasicTextStyleButton"], {
                            basicTextStyle: "underline"
                        }, "underlineStyleButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BasicTextStyleButton"], {
                            basicTextStyle: "strike"
                        }, "strikeStyleButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BasicTextStyleButton"], {
                            basicTextStyle: "code"
                        }, "codeStyleButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextAlignButton"], {
                            textAlignment: "left"
                        }, "textAlignLeftButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextAlignButton"], {
                            textAlignment: "center"
                        }, "textAlignCenterButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 117,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextAlignButton"], {
                            textAlignment: "right"
                        }, "textAlignRightButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorStyleButton"], {}, "colorStyleButton", false, {
                            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                            lineNumber: 125,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, void 0)
        }, void 0, false, {
            fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_s(Editor, "MXDVPmaldlkyMCRUFMD7+0H5xj8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateBlockNote"]
    ];
});
_c = Editor;
var _c;
__turbopack_context__.k.register(_c, "Editor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/src/components/Editor.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=Desktop_internship_mindrian_frontend_src_components_038bd443._.js.map
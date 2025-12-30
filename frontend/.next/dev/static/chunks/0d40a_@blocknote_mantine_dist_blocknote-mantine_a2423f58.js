(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+mantine@0.44.1_@_5ebbfc40f450b37b00ad4d50c844cd7d/node_modules/@blocknote/mantine/dist/blocknote-mantine.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockNoteView",
    ()=>Ft,
    "applyBlockNoteCSSVariablesFromTheme",
    ()=>A,
    "components",
    ()=>kt,
    "darkDefaultTheme",
    ()=>Bt,
    "defaultColorScheme",
    ()=>g,
    "lightDefaultTheme",
    ()=>G,
    "removeBlockNoteCSSVariables",
    ()=>Ie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/next@16.0.6_@babel+core@7.2_93f69288f48f055a6d20b711204fdcd7/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+core@0.44.1_@tip_46b4d8523240bf6739690e1026591f08/node_modules/@blocknote/core/dist/blockToNode-DBNbhwwC.js [app-client] (ecmascript) <export B as assertEmpty>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aL__as__isSafari$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+core@0.44.1_@tip_46b4d8523240bf6739690e1026591f08/node_modules/@blocknote/core/dist/defaultBlocks-DgA_mtQV.js [app-client] (ecmascript) <export aL as isSafari>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__as__as__mergeCSSClasses$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+core@0.44.1_@tip_46b4d8523240bf6739690e1026591f08/node_modules/@blocknote/core/dist/defaultBlocks-DgA_mtQV.js [app-client] (ecmascript) <export as as mergeCSSClasses>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__av__as__COLORS_DEFAULT$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+core@0.44.1_@tip_46b4d8523240bf6739690e1026591f08/node_modules/@blocknote/core/dist/defaultBlocks-DgA_mtQV.js [app-client] (ecmascript) <export av as COLORS_DEFAULT>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aw__as__COLORS_DARK_MODE_DEFAULT$3e$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+core@0.44.1_@tip_46b4d8523240bf6739690e1026591f08/node_modules/@blocknote/core/dist/defaultBlocks-DgA_mtQV.js [app-client] (ecmascript) <export aw as COLORS_DARK_MODE_DEFAULT>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@blocknote+react@0.44.1_@fl_6010d10a2001a7a907b5c3eb3727758b/node_modules/@blocknote/react/dist/blocknote-react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Button/Button.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/ActionIcon/ActionIcon.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tooltip$2f$Tooltip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Tooltip/Tooltip.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stack$2f$Stack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Stack/Stack.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Text/Text.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Group/Group.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Chip$2f$Chip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Chip/Chip.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Divider$2f$Divider$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Divider/Divider.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Card$2f$Card$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Card/Card.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Skeleton$2f$Skeleton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Skeleton/Skeleton.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Avatar$2f$Avatar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Avatar/Avatar.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$TextInput$2f$TextInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/TextInput/TextInput.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Menu/Menu.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Checkbox$2f$CheckIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Checkbox/CheckIcon.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tabs$2f$Tabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Tabs/Tabs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$LoadingOverlay$2f$LoadingOverlay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/LoadingOverlay/LoadingOverlay.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$FileInput$2f$FileInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/FileInput/FileInput.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Popover$2f$PopoverDropdown$2f$PopoverDropdown$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Popover/PopoverDropdown/PopoverDropdown.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Popover$2f$PopoverTarget$2f$PopoverTarget$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Popover/PopoverTarget/PopoverTarget.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Popover$2f$Popover$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Popover/Popover.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Badge$2f$Badge$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Badge/Badge.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Loader$2f$Loader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Loader/Loader.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Flex$2f$Flex$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/components/Flex/Flex.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$Mantine$2e$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$MantineProvider$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+core@8.3.9_@mantin_256766127a986e3f936241ee36aebb44/node_modules/@mantine/core/esm/core/MantineProvider/MantineProvider.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/next@16.0.6_@babel+core@7.2_93f69288f48f055a6d20b711204fdcd7/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$hover$2f$use$2d$hover$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+hooks@8.3.9_react@19.2.0/node_modules/@mantine/hooks/esm/use-hover/use-hover.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$merged$2d$ref$2f$use$2d$merged$2d$ref$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+hooks@8.3.9_react@19.2.0/node_modules/@mantine/hooks/esm/use-merged-ref/use-merged-ref.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$focus$2d$within$2f$use$2d$focus$2d$within$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+hooks@8.3.9_react@19.2.0/node_modules/@mantine/hooks/esm/use-focus-within/use-focus-within.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$focus$2d$trap$2f$use$2d$focus$2d$trap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/internship/mindrian/frontend/node_modules/.pnpm/@mantine+hooks@8.3.9_react@19.2.0/node_modules/@mantine/hooks/esm/use-focus-trap/use-focus-trap.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
const ee = (e, n, t = !1)=>{
    const o = [];
    function r(i, a = "--bn") {
        for(const l in i){
            const c = l.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), d = `${a}-${c}`;
            typeof i[l] != "object" ? (typeof i[l] == "number" && (i[l] = `${i[l]}px`), t ? n.style.removeProperty(d) : n.style.setProperty(d, i[l].toString())) : r(i[l], d);
        }
    }
    return r(e), o;
}, A = (e, n)=>ee(e, n), De = {
    colors: {
        editor: {
            text: void 0,
            background: void 0
        },
        menu: {
            text: void 0,
            background: void 0
        },
        tooltip: {
            text: void 0,
            background: void 0
        },
        hovered: {
            text: void 0,
            background: void 0
        },
        selected: {
            text: void 0,
            background: void 0
        },
        disabled: {
            text: void 0,
            background: void 0
        },
        shadow: void 0,
        border: void 0,
        sideMenu: void 0,
        highlights: {
            gray: {
                text: void 0,
                background: void 0
            },
            brown: {
                text: void 0,
                background: void 0
            },
            red: {
                text: void 0,
                background: void 0
            },
            orange: {
                text: void 0,
                background: void 0
            },
            yellow: {
                text: void 0,
                background: void 0
            },
            green: {
                text: void 0,
                background: void 0
            },
            blue: {
                text: void 0,
                background: void 0
            },
            purple: {
                text: void 0,
                background: void 0
            },
            pink: {
                text: void 0,
                background: void 0
            }
        }
    },
    borderRadius: void 0,
    fontFamily: void 0
}, Ie = (e)=>ee(De, e, !0), te = (e)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stack$2f$Stack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stack"], {
        gap: 0,
        className: "bn-tooltip",
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                size: "sm",
                lineClamp: 5,
                children: e.mainTooltip
            }),
            e.secondaryTooltip && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                size: "xs",
                lineClamp: 5,
                children: e.secondaryTooltip
            })
        ]
    }), O = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, mainTooltip: r, secondaryTooltip: i, icon: a, isSelected: l, isDisabled: c, onClick: d, label: f, variant: h, ...S } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(S, !1);
    const [x, y] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!1), P = o ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        "aria-label": f,
        className: t,
        onMouseDown: (w)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aL__as__isSafari$3e$__["isSafari"])() && w.currentTarget.focus();
        },
        onClick: (w)=>{
            y(!0), d == null || d(w);
        },
        onPointerLeave: ()=>y(!1),
        "aria-pressed": l,
        "data-selected": l || void 0,
        "data-test": r ? r.slice(0, 1).toLowerCase() + r.replace(/\s+/g, "").slice(1) : void 0,
        size: h === "compact" ? "compact-xs" : "xs",
        disabled: c || !1,
        ref: n,
        ...S,
        children: o
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionIcon"], {
        className: t,
        "aria-label": f,
        onMouseDown: (w)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aL__as__isSafari$3e$__["isSafari"])() && w.currentTarget.focus();
        },
        onClick: (w)=>{
            y(!0), d == null || d(w);
        },
        onPointerLeave: ()=>y(!1),
        "aria-pressed": l,
        "data-selected": l || void 0,
        "data-test": r ? r.slice(0, 1).toLowerCase() + r.replace(/\s+/g, "").slice(1) : void 0,
        size: h === "compact" ? 20 : 30,
        disabled: c || !1,
        ref: n,
        ...S,
        children: a
    });
    return r ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tooltip$2f$Tooltip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
        disabled: x,
        withinPortal: !1,
        label: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(te, {
            mainTooltip: r,
            secondaryTooltip: i
        }),
        children: P
    }) : P;
}), Re = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, text: o, icon: r, isSelected: i, mainTooltip: a, secondaryTooltip: l, onClick: c, onMouseEnter: d, ...f } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(f, !1);
    const [h, S] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!1), x = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Chip$2f$Chip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Chip"], {
        className: t,
        checked: i === !0,
        wrapperProps: {
            onMouseEnter: d,
            onMouseLeave: ()=>S(!1),
            onClick: (y)=>{
                S(!0), c == null || c(y);
            }
        },
        variant: "light",
        icon: null,
        ref: n,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                children: r
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                children: o
            })
        ]
    });
    return !a || h ? x : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tooltip$2f$Tooltip$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
        refProp: "rootRef",
        withinPortal: !1,
        label: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(te, {
            mainTooltip: a,
            secondaryTooltip: l
        }),
        children: x
    });
}), ze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        className: t,
        ref: n,
        children: o
    });
}), Be = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, headerText: r, selected: i, onFocus: a, onBlur: l, tabIndex: c, ...d } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(d, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Card$2f$Card$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__as__as__mergeCSSClasses$3e$__["mergeCSSClasses"])(t, i ? "selected" : ""),
        onFocus: a,
        onBlur: l,
        tabIndex: c,
        ref: n,
        children: [
            r && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                className: "bn-header-text",
                children: r
            }),
            o
        ]
    });
}), Ee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Card$2f$Card$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"].Section, {
        className: t,
        ref: n,
        children: o
    });
}), Le = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Divider$2f$Divider$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Divider"], {
        className: t,
        label: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
            children: o
        }),
        ref: n
    });
}), je = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { authorInfo: t, timeString: o, edited: r, ...i } = e, a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDictionary"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i, !1), t === "loading" ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Skeleton$2f$Skeleton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                height: 24,
                width: 24
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Skeleton$2f$Skeleton$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 12,
                    width: 100
                })
            })
        ]
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Avatar$2f$Avatar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                src: t.avatarUrl,
                alt: t.username,
                radius: "xl",
                size: "sm",
                color: "initials"
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                fz: "sm",
                fw: "bold",
                children: [
                    t.username,
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                        fz: "xs",
                        c: "dimmed",
                        span: !0,
                        ml: "xs",
                        children: [
                            o,
                            " ",
                            r && `(${a.comments.edited})`
                        ]
                    })
                ]
            })
        ]
    });
}), $e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, showActions: o, authorInfo: r, timeString: i, edited: a, actions: l, emojiPickerOpen: c, children: d, ...f } = e, { hovered: h, ref: S } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$hover$2f$use$2d$hover$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHover"])(), x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeRefs"])([
        n,
        S
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(f, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        pos: "relative",
        ref: x,
        className: t,
        children: [
            l && (o === !0 || o === void 0 || o === "hover" && h || c) ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                style: {
                    position: "absolute",
                    right: 0,
                    top: 0,
                    zIndex: 10
                },
                children: l
            }) : null,
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(je, {
                ...e
            }),
            d
        ]
    });
}), Ae = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, autoFocus: o, onFocus: r, onBlur: i, editor: a, editable: l, ...c } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(c, !1);
    const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBlockNoteContext"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Ft, {
        autoFocus: o,
        className: t,
        editor: e.editor,
        sideMenu: !1,
        slashMenu: !1,
        tableHandles: !1,
        filePanel: !1,
        formattingToolbar: !1,
        editable: l,
        theme: d == null ? void 0 : d.colorSchemePreference,
        ref: n,
        onFocus: r,
        onBlur: i,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattingToolbarController"], {
            formattingToolbar: _e
        })
    });
}), _e = ()=>{
    const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFormattingToolbarItems"])([]).filter((n)=>n.key !== "nestBlockButton" && n.key !== "unnestBlockButton");
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormattingToolbar"], {
        blockTypeSelectItems: [],
        children: e
    });
}, Ve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, name: o, label: r, variant: i, icon: a, value: l, autoFocus: c, placeholder: d, disabled: f, onKeyDown: h, onChange: S, onSubmit: x, autoComplete: y, rightSection: P, ...w } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(w), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$TextInput$2f$TextInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextInput"], {
        size: "xs",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__as__as__mergeCSSClasses$3e$__["mergeCSSClasses"])(t || "", i === "large" ? "bn-mt-input-large" : ""),
        ref: n,
        name: o,
        label: r,
        leftSection: a,
        value: l,
        autoFocus: c,
        "data-autofocus": c ? "true" : void 0,
        rightSection: P,
        placeholder: d,
        disabled: f,
        onKeyDown: h,
        onChange: S,
        onSubmit: x,
        autoComplete: y
    });
}), Ge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(void 0), He = (e)=>{
    const { children: n, onOpenChange: t, position: o, sub: r, ...i } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i), r ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Sub, {
        transitionProps: {
            duration: 250,
            exitDelay: 250
        },
        withinPortal: !1,
        middlewares: {
            flip: !0,
            shift: !0,
            inline: !1,
            size: !0
        },
        onChange: t,
        position: o,
        children: n
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"], {
        withinPortal: !1,
        middlewares: {
            flip: !0,
            shift: !0,
            inline: !1,
            size: !0
        },
        onChange: t,
        position: o,
        children: n
    });
}, Ke = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, icon: r, checked: i, subTrigger: a, onClick: l, ...c } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(c, !1), a ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Sub.Item, {
        className: t,
        ref: n,
        leftSection: r,
        rightSection: i ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Checkbox$2f$CheckIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
            size: 10
        }) : i === !1 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "bn-tick-space"
        }) : null,
        onClick: l,
        ...c,
        children: o
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Item, {
        className: t,
        ref: n,
        leftSection: r,
        rightSection: i ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Checkbox$2f$CheckIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
            size: 10
        }) : i === !1 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "bn-tick-space"
        }) : null,
        onClick: l,
        ...c,
        children: o
    });
}), Ue = (e)=>{
    const { children: n, sub: t, // unused
    ...o } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(o), t ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Sub.Target, {
        children: n
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Target, {
        children: n
    });
}, We = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, sub: r, //unused
    ...i } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i);
    const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(Ge);
    return r ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Sub.Dropdown, {
        className: t,
        ref: n,
        onMouseOver: a == null ? void 0 : a.onMenuMouseOver,
        onMouseLeave: a == null ? void 0 : a.onMenuMouseLeave,
        children: o
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Dropdown, {
        className: t,
        ref: n,
        onMouseOver: a == null ? void 0 : a.onMenuMouseOver,
        onMouseLeave: a == null ? void 0 : a.onMenuMouseLeave,
        children: o
    });
}), qe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, ...o } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(o), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Divider, {
        className: t,
        ref: n
    });
}), Ze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Label, {
        className: t,
        ref: n,
        children: o
    });
}), Je = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, icon: r, onClick: i, onDragEnd: a, onDragStart: l, draggable: c, label: d, ...f } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(f, !1), r ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionIcon"], {
        size: 24,
        className: t,
        ref: n,
        onClick: i,
        onDragEnd: a,
        onDragStart: l,
        draggable: c,
        "aria-label": d,
        ...f,
        children: r
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        className: t,
        ref: n,
        onClick: i,
        onDragEnd: a,
        onDragStart: l,
        draggable: c,
        "aria-label": d,
        ...f,
        children: o
    });
}), Qe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, tabs: o, defaultOpenTab: r, openTab: i, setOpenTab: a, loading: l, ...c } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(c), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        className: t,
        ref: n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tabs$2f$Tabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
            value: i,
            defaultValue: r,
            onChange: a,
            children: [
                l && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$LoadingOverlay$2f$LoadingOverlay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoadingOverlay"], {
                    visible: l
                }),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tabs$2f$Tabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"].List, {
                    children: o.map((d)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tabs$2f$Tabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"].Tab, {
                            "data-test": `${d.name.toLowerCase()}-tab`,
                            value: d.name,
                            children: d.name
                        }, d.name))
                }),
                o.map((d)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Tabs$2f$Tabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"].Panel, {
                        value: d.name,
                        children: d.tabPanel
                    }, d.name))
            ]
        })
    });
}), Xe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, onClick: r, label: i, ...a } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(a), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        size: "xs",
        "aria-label": i,
        className: t,
        ref: n,
        onClick: r,
        ...a,
        children: o
    });
}), Ye = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, accept: o, value: r, placeholder: i, onChange: a, ...l } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(l), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$FileInput$2f$FileInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileInput"], {
        size: "xs",
        className: t,
        ref: n,
        accept: o,
        value: r,
        placeholder: i,
        onChange: a,
        ...l
    });
}), et = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: t,
        ref: n,
        children: o
    });
}), tt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, value: o, placeholder: r, onKeyDown: i, onChange: a, ...l } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(l), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$TextInput$2f$TextInput$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextInput"], {
        size: "xs",
        "data-test": "embed-input",
        className: t,
        ref: n,
        value: o,
        placeholder: r,
        onKeyDown: i,
        onChange: a
    });
}), nt = (e)=>{
    const { open: n, onOpenChange: t, position: o, children: r, ...i } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Popover$2f$Popover$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
        middlewares: {
            size: {
                padding: 20
            }
        },
        withinPortal: !1,
        opened: n,
        onChange: t,
        position: o,
        zIndex: 1e4,
        children: r
    });
}, ot = (e)=>{
    const { children: n, ...t } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(t), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Popover$2f$PopoverTarget$2f$PopoverTarget$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTarget"], {
        children: n
    });
}, rt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, variant: r, // unused
    ...i } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Popover$2f$PopoverDropdown$2f$PopoverDropdown$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverDropdown"], {
        className: t,
        ref: n,
        children: o
    });
}), st = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        align: "center",
        gap: 0,
        className: t,
        ref: n,
        ...r,
        children: o
    });
}), it = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, icon: r, onClick: i, onDragEnd: a, onDragStart: l, draggable: c, label: d, ...f } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(f, !1), r ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$ActionIcon$2f$ActionIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionIcon"], {
        size: 24,
        className: t,
        ref: n,
        onClick: i,
        onDragEnd: a,
        onDragStart: l,
        draggable: c,
        "aria-label": d,
        ...f,
        children: r
    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        className: t,
        ref: n,
        onClick: i,
        onDragEnd: a,
        onDragStart: l,
        draggable: c,
        "aria-label": d,
        ...f,
        children: o
    });
}), at = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, id: r, ...i } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stack$2f$Stack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stack"], {
        gap: 0,
        className: t,
        ref: n,
        id: r,
        role: "listbox",
        children: o
    });
}), lt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        className: t,
        ref: n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
            className: "bn-mt-suggestion-menu-item-title",
            children: o
        })
    });
}), ct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, isSelected: o, onClick: r, item: i, id: a, ...l } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(l);
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!c.current || !o) return;
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["elementOverflow"])(c.current, document.querySelector(".bn-suggestion-menu, #ai-suggestion-menu"));
        d === "top" ? c.current.scrollIntoView(!0) : d === "bottom" && c.current.scrollIntoView(!1);
    }, [
        o
    ]), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        gap: 0,
        className: t,
        ref: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$merged$2d$ref$2f$use$2d$merged$2d$ref$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeRefs"])(n, c),
        id: a,
        role: "option",
        onMouseDown: (d)=>d.preventDefault(),
        onClick: r,
        "aria-selected": o || void 0,
        children: [
            i.icon && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                className: "bn-mt-suggestion-menu-item-section",
                "data-position": "left",
                children: i.icon
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Stack$2f$Stack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stack"], {
                gap: 0,
                className: "bn-mt-suggestion-menu-item-body",
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                        className: "bn-mt-suggestion-menu-item-title",
                        children: i.title
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Text$2f$Text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                        className: "bn-mt-suggestion-menu-item-subtitle",
                        children: i.subtext
                    })
                ]
            }),
            i.badge && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
                "data-position": "right",
                className: "bn-mt-suggestion-menu-item-section",
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Badge$2f$Badge$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    size: "xs",
                    children: i.badge
                })
            })
        ]
    });
}), dt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, ...r } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(r), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        className: t,
        ref: n,
        children: o
    });
}), ut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, ...o } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(o), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Loader$2f$Loader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Loader"], {
        className: t,
        type: "dots",
        size: 16,
        ref: n
    });
}), mt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, id: r, columns: i, ...a } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(a), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: t,
        style: {
            gridTemplateColumns: `repeat(${i}, 1fr)`
        },
        ref: n,
        id: r,
        role: "grid",
        children: o
    });
}), gt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, columns: r, ...i } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        className: t,
        style: {
            gridColumn: `1 / ${r + 1}`
        },
        ref: n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Group$2f$Group$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
            className: "bn-mt-suggestion-menu-item-title",
            children: o
        })
    });
}), ft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, isSelected: o, onClick: r, item: i, id: a, ...l } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(l);
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!c.current || !o) return;
        const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["elementOverflow"])(c.current, document.querySelector(".bn-grid-suggestion-menu"));
        d === "top" ? c.current.scrollIntoView(!0) : d === "bottom" && c.current.scrollIntoView(!1);
    }, [
        o
    ]), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: t,
        ref: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$merged$2d$ref$2f$use$2d$merged$2d$ref$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeRefs"])(n, c),
        id: a,
        role: "option",
        onClick: r,
        "aria-selected": o || void 0,
        children: i.icon
    });
}), ht = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, // unused, using "dots" instead
    columns: r, ...i } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Loader$2f$Loader$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Loader"], {
        className: t,
        style: {
            gridColumn: `1 / ${r + 1}`
        },
        type: "dots",
        ref: n
    });
}), bt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { children: t, className: o, onMouseDown: r, onClick: i, ...a } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(a, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        className: o,
        ref: n,
        onMouseDown: r,
        onClick: i,
        ...a,
        children: t
    });
}), pt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, draggable: r, onDragStart: i, onDragEnd: a, style: l, label: c, ...d } = e;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(d, !1), /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        className: t,
        ref: n,
        "aria-label": c,
        draggable: r,
        onDragStart: i,
        onDragEnd: a,
        style: l,
        ...d,
        children: o
    });
}), D = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, children: o, onMouseEnter: r, onMouseLeave: i, variant: a, ...l } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(l);
    const { ref: c, focused: d } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$focus$2d$within$2f$use$2d$focus$2d$within$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusWithin"])(), f = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$focus$2d$trap$2f$use$2d$focus$2d$trap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFocusTrap"])(d), h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$hooks$40$8$2e$3$2e$9_react$40$19$2e$2$2e$0$2f$node_modules$2f40$mantine$2f$hooks$2f$esm$2f$use$2d$merged$2d$ref$2f$use$2d$merged$2d$ref$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeRefs"])(n, c, f);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Flex$2f$Flex$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Flex"], {
        className: t,
        ref: h,
        role: "toolbar",
        onMouseEnter: r,
        onMouseLeave: i,
        gap: a === "action-toolbar" ? 2 : void 0,
        children: o
    });
});
var ne = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0
}, _ = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext && /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(ne), vt = [
    "attr",
    "size",
    "title"
];
function St(e, n) {
    if (e == null) return {};
    var t = yt(e, n), o, r;
    if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        for(r = 0; r < i.length; r++)o = i[r], !(n.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(e, o) && (t[o] = e[o]);
    }
    return t;
}
function yt(e, n) {
    if (e == null) return {};
    var t = {};
    for(var o in e)if (Object.prototype.hasOwnProperty.call(e, o)) {
        if (n.indexOf(o) >= 0) continue;
        t[o] = e[o];
    }
    return t;
}
function F() {
    return F = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", F.apply(this, arguments);
}
function V(e, n) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        n && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function M(e) {
    for(var n = 1; n < arguments.length; n++){
        var t = arguments[n] != null ? arguments[n] : {};
        n % 2 ? V(Object(t), !0).forEach(function(o) {
            wt(e, o, t[o]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : V(Object(t)).forEach(function(o) {
            Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(t, o));
        });
    }
    return e;
}
function wt(e, n, t) {
    return n = xt(n), n in e ? Object.defineProperty(e, n, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[n] = t, e;
}
function xt(e) {
    var n = Ct(e, "string");
    return typeof n == "symbol" ? n : n + "";
}
function Ct(e, n) {
    if (typeof e != "object" || !e) return e;
    var t = e[Symbol.toPrimitive];
    if (t !== void 0) {
        var o = t.call(e, n);
        if (typeof o != "object") return o;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (n === "string" ? String : Number)(e);
}
function oe(e) {
    return e && e.map((n, t)=>/* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(n.tag, M({
            key: t
        }, n.attr), oe(n.child)));
}
function Nt(e) {
    return (n)=>/* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Tt, F({
            attr: M({}, e.attr)
        }, n), oe(e.child));
}
function Tt(e) {
    var n = (t)=>{
        var { attr: o, size: r, title: i } = e, a = St(e, vt), l = r || t.size || "1em", c;
        return t.className && (c = t.className), e.className && (c = (c ? c + " " : "") + e.className), /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("svg", F({
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, t.attr, o, a, {
            className: c,
            style: M(M({
                color: e.color || t.color
            }, t.style), e.style),
            height: l,
            width: l,
            xmlns: "http://www.w3.org/2000/svg"
        }), i && /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("title", null, i), e.children);
    };
    return _ !== void 0 ? /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(_.Consumer, null, (t)=>n(t)) : n(ne);
}
function Pt(e) {
    return Nt({
        attr: {
            viewBox: "0 0 20 20",
            fill: "currentColor",
            "aria-hidden": "true"
        },
        child: [
            {
                tag: "path",
                attr: {
                    fillRule: "evenodd",
                    d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                    clipRule: "evenodd"
                },
                child: []
            }
        ]
    })(e);
}
const I = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((e, n)=>{
    const { className: t, items: o, isDisabled: r, ...i } = e;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$blockToNode$2d$DBNbhwwC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__B__as__assertEmpty$3e$__["assertEmpty"])(i);
    const a = o.filter((l)=>l.isSelected)[0];
    return a ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"], {
        withinPortal: !1,
        transitionProps: {
            exitDuration: 0
        },
        disabled: r,
        middlewares: {
            flip: !0,
            shift: !0,
            inline: !1,
            size: !0
        },
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Target, {
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Button$2f$Button$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    onMouseDown: (l)=>{
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aL__as__isSafari$3e$__["isSafari"])() && l.currentTarget.focus();
                    },
                    leftSection: a.icon,
                    rightSection: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Pt, {}),
                    size: "xs",
                    variant: "subtle",
                    disabled: r,
                    children: a.text
                })
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Dropdown, {
                className: t,
                ref: n,
                children: o.map((l)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Menu$2f$Menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"].Item, {
                        onClick: l.onClick,
                        leftSection: l.icon,
                        rightSection: l.isSelected ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$components$2f$Checkbox$2f$CheckIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
                            size: 10,
                            className: "bn-tick-icon"
                        }) : // Ensures space for tick even if item isn't currently selected.
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                            className: "bn-tick-space"
                        }),
                        disabled: l.isDisabled,
                        children: l.text
                    }, l.text))
            })
        ]
    }) : null;
}), kt = {
    FormattingToolbar: {
        Root: D,
        Button: O,
        Select: I
    },
    FilePanel: {
        Root: Qe,
        Button: Xe,
        FileInput: Ye,
        TabPanel: et,
        TextInput: tt
    },
    GridSuggestionMenu: {
        Root: mt,
        Item: ft,
        EmptyItem: gt,
        Loader: ht
    },
    LinkToolbar: {
        Root: D,
        Button: O,
        Select: I
    },
    SideMenu: {
        Root: st,
        Button: it
    },
    SuggestionMenu: {
        Root: at,
        Item: ct,
        EmptyItem: lt,
        Label: dt,
        Loader: ut
    },
    TableHandle: {
        Root: pt,
        ExtendButton: bt
    },
    Generic: {
        Badge: {
            Root: Re,
            Group: ze
        },
        Form: {
            Root: (e)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    children: e.children
                }),
            TextInput: Ve
        },
        Menu: {
            Root: He,
            Trigger: Ue,
            Dropdown: We,
            Divider: qe,
            Label: Ze,
            Item: Ke,
            Button: Je
        },
        Popover: {
            Root: nt,
            Trigger: ot,
            Content: rt
        },
        Toolbar: {
            Root: D,
            Button: O,
            Select: I
        }
    },
    Comments: {
        Comment: $e,
        Editor: Ae,
        Card: Be,
        CardSection: Ee,
        ExpandSectionsPrompt: Le
    }
}, Ft = (e)=>{
    const { className: n, theme: t, ...o } = e, r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBlockNoteContext"])(), i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrefersColorScheme"])(), a = (r == null ? void 0 : r.colorSchemePreference) || i, l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((h)=>{
        if (h && (Ie(h), typeof t == "object")) {
            if ("light" in t && "dark" in t) {
                A(t[a === "dark" ? "dark" : "light"], h);
                return;
            }
            A(t, h);
            return;
        }
    }, [
        a,
        t
    ]), c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$Mantine$2e$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MantineContext"]), d = typeof t == "string" ? t : a !== "no-preference" ? a : "light", f = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComponentsContext"].Provider, {
        value: kt,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$react$40$0$2e$44$2e$1_$40$fl_6010d10a2001a7a907b5c3eb3727758b$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockNoteViewRaw"], {
            "data-mantine-color-scheme": d,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__as__as__mergeCSSClasses$3e$__["mergeCSSClasses"])("bn-mantine", n || ""),
            theme: typeof t == "object" ? void 0 : t,
            ...o,
            ref: l
        })
    });
    return c ? f : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$6_$40$babel$2b$core$40$7$2e$2_93f69288f48f055a6d20b711204fdcd7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$mantine$2b$core$40$8$2e$3$2e$9_$40$mantin_256766127a986e3f936241ee36aebb44$2f$node_modules$2f40$mantine$2f$core$2f$esm$2f$core$2f$MantineProvider$2f$MantineProvider$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MantineProvider"], {
        withCssVariables: !1,
        getRootElement: ()=>{},
        children: f
    });
}, g = [
    "#FFFFFF",
    "#EFEFEF",
    "#CFCFCF",
    "#AFAFAF",
    "#7F7F7F",
    "#3F3F3F",
    "#1F1F1F",
    "#161616",
    "#0F0F0F",
    "#000000"
], G = {
    colors: {
        editor: {
            text: g[5],
            background: g[0]
        },
        menu: {
            text: g[5],
            background: g[0]
        },
        tooltip: {
            text: g[5],
            background: g[1]
        },
        hovered: {
            text: g[5],
            background: g[1]
        },
        selected: {
            text: g[0],
            background: g[5]
        },
        disabled: {
            text: g[3],
            background: g[1]
        },
        shadow: g[2],
        border: g[1],
        sideMenu: g[2],
        highlights: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__av__as__COLORS_DEFAULT$3e$__["COLORS_DEFAULT"]
    },
    borderRadius: 6,
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Open Sans", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
}, Bt = {
    colors: {
        editor: {
            text: g[2],
            background: g[6]
        },
        menu: {
            text: g[2],
            background: g[6]
        },
        tooltip: {
            text: g[2],
            background: g[7]
        },
        hovered: {
            text: g[2],
            background: g[7]
        },
        selected: {
            text: g[2],
            background: g[8]
        },
        disabled: {
            text: g[5],
            background: g[7]
        },
        shadow: g[8],
        border: g[7],
        sideMenu: g[4],
        highlights: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$internship$2f$mindrian$2f$frontend$2f$node_modules$2f2e$pnpm$2f40$blocknote$2b$core$40$0$2e$44$2e$1_$40$tip_46b4d8523240bf6739690e1026591f08$2f$node_modules$2f40$blocknote$2f$core$2f$dist$2f$defaultBlocks$2d$DgA_mtQV$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aw__as__COLORS_DARK_MODE_DEFAULT$3e$__["COLORS_DARK_MODE_DEFAULT"]
    },
    borderRadius: G.borderRadius,
    fontFamily: G.fontFamily
};
;
 //# sourceMappingURL=blocknote-mantine.js.map
}),
]);

//# sourceMappingURL=0d40a_%40blocknote_mantine_dist_blocknote-mantine_a2423f58.js.map
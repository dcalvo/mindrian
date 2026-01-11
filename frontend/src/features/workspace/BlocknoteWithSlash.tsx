import { BlockNoteEditor } from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import SlashAgent from "./SlashAgent";

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  SlashAgent(editor),
];

export default function BlocknoteWithSlash(editor: BlockNoteEditor) {
  // Renders the editor instance.
  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      <SuggestionMenuController
        triggerCharacter={"/"}
        // Replaces the default Slash Menu items with our custom ones.
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  );
}

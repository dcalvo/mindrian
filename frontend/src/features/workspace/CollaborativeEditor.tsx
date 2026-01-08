import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  type BlockNoteEditor,
} from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import { BlockNoteView } from "@blocknote/mantine";
import {
  type DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { useMemo, useEffect } from "react";
import { useCollaboration } from "../../hooks/document/useCollaboration";
import { useAuth } from "../../hooks/auth/useAuth";
import { COLORS, getColorFromString } from "../../lib/colors";
import { Mention } from "./Mention";
import SlashAgent from "./SlashAgent";

interface CollaborativeEditorProps {
  docId: string;
}

// Schema definition
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
});

// Mentions menu items
const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  const users = ["Research Agent", "Coding Assistant", "Lawrence AI"];
  return users.map((user) => ({
    title: user,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user,
          },
        },
        " ",
      ]);
    },
  }));
};

// Slash menu items
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  SlashAgent(editor),
];

export function CollaborativeEditor({ docId }: CollaborativeEditorProps) {
  const { user } = useAuth();
  const userInfo = useMemo(
    () => ({
      name: user?.email?.split("@")[0] ?? "Anonymous",
      color: user?.email ? getColorFromString(user.email) : COLORS[0],
    }),
    [user]
  );

  const { collaboration, synced, provider } = useCollaboration({
    docId,
    user: userInfo,
  });

  // Set awareness local state
  useEffect(() => {
    if (provider.awareness && userInfo.name !== "Anonymous") {
      provider.awareness.setLocalStateField("user", userInfo);
    }
  }, [provider.awareness, userInfo]);

  const editor = useCreateBlockNote({
    schema,
    collaboration,
  });

  if (!synced) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--preview-text-tertiary)",
          fontSize: "14px",
        }}
      >
        Connecting...
      </div>
    );
  }

  return (
    <BlockNoteView editor={editor} theme="light" slashMenu={false}>
      <SuggestionMenuController
        triggerCharacter={"@"}
        getItems={async (query) =>
          filterSuggestionItems(getMentionMenuItems(editor as any), query)
        }
      />
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor as any), query)
        }
      />
    </BlockNoteView>
  );
}

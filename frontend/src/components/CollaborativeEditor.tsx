import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCollaboration } from "../hooks/useCollaboration";

const COLORS = ["#30bced", "#6eeb83", "#ffbc42", "#ee6352", "#9ac2c9"];

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

interface CollaborativeEditorProps {
  docId: string;
}

export function CollaborativeEditor({ docId }: CollaborativeEditorProps) {
  const { collaboration, synced } = useCollaboration({
    docId,
    user: {
      name: "Anonymous",
      color: getRandomColor(),
    },
  });

  const editor = useCreateBlockNote({ collaboration });

  if (!synced) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#666",
        }}
      >
        Connecting...
      </div>
    );
  }

  return <BlockNoteView editor={editor} theme="light" />;
}

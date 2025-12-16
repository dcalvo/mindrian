import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useMemo, useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCollaboration } from "../hooks/useCollaboration";
import { useAuth } from "../hooks/useAuth";
import { COLORS, getColorFromString } from "../lib/colors";

interface CollaborativeEditorProps {
  docId: string;
}

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

  // Set awareness local state with user info for cursor presence
  useEffect(() => {
    if (provider.awareness && userInfo.name !== "Anonymous") {
      provider.awareness.setLocalStateField("user", userInfo);
    }
  }, [provider.awareness, userInfo]);

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

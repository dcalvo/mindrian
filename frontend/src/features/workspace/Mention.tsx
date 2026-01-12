/* eslint-disable react-refresh/only-export-components */
import { createReactInlineContentSpec } from "@blocknote/react";
import { useEffect, useRef } from "react";

const loggedMentions = new WeakSet<object>();

interface MentionInlineContent {
  props: { user: string };
}

function MentionNode({
  inlineContent,
}: {
  inlineContent: MentionInlineContent;
}) {
  const loggedRef = useRef(false);
  const user = inlineContent.props.user as string;

  useEffect(() => {
    // Guard against React StrictMode double-invoking effects in dev
    if (loggedRef.current || loggedMentions.has(inlineContent)) return;
    loggedRef.current = true;
    loggedMentions.add(inlineContent);
    console.log(`Mentioned Agent: ${user}`);
  }, [inlineContent, user]);

  return <span>@{user}</span>;
}

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => <MentionNode inlineContent={props.inlineContent} />,
  }
);

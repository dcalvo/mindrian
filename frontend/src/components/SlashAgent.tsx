import { BlockNoteEditor } from "@blocknote/core";
import { insertOrUpdateBlockForSlashMenu } from "@blocknote/core/extensions";
import { HiOutlineGlobeAlt } from "react-icons/hi";

const agentFunction = () => {
  console.log("AI Slash Menu Option Clicked");
};

const SlashAgent = (editor: BlockNoteEditor) => ({
  title: "Agent",
  onItemClick: () => {
    agentFunction();
    insertOrUpdateBlockForSlashMenu(editor, {
      type: "paragraph",
      content: [{ type: "text", text: "Hello World", styles: { bold: true } }],
    });
  },
  aliases: ["agent", "ai"],
  group: "Other",
  icon: <HiOutlineGlobeAlt size={18} />,
  subtext: "Used to interact with AI Agent",
});

export default SlashAgent;
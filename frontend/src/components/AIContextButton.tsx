// Keeping in here as a reference for now. Delete later.
import "@blocknote/mantine/style.css";
import {
  useComponentsContext,
  useSelectedBlocks,
} from "@blocknote/react";
import type { Block } from "@blocknote/core";
import { useAIContext } from "@/contexts/AIContext";

/**
 * Extracts plain text from a block's content.
 * Handles both string content and array of InlineContent objects.
 */
const extractTextFromBlock = (block: Block<any, any, any>): string => {
  if (!block.content) {
    return "";
  }

  // If content is a string, return it directly
  if (typeof block.content === "string") {
    return block.content;
  }

  // If content is an array of InlineContent, extract text from each item
  if (Array.isArray(block.content)) {
    return block.content
      .map((item: any) => {
        if (typeof item === "string") {
          return item;
        }
        // InlineContent objects have a 'text' property
        return item.text || "";
      })
      .join("");
  }

  return "";
}

const AIContextButton = () => {
  const Components = useComponentsContext()!;
  const blocks = useSelectedBlocks();
  const { addToContext } = useAIContext();

  const handleAddToContext = (selectedBlocks: Block<any, any, any>[]) => {
    // Extract text from all selected blocks and combine them
    const extractedTexts = selectedBlocks
      .map(extractTextFromBlock)
      .filter((text) => text.trim().length > 0); // Filter out empty blocks

    if (extractedTexts.length === 0) {
      return; // No content to add
    }

    // Combine all block texts into a single string
    const combinedText = extractedTexts.join("\n");
    addToContext(combinedText);
  };

  // Don't render if no blocks with content are selected
  if (blocks.filter((block) => block.content !== undefined).length === 0) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Add context to AI Agent"}
      onClick={() => {
        handleAddToContext(blocks);
      }}
    >
      AI Context
    </Components.FormattingToolbar.Button>
  );
}

export default AIContextButton;
import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { fs } from "../../lib/fs";
import { Block } from "@blocknote/core";

interface LocalEditorProps {
  path: string;
}

export function LocalEditor({ path }: LocalEditorProps) {
  const [initialContent, setInitialContent] = useState<Block[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load content
  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Ensure file exists
        if (!(await fs.exists(path))) {
          // If it doesn't exist, maybe it was just created or there's an issue
          // We can initialize with empty array and let save create it?
          // Or error out. Better to error if it should exist.
          // But createDocument creates an empty file.
          throw new Error("File not found");
        }

        const content = await fs.readFile(path);
        try {
          const blocks = JSON.parse(content);
          if (isMounted) {
            setInitialContent(Array.isArray(blocks) ? blocks : []);
          }
        } catch (e) {
          // If empty file or invalid JSON, start fresh
          console.warn("Invalid JSON or empty file, starting fresh", e);
          if (isMounted) {
            setInitialContent([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load file");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, [path]);

  const editor = useCreateBlockNote({
    initialContent: initialContent,
  });

  // Debounced auto-save
  useEffect(() => {
    if (!editor || isLoading || error) return;

    const save = async () => {
      try {
        const blocks = editor.document;
        await fs.writeFile(path, JSON.stringify(blocks, null, 2));
      } catch (err) {
        console.error("Failed to save:", err);
      }
    };

    // Debounce wrapper
    let timeoutId: NodeJS.Timeout;
    const handleChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(save, 1000);
    };

    const unsubscribe = editor.onChange(handleChange);
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [editor, path, isLoading, error]);

  if (isLoading) {
    return <div className="editor-loading">Loading...</div>;
  }

  if (error) {
    return <div className="editor-error">Error: {error}</div>;
  }

  if (!editor) {
    return <div>Initializing editor...</div>;
  }

  return (
    <div
      className="local-editor-container"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}

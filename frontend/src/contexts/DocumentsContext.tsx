import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Channel } from "phoenix";
import {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getMe,
  type Document,
} from "../lib/api";
import { getSocket } from "../lib/socket";
import { DocumentsContext } from "./documents";

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        // Fetch user to get user_id for channel subscription
        const user = await getMe();
        if (cancelled) return;

        // Subscribe to real-time updates BEFORE fetching documents
        // This prevents missing events that occur during the fetch
        const socket = getSocket();
        const channel = socket.channel(`documents:${user.id}`);

        channel.on("document_created", ({ document }) => {
          setDocuments((prev) => {
            // Avoid duplicates (in case this client created it or event arrived during fetch)
            if (prev.some((d) => d.id === document.id)) return prev;
            return [document, ...prev];
          });
        });

        channel.on("document_updated", ({ document }) => {
          setDocuments((prev) =>
            prev.map((d) => (d.id === document.id ? document : d))
          );
        });

        channel.on("document_deleted", ({ id }) => {
          setDocuments((prev) => prev.filter((d) => d.id !== id));
        });

        channel.join();
        channelRef.current = channel;

        if (cancelled) {
          channel.leave();
          channelRef.current = null;
          return;
        }

        // Fetch initial documents after channel is subscribed
        const docs = await listDocuments();
        if (cancelled) return;

        setDocuments(docs);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load documents"
          );
          setLoading(false);
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        channelRef.current.leave();
        channelRef.current = null;
      }
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  // These functions just make API calls - state updates come via channel broadcasts
  const addDocument = useCallback(async (title?: string) => {
    return await createDocument(title);
  }, []);

  const renameDocument = useCallback(async (id: string, title: string) => {
    return await updateDocument(id, title);
  }, []);

  const removeDocument = useCallback(async (id: string) => {
    await deleteDocument(id);
  }, []);

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        loading,
        error,
        refetch,
        addDocument,
        renameDocument,
        removeDocument,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

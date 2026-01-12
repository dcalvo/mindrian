import { useContext, useSyncExternalStore, useCallback } from "react";
import { CollaborationContext } from "../../contexts/CollaborationContext";

interface UseCollaborationOptions {
  docId: string;
  user: {
    name: string;
    color: string;
  };
}

export function useCollaboration({ docId, user }: UseCollaborationOptions) {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      "useCollaboration must be used within a CollaborationProvider"
    );
  }

  const instance = context.getInstance(docId);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      instance.provider.on("sync", onStoreChange);
      return () => {
        instance.provider.off("sync", onStoreChange);
      };
    },
    [instance.provider]
  );

  const getSnapshot = useCallback(() => {
    return instance.provider.synced;
  }, [instance.provider]);

  const synced = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...instance,
    synced,
    collaboration: {
      provider: instance.provider,
      fragment: instance.fragment,
      user,
    },
  };
}

import {
  type ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import type { User } from "../lib/api";
import { Header } from "./Header";
import { FileTree } from "./FileTree";
import { ChatPane } from "./ChatPane";
import "./Layout.css";

interface LayoutProps {
  user: User;
  children: ReactNode;
}

export function Layout({ user, children }: LayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.max(200, e.clientX); // Min width 200px
      const maxWidth = window.innerWidth * 0.5; // Max width 50% of screen
      if (newWidth < maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResizing = useCallback(() => {
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  return (
    <div className="layout">
      <Header user={user} />
      <div className="layout-body">
        <FileTree width={sidebarWidth} />
        <div className="resize-handle" onMouseDown={startResizing} />
        <main className="content-area">{children}</main>
        <ChatPane />
      </div>
    </div>
  );
}

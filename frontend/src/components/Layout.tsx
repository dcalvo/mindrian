import type { ReactNode } from "react";
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
  return (
    <div className="layout">
      <Header user={user} />
      <div className="layout-body">
        <FileTree />
        <main className="content-area">{children}</main>
        <ChatPane />
      </div>
    </div>
  );
}

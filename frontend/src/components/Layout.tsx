import type { User } from "../lib/api";
import { Header } from "./Header";
import { FileTree } from "./FileTree";
import { ContentArea } from "./ContentArea";
import { ChatPane } from "./ChatPane";
import "./Layout.css";

interface LayoutProps {
  user: User;
}

export function Layout({ user }: LayoutProps) {
  return (
    <div className="layout">
      <Header user={user} />
      <div className="layout-body">
        <FileTree />
        <ContentArea />
        <ChatPane />
      </div>
    </div>
  );
}

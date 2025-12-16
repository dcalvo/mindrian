import type { User } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { PresenceBubbles } from "./PresenceBubbles";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-logo">Mindrian</div>
      <PresenceBubbles />
      <div className="header-user">
        <span>{user.email}</span>
        <button onClick={logout}>Log Out</button>
      </div>
    </header>
  );
}

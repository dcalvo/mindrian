import { usePresenceContext } from "../../contexts/PresenceContext";
import { getColorFromString, getInitials } from "../../lib/colors";
import "./PresenceBubbles.css";

export function PresenceBubbles() {
  const { users, loading } = usePresenceContext();

  if (loading || users.length === 0) {
    return null;
  }

  return (
    <div className="presence-bubbles">
      {users.map((user) => (
        <div
          key={user.id}
          className="presence-bubble"
          style={{ backgroundColor: getColorFromString(user.email) }}
          title={user.email}
        >
          {getInitials(user.email)}
        </div>
      ))}
    </div>
  );
}

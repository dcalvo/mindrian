import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/")({
  component: function Index() {
    const { user, loading, isAuthenticated, login } = useAuth();

    if (loading) {
      return (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="login-prompt">
          <h1>Welcome to Mindrian</h1>
          <p>Please log in to continue.</p>
          <button onClick={login}>Log In</button>
        </div>
      );
    }

    return <Layout user={user!} />;
  },
});

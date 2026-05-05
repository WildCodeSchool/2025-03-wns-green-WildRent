import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route that requires authentication.
 * Redirects to /login if the user is not connected.
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="flex justify-center px-4 py-12">
        <p className="text-sm font-[family-name:var(--font-text)] text-[#acaf91]">
          Chargement...
        </p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

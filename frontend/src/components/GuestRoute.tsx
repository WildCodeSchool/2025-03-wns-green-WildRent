import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

/**
 * Redirects authenticated users away from guest-only pages (login, register).
 * If the user is already logged in, they are redirected to the profile page.
 */
export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm font-[family-name:var(--font-text)] text-[#acaf91]">
          Chargement...
        </p>
      </section>
    );
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const success = await login(email, password);
    if (success) {
      navigate("/");
    }

    setSubmitting(false);
  };

  return (
    <section className="flex justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="border border-[#87a700] rounded-2xl bg-white p-5 sm:p-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-title)] text-[#31380d] uppercase tracking-wide mb-6 text-center">
            Se connecter
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] border border-[#acaf91] rounded-lg px-3 py-2 focus:outline-none focus:border-[#87a700]"
              />
            </div>

            <div>
              <label className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1 block">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] border border-[#acaf91] rounded-lg px-3 py-2 focus:outline-none focus:border-[#87a700]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 text-sm font-medium font-[family-name:var(--font-text)] bg-[#87a700] text-[#fdffe9] rounded-full hover:bg-[#31380d] transition-colors disabled:opacity-50"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] text-center mt-6">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-[#87a700] hover:underline font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

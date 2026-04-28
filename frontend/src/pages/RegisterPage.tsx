import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { CREATE_USER } from "../graphql/operations";
import { handleGraphQLError } from "../utils/handleGraphQLError";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser({
        variables: { data: { email, password, passwordConfirm } },
      });

      toast.success("Compte créé avec succès ! Connectez-vous.");
      navigate("/login");
    } catch (error: any) {
      handleGraphQLError(error);
    }
  };

  return (
    <section className="flex justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="border border-[#87a700] rounded-2xl bg-white p-5 sm:p-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-title)] text-[#31380d] uppercase tracking-wide mb-6 text-center">
            Créer un compte
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] border border-[#acaf91] rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#87a700]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#acaf91] hover:text-[#31380d] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] font-[family-name:var(--font-text)] text-[#acaf91] mt-1">
                Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole
              </p>
            </div>

            <div>
              <label className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mb-1 block">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  className="w-full text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d] border border-[#acaf91] rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#87a700]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#acaf91] hover:text-[#31380d] transition-colors"
                >
                  {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-sm font-medium font-[family-name:var(--font-text)] bg-[#87a700] text-[#fdffe9] rounded-full hover:bg-[#31380d] transition-colors disabled:opacity-50"
            >
              {loading ? "Création..." : "S'inscrire"}
            </button>
          </form>

          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] text-center mt-6">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-[#87a700] hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

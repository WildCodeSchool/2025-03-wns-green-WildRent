import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold font-[family-name:var(--font-title)] text-[#87a700] mb-4">
        404
      </h1>
      <h2 className="text-2xl font-bold font-[family-name:var(--font-title)] text-[#31380d] mb-2">
        Page introuvable
      </h2>
      <p className="text-sm font-[family-name:var(--font-text)] text-[#acaf91] mb-8 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#87a700] hover:bg-[#6d8600] text-white font-bold font-[family-name:var(--font-text)] rounded-lg transition-colors"
      >
        Retour à l'accueil
      </Link>
    </section>
  );
};

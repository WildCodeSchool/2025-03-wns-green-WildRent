import { Instagram, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-[var(--dark-green)] text-white">
      <div className="w-full">
        {/* Desktop & Tablet */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-6 lg:px-6 xl:px-44 h-16 items-center justify-between">
          <span className="font-[family-name:var(--font-title)] font-bold text-xl tracking-wide pl-3">
            WILDRENT
          </span>

          <nav className="flex gap-5 text-xs">
            <a href="/contact">Contact</a>
            <a href="/privacy">Données personnelles</a>
            <a href="/cookies">Gestion des cookies</a>
            <a href="/accessibility">Accessibilité</a>
          </nav>

          <div className="flex gap-3 pr-3">
            <Instagram size={15} className="hover:text-[var(--light-green)] transition-colors" />
            <Facebook size={15} className="hover:text-[var(--light-green)] transition-colors" />
            <Twitter size={15} className="hover:text-[var(--light-green)] transition-colors" />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden w-full px-6 py-3 flex flex-col gap-3 items-center">
          <span className="font-[family-name:var(--font-title)] font-bold text-lg tracking-wide leading-none">
            WILDRENT
          </span>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] items-center text-center">
            <a href="/contact">Contact</a>
            <a href="/privacy">Données personnelles</a>
            <a href="/cookies">Cookies</a>
            <a href="/accessibility">Accessibilité</a>
          </nav>

          <div className="flex justify-center gap-4">
            <Instagram size={14} className="hover:text-[var(--light-green)] transition-colors" />
            <Facebook size={14} className="hover:text-[var(--light-green)] transition-colors" />
            <Twitter size={14} className="hover:text-[var(--light-green)] transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};
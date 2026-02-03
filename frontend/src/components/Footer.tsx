import { Instagram, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#2f3a0d] text-white">
      <div className="w-full">
        {/* Desktop & Tablet */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-6 lg:px-8 xl:px-40 h-12 items-center justify-between">
          <span className="font-[family-name:var(--font-title)] font-bold text-3xl tracking-wide leading-relaxed pl-3">
            WILDRENT
          </span>

          <nav className="flex gap-6 text-sm">
            <a href="/contact">Contact</a>
            <a href="/privacy">Données personnelles</a>
            <a href="/cookies">Gestion des cookies</a>
            <a href="/accessibility">Accessibilité</a>
          </nav>

          <div className="flex gap-4 pr-3">
            <Instagram size={18} className="hover:text-[#87a700] transition-colors"/>
            <Facebook size={18} className="hover:text-[#87a700] transition-colors"/>
            <Twitter size={18} className="hover:text-[#87a700] transition-colors"/>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden w-full px-7 py-3 flex flex-col gap-6 items-center">
          <span className="font-[family-name:var(--font-title)] font-bold text-3xl tracking-wide leading-none">
            WILDRENT
          </span>

          <nav className="flex flex-col gap-3 text-[18px] items-center text-center leading-[10px] max-w-[360px]">
            <a href="/contact">Contact</a>
            <span className="w-3 h-[2px] bg-white/60 my-1 rounded-full" />
            <a href="/privacy">Données personnelles</a>
            <span className="w-3 h-[2px] bg-white/60 my-1 rounded-full" />
            <a href="/cookies">Gestion des cookies</a>
            <span className="w-3 h-[2px] bg-white/60 my-1 rounded-full" />
            <a href="/accessibility">Accessibilité</a>
          </nav>

          <div className="flex justify-center gap-5 pr-3">
            <Instagram size={20} className="hover:text-[#87a700] transition-colors"/>
            <Facebook size={20} className="hover:text-[#87a700] transition-colors"/>
            <Twitter size={20} className="hover:text-[#87a700] transition-colors"/>
          </div>
        </div>
      </div>
    </footer>
  );
};
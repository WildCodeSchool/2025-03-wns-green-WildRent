import React from "react";
import { User, ShoppingCart } from "lucide-react";
import { SearchBar } from "./SearchBar";

export const Navbar: React.FC = () => {
  return (
    //<nav className="relative w-full bg-[#fdffe9] border-b border-[#e5e7eb]/40">
    <nav className="relative w-full bg-[#fdffe9]">
      <div className="px-4 xl:px-6 2xl:px-24 py-6 lg:py-8">
        {/* Top row */}
        <div className="flex items-center justify-between gap-1">
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-[family-name:var(--font-title)] font-bold text-2xl lg:text-[28px] tracking-wider text-[#31380d]">
              WILDRENT
            </span>
          </div>

          {/* Search DESKTOP */}
          <div className="hidden md:flex flex-[2] mx-6 xl:mx-12">
            <div className="mx-auto w-full flex justify-center">
              <SearchBar />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex flex-col items-center gap-2 text-[#31380d] hover:text-[#87a700] transition-colors">
              <User size={20} strokeWidth={2} />
              <span className="hidden sm:block text-[11px] font-medium font-[family-name:var(--font-text)] leading-none">
                Se connecter
              </span>
            </button>

            <button className="flex flex-col items-center gap-2 text-[#31380d] hover:text-[#87a700] transition-colors">
              <ShoppingCart size={20} strokeWidth={2} />
              <span className="hidden sm:block text-[11px] font-medium font-[family-name:var(--font-text)] leading-none">
                Mon panier
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Search MOBILE */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-full px-4 flex justify-center md:hidden z-20">
        <SearchBar />
      </div>
    </nav>
  );
};

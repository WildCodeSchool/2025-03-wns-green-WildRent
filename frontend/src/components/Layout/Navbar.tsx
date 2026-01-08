import React from "react";
import { User, ShoppingCart } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className={navbarContainer}>
      <div className={navbarInner}>
        {/* Logo */}
        <div className={logoWrapper}>
          <span className={logoText}>WILDRENT</span>
        </div>

        {/* Search placeholder*/}
        <div className={searchSlot}>{/* <SearchBar /> */}</div>

        {/* Right actions */}
        <div className={actionsWrapper}>
          <button className={iconButton} aria-label="Se connecter">
            <User size={20} strokeWidth={3} />
            <span className={iconLabel}>Se connecter</span>
          </button>

          <button className={iconButton} aria-label="Mon panier">
            <ShoppingCart size={20} strokeWidth={3} />
            <span className={iconLabel}>Mon panier</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

/* ===== Layout ===== */
const navbarContainer = `
  w-full
  bg-[#fdffe9]
  border-b border-[#e5e7eb]/40
`;

/* ===== Inner wrapper ===== */
const navbarInner = `
  max-w-7xl
  mx-auto
  flex items-center justify-between
  px-4 py-4
  sm:px-6
`;

/* ===== Logo ===== */
const logoWrapper = `
  flex items-center
`;

const logoText = `
  font-[family-name:var(--font-title)]
  font-bold
  text-2xl
  tracking-wider
  text-[#31380d]
`;

/* ===== Search slot ===== */
const searchSlot = `
  hidden
  md:flex
  flex-1
  mx-6
`;

/* ===== Actions ===== */
const actionsWrapper = `
  flex items-center gap-3
`;

const iconButton = `
  flex flex-col items-center gap-2
  text-[#31380d]
  hover:text-[#87a700]
  transition-colors
`;

const iconLabel = `
  text-[11px]
  font-medium
  font-[family-name:var(--font-text)]
  leading-none
`;


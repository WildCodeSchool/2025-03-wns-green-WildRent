import React from "react";
import { User, ShoppingCart } from "lucide-react";
import { SearchBar } from "../Search/SearchBar";
import {
  navbarContainer,
  navbarInner,
  topRow,
  logoWrapper,
  logoText,
  searchDesktop,
  searchMobile,
  actionsWrapper,
  iconButton,
  iconLabel,
} from "./navbar.styles";


export const Navbar: React.FC = () => {
  return (
    <nav className={navbarContainer}>
      <div className={navbarInner}>
        {/* Ligne principale */}
        <div className={topRow}>
          <div className={logoWrapper}>
            <span className={logoText}>WILDRENT</span>
          </div>

          {/* Search DESKTOP only */}
          <div className={searchDesktop}>
            <SearchBar />
          </div>

          <div className={actionsWrapper}>
            <button className={iconButton}>
              <User size={20} strokeWidth={2} />
              <span className={iconLabel}>Se connecter</span>
            </button>
            <button className={iconButton}>
              <ShoppingCart size={20} strokeWidth={2} />
              <span className={iconLabel}>Mon panier</span>
            </button>
          </div>
        </div>

        {/* Search MOBILE only */}
        <div className={searchMobile}>
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};
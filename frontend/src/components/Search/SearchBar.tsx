import React from "react";
import { Search } from "lucide-react";
import {
  searchContainer,
  searchInput,
  searchIcon,
} from "./searchBar.styles";

export const SearchBar: React.FC = () => {
  return (
    <div className={searchContainer}>
      <input
        type="text"
        placeholder="Rechercher un produit, une catégorie ou une référence"
        className={searchInput}
      />
      <Search size={18} strokeWidth={1.75} className={searchIcon} />
    </div>
  );
};


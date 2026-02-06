import React from "react";
import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="flex items-center w-full max-w-[65rem] bg-white rounded-full px-4 py-2 shadow-sm">
      <input
        type="text"
        placeholder="Rechercher un produit, une catégorie ou une référence"
        className="w-full bg-transparent outline-none text-[12px] md:text-[13px] leading-[1.2] font-[family-name:var(--font-text)] placeholder:text-gray-400 pr-2"
      />
      <Search
        size={18}
        strokeWidth={1.75}
        className="text-gray-400 cursor-pointer"
      />
    </div>
  );
};

import React from "react";
import { Search } from "lucide-react";

export const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center w-full max-w-[20rem] md:max-w-[24rem] lg:max-w-md bg-white rounded-full px-3 sm:px-4 py-2 shadow-sm">
      <input
        type="text"
        placeholder="Rechercher un produit, une catégorie ou une référence"
        className="w-full bg-transparent outline-none text-[12px] md:text-[13px] leading-[1.15] md:leading-[1.2] font-[family-name:var(--font-text)] placeholder:text-gray-400 placeholder:text-[11px] md:placeholder:text-[13px] pr-2 sm:pr-3"/>
      <Search
        size={18}
        strokeWidth={1.75}
        className="text-gray-400 cursor-pointer"
      />
    </div>
  );
};
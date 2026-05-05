import { useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      setQuery("");
    }
  };

  return (
    <div className="flex items-center w-full max-w-[65rem] bg-white rounded-full px-3 sm:px-4 py-2 shadow-sm" role="search">
      <label htmlFor="search-input" className="sr-only">Rechercher</label>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Rechercher un produit, une catégorie ou une référence"
        className="w-full bg-transparent outline-none text-[12px] md:text-[13px] leading-[1.2] font-[family-name:var(--font-text)] placeholder:text-gray-400 pr-2"
      />
      <button
        type="button"
        onClick={handleSearch}
        aria-label="Lancer la recherche"
        className="text-gray-400 cursor-pointer hover:text-[#87a700] transition-colors"
      >
        <Search size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
};

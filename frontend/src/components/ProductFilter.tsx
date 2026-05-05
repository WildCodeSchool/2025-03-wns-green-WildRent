import { useState } from "react";
import type { ActiveFilters, FilterCounts } from "../types/filters";
import { emptyFilters } from "../types/filters";
import { COLOR_CLASS_MAP } from "../constants/colors";

type ProductFilterProps = {
    onApply: (filters: ActiveFilters) => void;
    onReset: () => void;
    counts: FilterCounts;
};

type SectionKey = "genders" | "sizes" | "colors" | "brands" | "price";

/** Section accordion réutilisable */
function FilterSection({ title, isOpen, onToggle, children }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <button
                onClick={onToggle}
                className="flex items-center justify-between border-b border-[var(--kaki)] pb-2 cursor-pointer"
            >
                <h2 className="text-[var(--beige)] text-xl font-[family-name:var(--font-title)]">{title}</h2>
                <span className="text-[var(--beige)] text-xl font-bold">
                    {isOpen ? "−" : "+"}
                </span>
            </button>
            <div className={`flex flex-col gap-2 mx-3 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 mt-3 opacity-100" : "max-h-0 opacity-0"}`}>
                {children}
            </div>
        </div>
    );
}

/** Ligne checkbox */
function FilterCheckbox({ label, count, checked, onChange, colorDot }: {
    label: string;
    count: number;
    checked: boolean;
    onChange: () => void;
    colorDot?: string;
}) {
    const checkboxId = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-3 items-center">
                <input id={checkboxId} type="checkbox" checked={checked} onChange={onChange} />
                {colorDot && <div className={`w-4 h-4 rounded-full ${colorDot}`} aria-hidden="true"></div>}
                <label htmlFor={checkboxId} className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)] cursor-pointer">{label}</label>
            </div>
            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]" aria-hidden="true">{count}</p>
        </div>
    );
}

export const ProductFilter = ({ onApply, onReset, counts }: ProductFilterProps) => {
    const [pending, setPending] = useState<ActiveFilters>(emptyFilters);
    const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set());
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSection = (section: SectionKey) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            next.has(section) ? next.delete(section) : next.add(section);
            return next;
        });
    };

    const toggleFilter = (key: keyof Omit<ActiveFilters, "priceMin" | "priceMax">, value: string) => {
        setPending((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((v) => v !== value)
                : [...prev[key], value],
        }));
    };

    const handleReset = () => {
        setPending(emptyFilters);
        onReset();
    };

    const handleApply = () => {
        onApply(pending);
        setMobileOpen(false);
    };

    const genderEntries = Object.entries(counts.genders).sort((a, b) => b[1] - a[1]);
    const sizeEntries = Object.entries(counts.sizes).sort((a, b) => b[1] - a[1]);
    const colorEntries = Object.entries(counts.colors).sort((a, b) => b[1] - a[1]);
    const brandEntries = Object.entries(counts.brands).sort((a, b) => b[1] - a[1]);

    const hasFilters = !Object.values(pending).every((v) => Array.isArray(v) ? v.length === 0 : v === undefined);

    const filterContent = (
        <div className="flex flex-col gap-4">
            {genderEntries.length > 0 && (
                <FilterSection title="Genre" isOpen={openSections.has("genders")} onToggle={() => toggleSection("genders")}>
                    {genderEntries.map(([gender, count]) => (
                        <FilterCheckbox key={gender} label={gender} count={count} checked={pending.genders.includes(gender)} onChange={() => toggleFilter("genders", gender)} />
                    ))}
                </FilterSection>
            )}

            {sizeEntries.length > 0 && (
                <FilterSection title="Taille" isOpen={openSections.has("sizes")} onToggle={() => toggleSection("sizes")}>
                    {sizeEntries.map(([size, count]) => (
                        <FilterCheckbox key={size} label={size} count={count} checked={pending.sizes.includes(size)} onChange={() => toggleFilter("sizes", size)} />
                    ))}
                </FilterSection>
            )}

            {colorEntries.length > 0 && (
                <FilterSection title="Couleur" isOpen={openSections.has("colors")} onToggle={() => toggleSection("colors")}>
                    {colorEntries.map(([color, count]) => (
                        <FilterCheckbox key={color} label={color} count={count} checked={pending.colors.includes(color)} onChange={() => toggleFilter("colors", color)} colorDot={COLOR_CLASS_MAP[color] ?? "bg-gray-300"} />
                    ))}
                </FilterSection>
            )}

            {brandEntries.length > 0 && (
                <FilterSection title="Marque" isOpen={openSections.has("brands")} onToggle={() => toggleSection("brands")}>
                    {brandEntries.map(([brand, count]) => (
                        <FilterCheckbox key={brand} label={brand} count={count} checked={pending.brands.includes(brand)} onChange={() => toggleFilter("brands", brand)} />
                    ))}
                </FilterSection>
            )}

            <FilterSection title="Prix" isOpen={openSections.has("price")} onToggle={() => toggleSection("price")}>
                <div className="flex flex-row gap-6 justify-center items-center">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="filter-price-min" className="text-[var(--beige)] text-xs font-[family-name:var(--font-text)]">Min (€)</label>
                        <input
                            id="filter-price-min"
                            type="number"
                            min={0}
                            value={pending.priceMin ?? ""}
                            onChange={(e) => setPending((prev) => ({ ...prev, priceMin: e.target.value === "" ? undefined : Number(e.target.value) }))}
                            className="w-20 bg-[var(--beige)] text-[var(--dark-green)] text-sm rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="filter-price-max" className="text-[var(--beige)] text-xs font-[family-name:var(--font-text)]">Max (€)</label>
                        <input
                            id="filter-price-max"
                            type="number"
                            min={0}
                            value={pending.priceMax ?? ""}
                            onChange={(e) => setPending((prev) => ({ ...prev, priceMax: e.target.value === "" ? undefined : Number(e.target.value) }))}
                            className="w-20 bg-[var(--beige)] text-[var(--dark-green)] text-sm rounded px-2 py-1"
                        />
                    </div>
                </div>
            </FilterSection>

            <div className="flex flex-row gap-6 justify-center items-center my-2">
                <button
                    onClick={handleReset}
                    disabled={!hasFilters}
                    className="transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <p className="text-[var(--light-green)] text-sm font-[family-name:var(--font-text)]">Réinitialiser</p>
                </button>
                <button
                    onClick={handleApply}
                    className="bg-[#fdffe9] text-[#31380d] border-2 border-[#87a700] text-xs font-[family-name:var(--font-text)] font-bold px-5 py-2 rounded-full whitespace-nowrap shadow-sm hover:bg-[#87a700] hover:text-[#fdffe9] transition-colors"
                >
                    Appliquer
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:flex lg:flex-col lg:w-1/4 gap-3">
                <h1 className="text-[var(--dark-green)] text-2xl font-[family-name:var(--font-title)]">Filtres</h1>
                <div className="h-full sticky top-2 bg-[var(--dark-green)] rounded-2xl">
                    <div className="m-4">
                        {filterContent}
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden w-full">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--dark-green)] text-[var(--beige)] font-[family-name:var(--font-title)] text-lg py-3 rounded-xl"
                >
                    FILTRES
                    <span className="text-sm">{mobileOpen ? "▲" : "▼"}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="bg-[var(--dark-green)] rounded-b-xl p-4 mt-1">
                        {filterContent}
                    </div>
                </div>
            </div>
        </>
    );
};

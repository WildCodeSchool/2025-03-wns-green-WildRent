import { useState } from "react";
import { useSearchParams } from "react-router";
import type { ActiveFilters } from "../types/filters";
import { emptyFilters } from "../types/filters";
import { ProductFilter } from "../components/ProductFilter";
import { ProductsGrid } from "../components/ProductsGrid";

export const ProductPages = () => {
    const [searchParams] = useSearchParams();
    const raw = searchParams.get("category");
    const categoryId = raw ? Number(raw) : undefined;
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(emptyFilters);

    return(
        <div className="w-full bg-[var(--beige)]">
            <div className="flex flex-row gap-4 p-5">
                    <ProductFilter
                        onApply={setActiveFilters}
                        onReset={() => setActiveFilters(emptyFilters)}
                    />
                    <ProductsGrid activeFilters={activeFilters} categoryId={categoryId} />
            </div>
        </div>
    );
};
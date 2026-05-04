import { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@apollo/client/react";
import type { ActiveFilters, FilterCounts } from "../types/filters";
import { emptyFilters } from "../types/filters";
import { ProductFilter } from "../components/ProductFilter";
import { ProductsGrid } from "../components/ProductsGrid";
import { SEARCH_PRODUCTS } from "../graphql/ProductOperations";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/category.operations";

type ProductType = {
    id: number;
    name: string;
    gender: string;
    brand: string;
    price: number;
    image: string;
    productRef: string;
    discount: number;
    category: { id: number; name: string };
    productVariant: { color: string; size: string }[];
};

type PaginatedProducts = {
    products: ProductType[];
    total: number;
    hasMore: boolean;
};

/**
 * Computes filter counts for each filter dimension, considering all OTHER active filters.
 * The count for "Black" = number of products matching all filters
 * EXCEPT the color filter (so the user sees how many they'd get by adding "Black").
 */
function computeCounts(products: ProductType[], activeFilters: ActiveFilters): FilterCounts {
    const matchesExcept = (product: ProductType, excludeKey: string) => {
        if (excludeKey !== "genders" && activeFilters.genders.length > 0 && !activeFilters.genders.includes(product.gender)) return false;
        if (excludeKey !== "brands" && activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) return false;
        if (excludeKey !== "sizes" && activeFilters.sizes.length > 0 && !product.productVariant.some((v) => activeFilters.sizes.includes(v.size))) return false;
        if (excludeKey !== "colors" && activeFilters.colors.length > 0 && !product.productVariant.some((v) => activeFilters.colors.includes(v.color))) return false;
        if (activeFilters.priceMin !== undefined && product.price < activeFilters.priceMin) return false;
        if (activeFilters.priceMax !== undefined && product.price > activeFilters.priceMax) return false;
        return true;
    };

    const counts: FilterCounts = { genders: {}, brands: {}, sizes: {}, colors: {} };

    for (const product of products) {
        if (matchesExcept(product, "genders")) {
            counts.genders[product.gender] = (counts.genders[product.gender] ?? 0) + 1;
        }
        if (matchesExcept(product, "brands")) {
            counts.brands[product.brand] = (counts.brands[product.brand] ?? 0) + 1;
        }
        if (matchesExcept(product, "sizes")) {
            const uniqueSizes = new Set(product.productVariant.map((v) => v.size));
            uniqueSizes.forEach((size) => {
                counts.sizes[size] = (counts.sizes[size] ?? 0) + 1;
            });
        }
        if (matchesExcept(product, "colors")) {
            const uniqueColors = new Set(product.productVariant.map((v) => v.color));
            uniqueColors.forEach((color) => {
                counts.colors[color] = (counts.colors[color] ?? 0) + 1;
            });
        }
    }

    return counts;
}

export const ProductPages = () => {
    const [searchParams] = useSearchParams();
    const raw = searchParams.get("category");
    const categoryId = raw ? Number(raw) : undefined;
    const searchQuery = searchParams.get("search")?.trim() ?? "";
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(emptyFilters);

    // Server-side search: only when there is a search query and no category
    const { data: searchData } = useQuery<{ searchProducts: PaginatedProducts }>(
        SEARCH_PRODUCTS,
        {
            variables: { data: { query: searchQuery, limit: 100 } },
            skip: !searchQuery || !!categoryId,
        }
    );

    // Category filter: fetch products by category
    const { data: catData } = useQuery<{ getProductsByCategory: ProductType[] }>(
        GET_PRODUCTS_BY_CATEGORY,
        { variables: { categoryId }, skip: !categoryId }
    );

    const products = categoryId
        ? (catData?.getProductsByCategory ?? [])
        : (searchData?.searchProducts.products ?? []);

    // No need for search filtering in computeCounts — the server already filtered by query
    const counts = computeCounts(products, activeFilters);

    return(
        <div className="w-full bg-[var(--beige)]">
            <div className="flex flex-col lg:flex-row gap-4 p-4 lg:p-5">
                <ProductFilter
                    onApply={setActiveFilters}
                    onReset={() => setActiveFilters(emptyFilters)}
                    counts={counts}
                />
                <ProductsGrid
                    activeFilters={activeFilters}
                    categoryId={categoryId}
                />
            </div>
        </div>
    );
};

import { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@apollo/client/react";
import type { ActiveFilters, FilterCounts } from "../types/filters";
import { emptyFilters } from "../types/filters";
import { ProductFilter } from "../components/ProductFilter";
import { ProductsGrid } from "../components/ProductsGrid";
import { GET_ALL_PRODUCTS } from "../graphql/ProductOperations";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/category.operations";

type ProductForCounts = {
    gender: string;
    brand: string;
    productVariant: { color: string; size: string }[];
};

export const ProductPages = () => {
    const [searchParams] = useSearchParams();
    const raw = searchParams.get("category");
    const categoryId = raw ? Number(raw) : undefined;
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(emptyFilters);

    const { data: allData } = useQuery<{ getAllProducts: ProductForCounts[] }>(
        GET_ALL_PRODUCTS,
        { skip: !!categoryId }
    );
    const { data: catData } = useQuery<{ getProductsByCategory: ProductForCounts[] }>(
        GET_PRODUCTS_BY_CATEGORY,
        { variables: { categoryId }, skip: !categoryId }
    );

    const products = categoryId
        ? (catData?.getProductsByCategory ?? [])
        : (allData?.getAllProducts ?? []);

    const counts: FilterCounts = products.reduce(
        (acc, product) => {
            acc.genders[product.gender] = (acc.genders[product.gender] ?? 0) + 1;
            acc.brands[product.brand] = (acc.brands[product.brand] ?? 0) + 1;
            const uniqueSizes = new Set(product.productVariant.map((v) => v.size));
            const uniqueColors = new Set(product.productVariant.map((v) => v.color));
            uniqueSizes.forEach((size) => {
                acc.sizes[size] = (acc.sizes[size] ?? 0) + 1;
            });
            uniqueColors.forEach((color) => {
                acc.colors[color] = (acc.colors[color] ?? 0) + 1;
            });
            return acc;
        },
        { genders: {}, brands: {}, sizes: {}, colors: {} } as FilterCounts
    );

    return(
        <div className="w-full bg-[var(--beige)]">
            <div className="flex flex-row gap-4 p-5">
                    <ProductFilter
                        onApply={setActiveFilters}
                        onReset={() => setActiveFilters(emptyFilters)}
                        counts={counts}
                    />
                    <ProductsGrid activeFilters={activeFilters} categoryId={categoryId} />
            </div>
        </div>
    );
};
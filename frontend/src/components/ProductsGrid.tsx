import { Link, useSearchParams } from "react-router";
import { useQuery } from "@apollo/client/react";
import { ProductCard } from "./ProductCard";
import { SEARCH_PRODUCTS } from "../graphql/ProductOperations";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/category.operations";
import type { ActiveFilters } from "../types/filters";

type ProductType = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    gender: string;
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

type Props = {
    activeFilters: ActiveFilters;
    categoryId?: number;
};

export const ProductsGrid = ({ activeFilters, categoryId }: Props) => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search")?.trim() ?? "";

    // Server-side search: only when there is a search query and no category
    const { data: searchData, loading: searchLoading, error: searchError } = useQuery<{ searchProducts: PaginatedProducts }>(
        SEARCH_PRODUCTS,
        {
            variables: { data: { query: searchQuery, limit: 100 } },
            skip: !searchQuery || !!categoryId,
        }
    );

    // Category filter: fetch products by category
    const { data: catData, loading: catLoading, error: catError } = useQuery<{ getProductsByCategory: ProductType[] }>(
        GET_PRODUCTS_BY_CATEGORY,
        { variables: { categoryId }, skip: !categoryId }
    );

    const loading = searchLoading || catLoading;
    const error = searchError || catError;

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement des produits</p>;

    const products = categoryId
        ? (catData?.getProductsByCategory ?? [])
        : (searchData?.searchProducts.products ?? []);

    // Client-side filtering for checkboxes & price (search is already done server-side)
    const filtered = products.filter((product) => {
        if (activeFilters.genders.length > 0 && !activeFilters.genders.includes(product.gender)) return false;
        if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) return false;
        if (activeFilters.sizes.length > 0 && !product.productVariant.some((v) => activeFilters.sizes.includes(v.size))) return false;
        if (activeFilters.colors.length > 0 && !product.productVariant.some((v) => activeFilters.colors.includes(v.color))) return false;
        if (activeFilters.priceMin !== undefined && product.price < activeFilters.priceMin) return false;
        if (activeFilters.priceMax !== undefined && product.price > activeFilters.priceMax) return false;
        return true;
    });

    return(
        <div className="w-full">
            <h1 className="hidden lg:block text-[var(--dark-green)] text-2xl font-[family-name:var(--font-title)] mb-1">Découvrez la sélection de produits</h1>
            <p className="text-[var(--dark-green)] font-[family-name:var(--font-text)] text-sm mb-3">
                <strong>{filtered.length}</strong> {filtered.length > 1 ? "produits disponibles" : "produit disponible"}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {filtered.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                        <ProductCard title={product.name} brand={product.brand} price={product.price} discount={product.discount} image={product.image}/>
                    </Link>
                ))}
            </div>
        </div>
    );
};

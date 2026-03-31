import { Link } from "react-router";
import { useQuery } from "@apollo/client/react";
import { ProductCard } from "./ProductCard";
import { GET_ALL_PRODUCTS } from "../graphql/ProductOperations";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/category.operations";
import type { ActiveFilters } from "../types/filters";

type ProductType = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    gender: string;
    productVariant: { color: string; size: string }[];
};

type Props = {
    activeFilters: ActiveFilters;
    categoryId?: number;
};

export const ProductsGrid = ({ activeFilters, categoryId }: Props) => {
    const { data: allData, loading: allLoading, error: allError } = useQuery<{ getAllProducts: ProductType[] }>(
        GET_ALL_PRODUCTS,
        { skip: !!categoryId }
    );
    const { data: catData, loading: catLoading, error: catError } = useQuery<{ getProductsByCategory: ProductType[] }>(
        GET_PRODUCTS_BY_CATEGORY,
        { variables: { categoryId }, skip: !categoryId }
    );

    const loading = allLoading || catLoading;
    const error = allError || catError;

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement des produits</p>;

    const products = categoryId
        ? (catData?.getProductsByCategory ?? [])
        : (allData?.getAllProducts ?? []);

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
            <div className="grid grid-cols-4 gap-3">
                {filtered.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                        <ProductCard title={product.name} brand={product.brand} price={product.price} image={product.image}/>
                    </Link>
                ))}
            </div>
        </div>
    );
}
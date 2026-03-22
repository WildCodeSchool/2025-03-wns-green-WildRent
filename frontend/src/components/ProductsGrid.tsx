import { Link } from "react-router";
import { useQuery } from "@apollo/client/react";
import { ProductCard } from "./ProductCard";
import { GET_ALL_PRODUCTS } from "../graphql/ProductOperations";
import type { ActiveFilters } from "../types/filters";

type ProductType = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    gender: string;
    category: { id: number; name: string };
    productVariant: { color: string; size: string }[];
};

type Props = {
    activeFilters: ActiveFilters;
    categoryId?: number;
};

export const ProductsGrid = ({ activeFilters, categoryId }: Props) => {
    const { data, loading, error } = useQuery<{ getAllProducts: ProductType[] }>(GET_ALL_PRODUCTS);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement des produits</p>;

    const products = data?.getAllProducts ?? [];

    const filtered = products.filter((product) => {
        if (categoryId && product.category?.id !== categoryId) return false;
        if (activeFilters.genders.length > 0 && !activeFilters.genders.includes(product.gender)) return false;
        if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) return false;
        if (activeFilters.sizes.length > 0 && !product.productVariant.some((v) => activeFilters.sizes.includes(v.size))) return false;
        if (activeFilters.colors.length > 0 && !product.productVariant.some((v) => activeFilters.colors.includes(v.color))) return false;
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
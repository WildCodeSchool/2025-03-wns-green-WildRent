import { useQuery } from "@apollo/client/react";
import { Link } from "react-router";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/category.operations";
import { ProductCard } from "./ProductCard";

type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
};

type Props = {
    categoryId?: number;
};

export const ProductsGrid = ({ categoryId }: Props) => {
    const { data, loading, error } = useQuery<{ getProductsByCategory: Product[] }>(
        GET_PRODUCTS_BY_CATEGORY,
        {
            variables: { categoryId },
            skip: !categoryId,
        }
    );

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement des produits.</p>;

    const products = data?.getProductsByCategory ?? [];

    return(
        <div className="w-full">
            <div className="grid grid-cols-4 gap-3">
                {products.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                        <ProductCard title={product.name} brand={product.brand} price={product.price} image={product.image}/>
                    </Link>
                ))}
            </div>
        </div>
    )
}
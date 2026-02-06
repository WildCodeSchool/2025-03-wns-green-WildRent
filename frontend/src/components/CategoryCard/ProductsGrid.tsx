import { Link } from "react-router";
import { ProductCard } from "./ProductCard";

type Product = {
    title: string; 
    brand: string; 
    image: string; 
    price: number; 
};

const products: Product[] = [
    { title: "Bâton de ski", brand: "Rossignol", image: "/images/baton.png", price: 10 },
    { title: "Chaussure de ski", brand: "Lange", image: "/images/boot1.png", price: 18 },
    { title: "Chaussure de ski", brand: "Rossignol", image: "/images/boot2.png", price: 18 },
    { title: "Ski", brand: "Rossignol", image: "/images/ski.png", price: 35 },
    { title: "Planche de snowboard", brand: "Rossignol", image: "/images/snow1.png", price: 31 },
    { title: "Planche de snowboard", brand: "Burton", image: "/images/snow2.png", price: 31 },
    { title: "Bâton de ski", brand: "Rossignol", image: "/images/baton.png", price: 10 },
    { title: "Chaussure de ski", brand: "Lange", image: "/images/boot1.png", price: 18 },
    { title: "Chaussure de ski", brand: "Rossignol", image: "/images/boot2.png", price: 18 },
    { title: "Ski", brand: "Rossignol", image: "/images/ski.png", price: 35 },
    { title: "K2000", brand: "Rossignol", image: "/images/snow1.png", price: 31 },
    { title: "Planche de snowboard", brand: "Burton", image: "/images/snow2.png", price: 31 }
];

export const ProductsGrid = () => {
    return(
        <div className="w-full">
            <div className="grid grid-cols-4 gap-3">
                {products.map((product) => (
                    <Link to="/products/product">
                        <ProductCard title={product.title} brand={product.brand} price={product.price} image={product.image}/>
                    </Link>
                ))}
            </div>
        </div>
    )
}
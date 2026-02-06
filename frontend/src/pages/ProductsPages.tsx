import { ProductFilter } from "../components/CategoryCard/ProductFilter";
import { ProductsGrid } from "../components/CategoryCard/ProductsGrid";

export const ProductPages = () => {
    return(
        <div className="w-full bg-[var(--beige)]">
            <div className="flex flex-row gap-4 p-5">
                    <ProductFilter/>
                    <ProductsGrid/>
            </div>
        </div>
    );
};
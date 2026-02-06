import { ProductFilter } from "../components/ProductFilter";
import { ProductsGrid } from "../components/ProductsGrid";


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
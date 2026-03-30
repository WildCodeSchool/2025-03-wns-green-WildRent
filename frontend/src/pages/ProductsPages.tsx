import { useSearchParams } from "react-router";
import { ProductFilter } from "../components/ProductFilter";
import { ProductsGrid } from "../components/ProductsGrid";


export const ProductPages = () => {
    const [searchParams] = useSearchParams();
    const raw = searchParams.get("category");
    const categoryId = raw ? Number(raw) : undefined;

    return(
        <div className="w-full bg-[var(--beige)]">
            <div className="flex flex-row gap-4 p-5">
                    <ProductFilter/>
                    <ProductsGrid categoryId={categoryId}/>
            </div>
        </div>
    );
};
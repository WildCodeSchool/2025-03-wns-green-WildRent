import { formatPrice } from "../utils/formatPrice";
import { calculateDiscountedPrice } from "../utils/calculateDiscountedPrice";

type ProductCardProps = {
    title: string;
    brand: string;
    price: number;
    discount: number;
    image: string;
};

export const ProductCard = ({ title, brand, price, discount, image }: ProductCardProps) => {
    const hasDiscount = discount > 0;
    const discountedPrice = calculateDiscountedPrice(price, discount);

    return (
        <div className="w-auto bg-white">
            <img src={image} alt="" className="w-full border-x-1 border-t-1 rounded-t-2xl border-[#87a700]" />
            <div className="w-full px-5 py-3 rounded-b-2xl bg-[#31380d]">
                <div className="mb-5">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-[#87a700] font-[family-name:var(--font-text)]"><strong>{title}</strong></h1>
                        {hasDiscount && (
                            <span className="text-[10px] font-bold font-[family-name:var(--font-text)] text-white bg-[#87a700] px-2 py-0.5 rounded-full">
                                -{discount}%
                            </span>
                        )}
                    </div>
                    <h2 className="text-[#fdffe9] font-[family-name:var(--font-text)]">{brand}</h2>
                </div>
                <div className="flex flex-row justify-between items-end">
                    <p className="text-[#acaf91] font-[family-name:var(--font-text)]">Prix par jour</p>
                    {hasDiscount ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[#87a700] font-[family-name:var(--font-text)]">
                                <strong>{formatPrice(discountedPrice)}€</strong>
                            </span>
                            <span className="relative text-xs text-[#acaf91] font-[family-name:var(--font-text)]">
                                {formatPrice(price)}€
                                <span className="absolute left-0 top-1/2 w-full h-[2px] bg-red-500 -rotate-12" />
                            </span>
                        </div>
                    ) : (
                        <p className="text-[#87a700] font-[family-name:var(--font-text)]"><strong>{formatPrice(price)}€</strong></p>
                    )}
                </div>
            </div>
        </div>
    )
}

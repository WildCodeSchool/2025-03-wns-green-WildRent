type ProductCardProps = {
    title: string; 
    brand: string; 
    price: number;
    image: string; 
};

export const ProductCard = ({ title, brand, price, image }: ProductCardProps) => {
    return(
        <div className="w-auto bg-white">
                <img src={image} alt="" className="w-full border-x-1 border-t-1 rounded-t-2xl border-[#87a700]"/>
                <div className="w-full px-5 py-3 rounded-b-2xl bg-[#31380d]">
                    <div className="mb-5">
                        <h1 className="text-[#87a700] font-[family-name:var(--font-text)]"><strong>{title}</strong></h1>
                        <h2 className="text-[#fdffe9] font-[family-name:var(--font-text)]">{brand}</h2>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className="text-[#acaf91] font-[family-name:var(--font-text)]">Prix par jour</p>
                        <p className="text-[#87a700] font-[family-name:var(--font-text)]"><strong>{price}€</strong></p>
                    </div>
                </div>
        </div>
    )
}
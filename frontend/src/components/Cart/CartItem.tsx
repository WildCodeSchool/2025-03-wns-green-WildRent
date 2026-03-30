import { useQuery } from "@apollo/client/react";
import { useCart } from "../../context/CartContext";
import { GET_PRODUCT_VARIANT_STOCK } from "../../graphql/ProductVariantOperations";

type CartItemProps = {
  productId: number;
  variantId: number; 
  productName: string;
  productRef: string;
  image: string;
  price: number;
  color: string;
  size: string;
  startDate: string;
  endDate: string;
  quantity: number;
};

export default function CartItem({ variantId, productName, productRef, image, price, color, size, startDate, endDate, quantity,
}: Readonly<CartItemProps>) {
  const { removeItem, updateQuantity } = useCart();

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));


  const { data } = useQuery<{ getProductVariantById: { id: number; quantity: number } }>(
    GET_PRODUCT_VARIANT_STOCK,
    { variables: { id: variantId } }
  );

  const stock = data?.getProductVariantById?.quantity ?? 0;
  const isMaxStock = quantity >= stock; 

  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--dark-green)] rounded-xl text-white">
      
      <img src={image} alt="snowboard" className="h-20 w-20 object-contain bg-white rounded-lg p-1" />

      <div className="flex-1">
        <p className="font-bold font-[family-name:var(--font-title)]">{productName}</p>
        <p className="text-xs text-[var(--light-green)]">Ref : {productRef}</p>
        <p className="text-xs">Couleur : {color}</p>
        <p className="text-xs">Taille : {size}</p>
        <p className="text-xs">Début de location : {startDate}</p>
        <p className="text-xs">Fin de location : {endDate}</p>
        
    
        {isMaxStock && (
          <p className="text-red-400 text-xs mt-1">
            Stock maximum atteint ({stock} disponible{stock > 1 ? "s" : ""})
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(variantId, quantity - 1)}
          disabled={quantity <= 1}
          className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold cursor-pointer disabled:opacity-50"
        >
          -
        </button>
        <button className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold">
          {quantity}
        </button>
        <button
          onClick={() => updateQuantity(variantId, quantity + 1)}
          disabled={isMaxStock} 
          className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold cursor-pointer disabled:opacity-50"
        >
          +
        </button>
      </div>

      <p className="font-bold text-[var(--light-green)] w-16 text-right"> {price * quantity * days}€ </p>

      <button
        onClick={() => removeItem(variantId)}
        className="text-red-400 text-sm cursor-pointer"
      >
        Supprimer
      </button>

    </div>
  );
}
import { useCart } from "../../context/CartContext";

type CartItemProps = {
  productId: number;
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

export default function CartItem({
  productId,
  productName,
	productRef,
  image,
  price,
  color,
  size,
  startDate,
  endDate,
  quantity,
}: Readonly<CartItemProps>) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--dark-green)] rounded-xl text-white">
      
      <img src={image} alt= "snowboard" className="h-20 w-20 object-contain bg-white rounded-lg p-1" />

      <div className="flex-1">
        <p className="font-bold font-[family-name:var(--font-title)]">{productName}</p>
				<p className="text-xs text-[var(--light-green)] ">Ref : {productRef}</p>
        <p className="text-xs  [family-name:var(--font-title)]">Couleur : {color}</p>
				<p className="text-xs t[family-name:var(--font-title)]">Taille : {size}</p>
        <p className="text-xs [family-name:var(--font-title)]">Début de location : {startDate} </p>
				<p className="text-xs [family-name:var(--font-title)]">Fin de location : {endDate}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(productId, quantity - 1)}
          disabled={quantity <= 1}
          className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold cursor-pointer"
        >
          -
        </button>
        <button className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold ">{quantity}</button>
        <button
          onClick={() => updateQuantity(productId, quantity + 1)}
          className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold cursor-pointer"
        >
          +
        </button>
      </div>

      <p className="font-bold text-[var(--light-green)] w-16 text-right">{price * quantity}€</p>

      <button
        onClick={() => removeItem(productId)}
        className="text-red-400 text-sm cursor-pointer"
      >
        Supprimer
      </button>

    </div>
  );
}
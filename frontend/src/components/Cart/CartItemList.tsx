import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";

export default function CartItemList() {
  const { items } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col gap-3">
      
      <div className="rounded-xl bg-[var(--dark-green)] p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">Mon Panier</h1>
        <p className="text-sm text-[var(--light-green)]">Les articles seront réservés pendant 60 minutes</p>
      </div>

 
      {items.length === 0 ? (
        <div className="rounded-xl bg-[var(--dark-green)] p-6">
          <p className="text-white text-center py-8">Votre panier est vide</p>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.color}-${item.size}`} {...item} />
          ))}
        </>
      )}


      <div className="rounded-xl bg-[var(--dark-green)] p-6 flex justify-end">
        <p className="text-white font-bold text-xl">Total : <span className="text-[var(--light-green)]">{total}€</span></p>
      </div>

    </div>
  );
}
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";

export default function CartItemList() {
  const { items } = useCart();
  const total = items.reduce((sum, item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return sum + item.price * item.quantity * days;
  }, 0);

  return (
    <div className="flex flex-col gap-3">
      
      <div className="rounded-xl bg-[var(--dark-green)] p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">Mon Panier</h1>
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
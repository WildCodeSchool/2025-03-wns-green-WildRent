import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import { calculateItemTotal } from "../../utils/calculateItemTotal";
import { formatPrice } from "../../utils/formatPrice";

export default function CartItemList() {
  const { items, loading } = useCart();
  const total = items.reduce((sum, item) => {
    return sum + calculateItemTotal(item.price, item.quantity, item.startDate, item.endDate, item.discount);
  }, 0);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-xl bg-[var(--dark-green)] p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">Mon Panier</h1>
        </div>
        <div className="rounded-xl bg-[var(--dark-green)] p-6">
          <p className="text-white text-center py-8">Chargement...</p>
        </div>
      </div>
    );
  }

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
            <CartItem key={item.bookingProductId} {...item} />
          ))}
        </>
      )}

      <div className="rounded-xl bg-[var(--dark-green)] p-6 flex justify-end">
        <p className="text-white font-bold text-xl">Total : <span className="text-[var(--light-green)]">{formatPrice(total)}€</span></p>
      </div>

    </div>
  );
}
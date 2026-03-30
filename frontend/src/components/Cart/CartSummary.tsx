import { useCart } from "../../context/CartContext";

export default function CartSummary() {
  const { items } = useCart();

  const total = items.reduce((sum, item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return sum + item.price * item.quantity * days;
  }, 0);

  return (
    <div className="rounded-xl border p-6 bg-[var(--dark-green)]">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-title)] uppercase text-white">Récapitulatif</h2>
      
      <div className="mt-4 rounded-xl bg-[var(--dark-green)] p-4">
        <p className="text-[var(--light-green)] font-bold text-lg">Total : {total}€</p>
      </div>

      <button className="mt-4 w-full rounded-xl py-4 font-bold bg-white border-2 border-[var(--dark-green)] text-[var(--dark-green)] cursor-pointer">
        Paiement
      </button>
    </div>
  );
}
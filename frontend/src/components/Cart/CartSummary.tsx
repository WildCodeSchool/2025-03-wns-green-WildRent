import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";
import { calculateItemTotal } from "../../utils/calculateItemTotal";

export default function CartSummary() {
  const { items } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => {
    return sum + calculateItemTotal(item.price, item.quantity, item.startDate, item.endDate);
  }, 0);

  return (
    <div className="rounded-xl border p-6 bg-[var(--dark-green)]">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-title)] uppercase text-white">Récapitulatif</h2>
      
      <div className="mt-4 rounded-xl bg-[var(--dark-green)] p-4">
        <p className="text-[var(--light-green)] font-bold text-lg">Total : {total}€</p>
      </div>

      <button 
        onClick={() => navigate("/payment")}
        disabled={items.length === 0}
        className="mt-4 w-full rounded-xl py-4 font-bold bg-white border-2 border-[var(--dark-green)] text-[var(--dark-green)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
         Paiement
      </button>
    </div>
  );
}
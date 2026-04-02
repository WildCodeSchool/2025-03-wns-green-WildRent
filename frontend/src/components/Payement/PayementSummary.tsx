import { useCart } from "../../context/CartContext";

export default function PaymentSummary() {
  const { items } = useCart();

  const total = items.reduce((sum, item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return sum + item.price * item.quantity * days;
  }, 0);

  return (
    <div className="rounded-2xl bg-[var(--dark-green)] text-white overflow-hidden">
      <div className="border-b border-white/20 px-6 py-5">
        <h2 className="text-3xl font-bold uppercase font-[family-name:var(--font-title)] text-[var(--beige)] ">
          Récapitulatif
        </h2>
      </div>

      <div className="p-6">
        <p className="text-[var(--light-green)] font-bold text-2xl">
          Total : {total}€
        </p>

        <p className="mt-6 text-base leading-8 text-[var(--beige)] ">
          En cliquant sur Payer, j’accepte les conditions générales de Wild Rent
        </p>

        <button className="mt-8 w-full rounded-full bg-[var(--beige)] py-4 text-xl font-bold text-[var(--dark-green)] cursor-pointer">
          Payer
        </button>
      </div>
    </div>
  );
}
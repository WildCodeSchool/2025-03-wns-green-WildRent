import { useCart } from "../../context/CartContext";
import { calculateDays } from "../../utils/calculateDays";

type PaymentSummaryProps = {
  onPayment: () => void;
  loading: boolean;
  disabled: boolean;
  billingComplete?: boolean;
};

export default function PaymentSummary({ onPayment, loading, disabled, billingComplete = true }: Readonly<PaymentSummaryProps>) {
  const { items } = useCart();

  const total = items.reduce((sum, item) => {
    const days = calculateDays(item.startDate, item.endDate);
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
          En cliquant sur Payer, j'accepte les conditions générales de Wild Rent
        </p>

        <button
          onClick={onPayment}
          disabled={loading || disabled}
          className="mt-8 w-full rounded-full bg-[var(--beige)] py-4 text-xl font-bold text-[var(--dark-green)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Traitement..." : "Payer"}
        </button>

        {disabled && !loading && (
          <p className="mt-3 text-center text-sm text-red-300">
            {!billingComplete
              ? "Veuillez compléter votre adresse de facturation"
              : "Veuillez remplir tous les champs de paiement"}
          </p>
        )}
      </div>
    </div>
  );
}
import PaymentForm from "../components/Payement/PayementForm";
import PaymentSummary from "../components/Payement/PayementSummary";
import BillingAddress from "../components/Payement/BillingAdress";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { handleGraphQLError } from "../utils/handleGraphQLError";
import { calculateItemTotal } from "../utils/calculateItemTotal";

export function PaymentPage() {

  const { items, validateCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isBillingValid, setIsBillingValid] = useState(false);

  function calculateTotal() {
    return items.reduce((sum, item) => {
      return sum + calculateItemTotal(item.price, item.quantity, item.startDate, item.endDate);
    }, 0);
  }

  async function handlePayment() {
    if (!isBillingValid || !isFormValid) return;
    setLoading(true);

    try {
      const validatedBookings = await validateCart();

      navigate("/confirmation", {
        state: {
          bookingIds: validatedBookings.map((b) => b.id),
          items: items.map((item) => ({
            productName: item.productName,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            startDate: item.startDate,
            endDate: item.endDate,
            image: item.image,
          })),
          total: calculateTotal(),
        }
      });

    } catch (err: unknown) {
      handleGraphQLError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentForm onValidityChange={setIsFormValid} />
        </div>

        <div className="flex flex-col gap-8">
          <PaymentSummary
            onPayment={handlePayment}
            loading={loading}
            disabled={!isFormValid || !isBillingValid}
            billingComplete={isBillingValid}
          />
          <BillingAddress onValidityChange={setIsBillingValid} />
        </div>
      </div>
    </div>
  );
}
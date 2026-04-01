import PaymentForm from "../components/Payement/PayementForm";
import PaymentSummary from "../components/Payement/PayementSummary";
import BillingAddress from "../components/Payement/BillingAdress";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { CREATE_BOOKING, CREATE_BOOKING_PRODUCT } from "../graphql/booking.operations";

export function PaymentPage() {

  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [createBooking] = useMutation(CREATE_BOOKING);
  const [createBookingProduct] = useMutation(CREATE_BOOKING_PRODUCT);


  function groupItemsByDates() {
    const groups: Record<string, typeof items> = {};

    for (const item of items) {
      const key = `${item.startDate}-${item.endDate}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);
    }

    return groups;
  }

  function calculateTotal() {
    let total = 0;

    for (const item of items) {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      total += item.price * item.quantity * days;
    }

    return total;
  }

  async function handlePayment() {
    setError("");
    setLoading(true);

    try {
      const groups = groupItemsByDates();
      const bookingIds: number[] = [];

      for (const group of Object.values(groups)) {

        const res = await createBooking({
          variables: {
            data: {
              startDate: new Date(group[0].startDate).toISOString(),
              endDate: new Date(group[0].endDate).toISOString(),
            }
          }
        });

        const newBookingId = (res.data as { createBooking: { id: number } }).createBooking.id;
        bookingIds.push(newBookingId);

        for (const item of group) {
          await createBookingProduct({
            variables: {
              data: {
                bookingId: Number(newBookingId),
                productId: item.productId,
                productQuantity: item.quantity,
              }
            }
          });
        }
      }

      clearCart();

      navigate("/confirmation", {
        state: {
          bookingIds: bookingIds,
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

    } catch (err) {
      setError("Une erreur est survenue lors du paiement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentForm />
        </div>

        <div className="flex flex-col gap-8">
          <PaymentSummary onPayment={handlePayment} loading={loading} />
          <BillingAddress />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
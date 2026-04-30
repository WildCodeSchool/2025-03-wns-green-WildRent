import PaymentForm from "../components/Payement/PayementForm";
import PaymentSummary from "../components/Payement/PayementSummary";
import BillingAddress from "../components/Payement/BillingAdress";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { CREATE_BOOKING, CREATE_BOOKING_PRODUCT, DELETE_BOOKING } from "../graphql/booking.operations";
import { handleGraphQLError } from "../utils/handleGraphQLError";

export function PaymentPage() {

  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [createBooking] = useMutation(CREATE_BOOKING, {
    refetchQueries: ["GetMyBookings"],
  });
  const [createBookingProduct] = useMutation(CREATE_BOOKING_PRODUCT);
  const [deleteBooking] = useMutation(DELETE_BOOKING);


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

        try {
          for (const item of group) {
            await createBookingProduct({
              variables: {
                data: {
                  bookingId: Number(newBookingId),
                  productVariantId: item.variantId,
                  productQuantity: item.quantity,
                }
              }
            });
          }
        } catch (innerErr) {
          await deleteBooking({ variables: { id: newBookingId } });
          bookingIds.pop();
          throw innerErr;
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

    } catch (err: any) {
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
            disabled={!isFormValid}
          />
          <BillingAddress />
        </div>
      </div>
    </div>
  );
}
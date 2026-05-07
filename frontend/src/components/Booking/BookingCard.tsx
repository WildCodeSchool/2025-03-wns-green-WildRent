import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { UPDATE_BOOKING } from "../../graphql/booking.operations";
import { handleGraphQLError } from "../../utils/handleGraphQLError";
import { ConfirmModal } from "./ConfirmModal";
import { formatDate } from "../../utils/formatDate";
import { calculateItemTotal } from "../../utils/calculateItemTotal";
import { formatPrice } from "../../utils/formatPrice";
import { calculateDiscountedPrice } from "../../utils/calculateDiscountedPrice";
import { getEffectiveDiscount } from "../../utils/getEffectiveDiscount";

export type Booking = {
  id: string;
  bookingRef: number;
  totalPrice: number | null;
  startDate: string;
  endDate: string;
  status: {
    statusName: string;
  };
  bookingsProducts: {
    productQuantity: number;
    productVariant: {
      id: number;
      color: string;
      size: string;
      image: string;
      discount: number;
      product: {
        id: number;
        name: string;
        productRef: string;
        price: number;
        brand: string;
        image: string;
        discount: number;
      };
    };
  }[];
};

export type Status = {
  id: number;
  statusName: string;
};

function calculateBookingTotal(booking: Booking): number {
  if (booking.totalPrice !== null) return booking.totalPrice;

  return booking.bookingsProducts.reduce((sum, bp) => {
    const discount = getEffectiveDiscount(bp.productVariant.product.discount, bp.productVariant.discount);
    return sum + calculateItemTotal(
      bp.productVariant.product.price,
      bp.productQuantity,
      booking.startDate,
      booking.endDate,
      discount
    );
  }, 0);
}

type BookingCardProps = {
  booking: Booking;
  statuses: Status[];
  onUpdate: () => void;
};

export const BookingCard = ({ booking, statuses, onUpdate }: BookingCardProps) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [updateBooking, { loading }] = useMutation(UPDATE_BOOKING);

  const today = new Date().toISOString().slice(0, 10);
  const isCancellable = booking.status.statusName === "À préparer" && booking.startDate.slice(0, 10) >= today;

  const handleConfirmCancel = async () => {
    setShowCancelModal(false);

    const cancelStatus = statuses.find((s) => s.statusName === "Annulée");
    if (!cancelStatus) {
      toast.error("Le statut Annulée n'a pas été trouvé");
      return;
    }

    try {
      await updateBooking({
        variables: {
          id: booking.id,
          data: { statusId: Number(cancelStatus.id) },
        },
      });
      toast.success("Réservation annulée avec succès");
      onUpdate();
    } catch (err: unknown) {
      handleGraphQLError(err);
    }
  };

  return (
    <div className="w-full border border-[#87a700] rounded-2xl bg-white p-5 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-title)] text-[#31380d] uppercase tracking-wide">
            Commande #{booking.bookingRef}
          </h3>
          <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mt-1">
            Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}
          </p>
        </div>
        <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium font-[family-name:var(--font-text)] ${
          booking.status.statusName === "Annulée"
            ? "bg-red-200 text-red-800"
            : "bg-[#87a700] text-[#fdffe9]"
        }`}>
          {booking.status.statusName}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {booking.bookingsProducts.map((bp, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
             src={bp.productVariant.image || bp.productVariant.product.image}
             alt={bp.productVariant.product.name}
             className="h-16 w-16 object-contain bg-[#fdffe9] rounded-lg p-1 border border-[#acaf91]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">
                  {bp.productVariant.product.brand} {bp.productVariant.product.name}
                </p>
                {getEffectiveDiscount(bp.productVariant.product.discount, bp.productVariant.discount) > 0 && (
                  <span className="text-[10px] font-bold text-white bg-[#87a700] px-2 py-0.5 rounded-full">
                    -{getEffectiveDiscount(bp.productVariant.product.discount, bp.productVariant.discount)}%
                  </span>
                )}
              </div>
              <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mt-1">
                Réf : {bp.productVariant.product.productRef}
              </p>
              <p className="text-xs font-[family-name:var(--font-text)] text-[#31380d] mt-1">
                Couleur : {bp.productVariant.color} · Taille : {bp.productVariant.size}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91]">
                  Quantité : {bp.productQuantity} × {formatPrice(calculateDiscountedPrice(bp.productVariant.product.price, getEffectiveDiscount(bp.productVariant.product.discount, bp.productVariant.discount)))}€
                </p>
                {getEffectiveDiscount(bp.productVariant.product.discount, bp.productVariant.discount) > 0 && (
                  <span className="relative text-xs text-gray-400 font-[family-name:var(--font-text)]">
                    {formatPrice(bp.productVariant.product.price)}€
                    <span className="absolute left-0 top-1/2 w-full h-[1.5px] bg-red-500 -rotate-12" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">
          Total
        </p>
        <p className="text-lg sm:text-xl font-bold font-[family-name:var(--font-title)] text-[#87a700]">
          {formatPrice(calculateBookingTotal(booking))}€
        </p>
      </div>

      {isCancellable && (
        <div className="mt-5 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={loading}
            className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold cursor-pointer transition-colors disabled:opacity-50"
          >
            Annuler la réservation
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={showCancelModal}
        title="Annuler la réservation"
        message="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action n'est pas réversible."
        confirmLabel="Oui, annuler"
        cancelLabel="Non, garder ma réservation"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};
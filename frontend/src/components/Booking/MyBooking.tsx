import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { 
  GET_MY_BOOKINGS, 
  UPDATE_BOOKING, 
  GET_ALL_STATUS 
} from "../../graphql/booking.operations";
import { handleGraphQLError } from "../../utils/handleGraphQLError";
import { ConfirmModal } from "../../components/Booking/ConfirmModal";

type Booking = {
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
      product: {
        id: number;
        name: string;
        productRef: string;
        price: number;
        brand: string;
      };
    };
  }[];
};

type GetMyBookingsData = {
  getMyBookings: Booking[];
};

type Status = {
  id: number;
  statusName: string;
};

type GetAllStatusData = {
  getAllStatus: Status[];
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calculateBookingTotal(booking: Booking): number {
  if (booking.totalPrice !== null) return booking.totalPrice;

  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return booking.bookingsProducts.reduce((sum, bp) => {
    return sum + bp.productQuantity * bp.productVariant.product.price * days;
  }, 0);
}

/** Carte d'une réservation avec gestion de l'annulation */
const BookingCard = ({ booking, statuses, onUpdate }: { 
  booking: Booking; 
  statuses: Status[];
  onUpdate: () => void;
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [updateBooking, { loading }] = useMutation(UPDATE_BOOKING);

  const isPending = booking.status.statusName === "En attente";

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
    } catch (err: any) {
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
              src={bp.productVariant.image || bp.productVariant.product.name}
              alt={bp.productVariant.product.name}
              className="h-16 w-16 object-contain bg-[#fdffe9] rounded-lg p-1 border border-[#acaf91]"
            />
            <div className="flex-1">
              <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">
                {bp.productVariant.product.brand} {bp.productVariant.product.name}
              </p>
              <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mt-1">
                Réf : {bp.productVariant.product.productRef}
              </p>
              <p className="text-xs font-[family-name:var(--font-text)] text-[#31380d] mt-1">
                Couleur : {bp.productVariant.color} · Taille : {bp.productVariant.size}
              </p>
              <p className="text-xs font-[family-name:var(--font-text)] text-[#acaf91] mt-1">
                Quantité : {bp.productQuantity} × {bp.productVariant.product.price}€
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm font-medium font-[family-name:var(--font-text)] text-[#31380d]">
          Total
        </p>
        <p className="text-lg sm:text-xl font-bold font-[family-name:var(--font-title)] text-[#87a700]">
          {calculateBookingTotal(booking)}€
        </p>
      </div>

      {isPending && (
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

export const MyBookings = () => {
  const { data, loading, error, refetch } = useQuery<GetMyBookingsData>(GET_MY_BOOKINGS);
  const { data: statusData } = useQuery<GetAllStatusData>(GET_ALL_STATUS);

  if (loading) {
    return (
      <div className="w-full border border-[#87a700] rounded-2xl bg-white p-8 text-center">
        <p className="text-sm font-[family-name:var(--font-text)] text-[#acaf91]">
          Chargement de vos commandes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border border-red-300 rounded-2xl bg-red-50 p-8 text-center">
        <p className="text-sm font-[family-name:var(--font-text)] text-red-600">
          Une erreur est survenue lors du chargement de vos commandes.
        </p>
      </div>
    );
  }

  const bookings = data?.getMyBookings ?? [];
  const statuses = statusData?.getAllStatus ?? [];

  if (bookings.length === 0) {
    return (
      <div className="w-full border border-[#87a700] rounded-2xl bg-white p-8 text-center">
        <p className="text-sm font-[family-name:var(--font-text)] text-[#acaf91] italic">
          Vous n'avez pas encore de commande.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          statuses={statuses}
          onUpdate={() => refetch()}
        />
      ))}
    </div>
  );
};
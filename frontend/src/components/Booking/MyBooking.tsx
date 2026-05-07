import { useQuery } from "@apollo/client/react";
import {
  GET_MY_BOOKINGS,
  GET_ALL_STATUS,
} from "../../graphql/booking.operations";
import { BookingCard, type Booking, type Status } from "./BookingCard";

type GetMyBookingsData = {
  getMyBookings: Booking[];
};

type GetAllStatusData = {
  getAllStatus: Status[];
};

export const MyBookings = () => {
  const { data, loading, error, refetch } = useQuery<GetMyBookingsData>(GET_MY_BOOKINGS, {
    fetchPolicy: "cache-and-network",
  });
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
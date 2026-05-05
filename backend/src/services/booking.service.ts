import { Not } from "typeorm";
import { CreateBookingInput, UpdateBookingInput } from "../dtos/booking.dto";
import { Booking } from "../entities/Booking";
import { User } from "../entities/User";
import { StatusService } from "./status.service";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing bookings (reservations).
 * Handles CRUD operations and user-specific booking retrieval.
 */
export class BookingService {
  private readonly statusService = new StatusService();

  /**
   * Retrieves all bookings with their associated status and user.
   * @returns Array of all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    return Booking.find({ relations: ["status", "user"] });
  }

  /**
   * Retrieves a single booking by its ID.
   * @param id - The booking ID
   * @returns The matching booking with status and user relations
   * @throws NotFoundError if no booking exists with the given ID
   */
  async getBookingById(id: number): Promise<Booking> {
    const booking = await Booking.findOne({
      where: { id },
      relations: ["status", "user"],
    });

    if (!booking) {
      throw Errors.notFound("Booking");
    }
    return booking;
  }

  /**
   * Retrieves all confirmed bookings for a given user, excluding cart items (pending bookings).
   * @param userId - The ID of the authenticated user
   * @returns Array of the user's confirmed bookings, ordered by most recent first
   */
  async getMyBookings(userId: number): Promise<Booking[]> {
    const cartStatus = await this.statusService.getStatusByName("En attente");

    return Booking.find({
      where: { user: { id: userId }, status: { id: Not(cartStatus.id) } },
      relations: [
        "status",
        "user",
        "bookingsProducts",
        "bookingsProducts.productVariant",
        "bookingsProducts.productVariant.product",
      ],
      order: { id: "DESC" },
    });
  }

  /**
   * Creates a new booking with a "Pending" status for the given user.
   * @param data - The booking creation input containing start and end dates
   * @param userId - The ID of the user creating the booking
   * @returns The newly created booking
   * @throws BadRequestError if the end date is before the start date
   * @throws NotFoundError if the user does not exist
   */
  async createBooking(data: CreateBookingInput, userId: number): Promise<Booking> {

    if (data.endDate < data.startDate) {
      throw Errors.badRequest("La date de fin ne peut pas être avant la date de début");
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw Errors.notFound("User");

    const booking = Booking.create({
      startDate: data.startDate,
      endDate: data.endDate,
      user,
    });

    const status = await this.statusService.getStatusByName("En attente");
    booking.status = status;

    await booking.save();
    return booking;
  }

  /**
   * Updates an existing booking (dates, status, etc.).
   * Only the booking owner can update, and only pending bookings can be modified.
   * @param id - The booking ID to update
   * @param data - The fields to update, including an optional new status ID
   * @param userId - The ID of the authenticated user performing the update
   * @returns The updated booking
   * @throws NotFoundError if the booking does not exist
   * @throws UnauthorizedError if the user does not own the booking
   * @throws BadRequestError if the booking is not pending or if the end date is not after the start date
   */
  async updateBooking(id: number, data: UpdateBookingInput, userId: number): Promise<Booking> {
    const booking = await Booking.findOne({
      where: { id },
      relations: ["status", "user"],
    });

    if (!booking) {
      throw Errors.notFound("Booking");
    }

    if (booking.user.id !== userId) {
      throw Errors.unauthorized();
    }

    if (booking.status.statusName !== "À préparer") {
      throw Errors.badRequest("Seules les réservations à préparer peuvent être modifiées");
    }

    if (data.statusId) {
      const status = await this.statusService.getStatusById(data.statusId);
      booking.status = status;
    }

    if (data.startDate) booking.startDate = data.startDate;
    if (data.endDate) booking.endDate = data.endDate;

    if (booking.endDate <= booking.startDate) {
      throw Errors.badRequest("La date de fin doit être après la date de début");
    }

    await booking.save();
    return booking;
  }

/**
   * Transitions a booking to a new status. Used by system services 
   * (e.g., CartService) for status changes that don't require user-side 
   * validation.
   * @param bookingId - The booking ID
   * @param newStatusId - The ID of the new status
   * @returns The updated booking
   * @throws NotFoundError if the booking or status does not exist
   */
  async transitionStatus(bookingId: number, newStatusId: number): Promise<Booking> {
   const booking = await this.getBookingById(bookingId);
   const newStatus = await this.statusService.getStatusById(newStatusId);

   booking.status = newStatus;
   await booking.save();
   return booking;
  }

  /**
   * Deletes a booking by its ID.
   * @param id - The booking ID to delete
   * @returns The deleted booking's ID
   * @throws NotFoundError if the booking does not exist
   */
  async deleteBooking(id: number): Promise<number> {
    const booking = await Booking.findOneBy({ id });
    if (!booking) throw Errors.notFound("Booking");

    await Booking.delete({ id });
    return id;
  }
}

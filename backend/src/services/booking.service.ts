import { BookingInput } from "../dtos/booking.dto";
import { Booking } from "../entities/Booking";
import { StatusService } from "./status.service";

export class BookingService {
  private readonly statusService = new StatusService();

  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookings = await Booking.find({
        relations: ["status"],
      });
      return bookings;
    } catch (err) {
      throw new Error(`Error fetching bookings: ${err}`);
    }
  }

  async getBookingById(id: number): Promise<Booking> {
    try {
      const booking = await Booking.findOne({
        where: { id },
        relations: ["status"],
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      return booking;
    } catch (err) {
      throw new Error(`Error fetching booking ${id}: ${err}`);
    }
  }

  async createBooking(data: BookingInput): Promise<Booking> {
    if (!data.endDate <= !data.startDate) {
      throw new Error("End date must be after start date");
    }

    const booking = Booking.create({
      startDate: data.startDate,
      endDate: data.endDate, 
    });

    if (data.status) {
      const status = await this.statusService.getStatusById(data.status.id);
      booking.status = status;
    }

    try {
      await booking.save();
      return booking;
    } catch (err) {
      throw new Error(`Error creating booking: ${err}`);
    }
  }

  async updateBooking( id: number,data: BookingInput): Promise<Booking> {
    const booking = await Booking.findOne({
      where: { id },
      relations: ["status"],
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    Object.assign(booking, data);

    if (booking.endDate <= booking.startDate) {
      throw new Error("End date must be after start date");
    }

    if (data.status) {
      const status = await this.statusService.getStatusById(data.status.id);
      booking.status = status;
    }

    await booking.save();
    return booking;
  }

  async deleteBooking(id: number): Promise<number> {
    const booking = await Booking.findOneBy({ id });
    if (!booking) {
      throw new Error("Booking not found");
    }

    await Booking.delete({ id });
    return id;
  }
}

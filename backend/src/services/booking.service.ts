import { CreateBookingInput, UpdateBookingInput } from "../dtos/booking.dto";
import { Booking } from "../entities/Booking";
import { StatusService } from "./status.service";

export class BookingService {
  private readonly statusService = new StatusService();

  async getAllBookings(): Promise<Booking[]> {
      return Booking.find({ relations: ["status"] });
    }

  async getBookingById(id: number): Promise<Booking> {
    
      const booking = await Booking.findOne({
        where: { id },
        relations: ["status"],
      });

      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    }

  async createBooking(data: CreateBookingInput): Promise<Booking> {

    if (data.endDate <= data.startDate) {
      throw new Error("End date must be after start date");
    }

    const booking = Booking.create({
      startDate: data.startDate,
      endDate: data.endDate, 
    });

    const status = await this.statusService.getStatusById(data.statusId);
    booking.status = status;

      await booking.save();
      return booking;

  }

  async updateBooking( id: number,data: UpdateBookingInput): Promise<Booking> {
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

    if (data.statusId) {
      const status = await this.statusService.getStatusById(data.statusId);
      booking.status = status;
    }

    await booking.save();
    return booking;
  }

  async deleteBooking(id: number): Promise<number> {
    const booking = await Booking.findOneBy({ id });
    if (!booking) { throw new Error("Booking not found");}

    await Booking.delete({ id });
    return id;
  }
}

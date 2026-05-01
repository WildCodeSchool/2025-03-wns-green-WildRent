import { CreateBookingInput, UpdateBookingInput } from "../dtos/booking.dto";
import { Booking } from "../entities/Booking";
import { User } from "../entities/User";
import { StatusService } from "./status.service";
import { Errors } from "../errors/errors"; 

export class BookingService {
  private readonly statusService = new StatusService();

  async getAllBookings(): Promise<Booking[]> {
      return Booking.find({ relations: ["status", "user"] });
  }

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
  async getMyBookings(userId: number): Promise<Booking[]> {
    return Booking.find({
      where: { user: { id: userId } },
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

  async createBooking(data: CreateBookingInput, userId: number): Promise<Booking> {

    if (data.endDate <= data.startDate) {
      throw Errors.badRequest("La date de fin doit être après la date de début");
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

  async updateBooking(id: number, data: UpdateBookingInput): Promise<Booking> {
    const booking = await Booking.findOne({
      where: { id },
      relations: ["status", "user"],
    });

    if (!booking) {
      throw Errors.notFound("Booking");
    }

    if (booking.endDate <= booking.startDate) {
      throw Errors.badRequest("La date de fin doit être après la date de début");
    }

    if (data.statusId) {
      const status = await this.statusService.getStatusById(data.statusId);
      booking.status = status;
    }

    Object.assign(booking, data);
    
    await booking.save();
    return booking;
  }

  async deleteBooking(id: number): Promise<number> {
    const booking = await Booking.findOneBy({ id });
    if (!booking) throw Errors.notFound("Booking");

    await Booking.delete({ id });
    return id;
  }

  
}
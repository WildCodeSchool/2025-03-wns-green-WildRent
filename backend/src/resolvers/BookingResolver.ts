import {
  Arg,
	ID,
  Mutation,
  Resolver,
	Query,
} from "type-graphql";

import {Booking} from "../entities/Booking";
import { StatusService } from "../services/status.service";
import { BookingService } from "../services/booking.service";
import { BookingInput } from "../dtos/booking.dto";

@Resolver(Booking)
export class BookingResolver {
	private readonly statusService = new StatusService();
  private readonly bookingService = new BookingService();
  
	@Query (() => [Booking])
	async getAllBookings(): Promise<Booking[]> {
		return this.bookingService.getAllBookings();
	}

	@Query(() => Booking)
  async getBookingById(@Arg("id", () => ID) id: number): Promise<Booking> {
    return this.bookingService.getBookingById(id);
  }
	
  @Mutation(() => Booking)
  async createBooking(
    @Arg("data") data: BookingInput
  ): Promise<Booking> {
    return this.bookingService.createBooking(data);
  }

	@Mutation(() => Booking)
  async updateBooking(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: BookingInput
  ): Promise<Booking> {
    return this.bookingService.updateBooking(id, data);
  }

	@Mutation(() => ID)
  async deleteBooking(@Arg("id", () => ID) id: number): Promise<number> {
    return this.bookingService.deleteBooking(id);
  }
}
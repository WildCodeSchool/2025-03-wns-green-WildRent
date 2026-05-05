import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { Booking } from "../entities/Booking";
import { BookingService } from "../services/booking.service";
import { CreateBookingInput, UpdateBookingInput } from "../dtos/booking.dto";
import { AuthContext } from "../types/types";
import { Errors } from "../errors/errors";

@Resolver(Booking)
export class BookingResolver {
  private readonly bookingService = new BookingService();
  
  @Authorized("admin")
  @Query(() => [Booking])
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingService.getAllBookings();
  }

  @Authorized()
  @Query(() => Booking)
  async getBookingById(@Arg("id", () => ID) id: number): Promise<Booking> {
    return this.bookingService.getBookingById(id);
  }

  @Authorized()
  @Query(() => [Booking])
  async getMyBookings(@Ctx() context: AuthContext): Promise<Booking[]> {
    return this.bookingService.getMyBookings(context.user.id);
  }

  @Authorized()
  @Mutation(() => Booking)
  async createBooking(
    @Arg("data") data: CreateBookingInput,
    @Ctx() context: AuthContext,
  ): Promise<Booking> {
    return this.bookingService.createBooking(data, context.user.id);
  }

  @Authorized()
  @Mutation(() => Booking)
  async updateBooking(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateBookingInput,
    @Ctx() context: AuthContext,
  ): Promise<Booking> {
    return this.bookingService.updateBooking(id, data, context.user.id);
  }

  @Authorized()
  @Mutation(() => ID)
  async deleteBooking(@Arg("id", () => ID) id: number): Promise<number> {
    return this.bookingService.deleteBooking(id);
  }
}
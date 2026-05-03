import {
  Arg,
  Ctx, 
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { Booking } from "../entities/Booking";
import { BookingService } from "../services/booking.service";
import { CreateBookingInput, UpdateBookingInput } from "../dtos/booking.dto";
import { AnonContext, AuthContext } from "../types/types"; 
import { Errors } from "../errors/errors"; 

@Resolver(Booking)
export class BookingResolver {
  private readonly bookingService = new BookingService();
  
  @Query(() => [Booking])
  async getAllBookings(
    @Ctx() context: AnonContext | AuthContext,
  ): Promise<Booking[]> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();
    if (userToken.role !== "admin") throw Errors.unauthorized();
  
    return this.bookingService.getAllBookings();
  }

  @Query(() => Booking)
  async getBookingById(@Arg("id", () => ID) id: number): Promise<Booking> {
    return this.bookingService.getBookingById(id);
  }

  @Query(() => [Booking])
  async getMyBookings(
  @Ctx() context: AnonContext | AuthContext): Promise<Booking[]> {
  const userToken = (context as AuthContext).user;
  if (!userToken) throw Errors.notAuthenticated();

  return this.bookingService.getMyBookings(userToken.id);
}
  
  @Mutation(() => Booking)
  async createBooking(
    @Arg("data") data: CreateBookingInput,
    @Ctx() context: AnonContext | AuthContext,
  ): Promise<Booking> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.bookingService.createBooking(data, userToken.id);
  }

  @Mutation(() => Booking)
  async updateBooking(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateBookingInput,
    @Ctx() context: AuthContext | AnonContext,
  ): Promise<Booking> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();
    
    return this.bookingService.updateBooking(id, data, userToken.id);
  }

  @Mutation(() => ID)
  async deleteBooking(@Arg("id", () => ID) id: number): Promise<number> {
    return this.bookingService.deleteBooking(id);
  }
}
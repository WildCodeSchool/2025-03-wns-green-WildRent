import {
  Arg,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { BookingProducts } from "../entities/BookingProducts";
import { BookingProductsService } from "../services/booking-products.service";
import { CreateBookingProductsInput, UpdateBookingProductsInput } from "../dtos/booking-products.dto";

@Resolver(BookingProducts)
export class BookingProductsResolver {
  private readonly bookingProductsService = new BookingProductsService();

  @Query(() => [BookingProducts])
  async getAllBookingProducts(): Promise<BookingProducts[]> {
    return this.bookingProductsService.getAllBookingProducts();
  }

	@Query(() => [BookingProducts])
	async getBookingProductsByBooking(@Arg("bookingId", () => ID) bookingId: number): Promise<BookingProducts[]> {
		return this.bookingProductsService.getBookingProductsByBookingId(bookingId);
	}

  @Mutation(() => BookingProducts)
  async createBookingProduct(@Arg("data") data: CreateBookingProductsInput): Promise<BookingProducts> {
    return this.bookingProductsService.createBookingProduct(data);
  }

	@Mutation(() => BookingProducts)
async updateBookingProduct(@Arg("id", () => ID) id: number,@Arg("data") data: UpdateBookingProductsInput): Promise<BookingProducts> {
  return this.bookingProductsService.updateBookingProduct(id, data);
}

  @Mutation(() => ID)
  async deleteBookingProduct(@Arg("id", () => ID) id: number): Promise<number> {
    return this.bookingProductsService.deleteBookingProduct(id);
  }
}

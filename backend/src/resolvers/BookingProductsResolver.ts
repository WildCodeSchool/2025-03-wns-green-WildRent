import {
  Arg,
  Authorized,
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

  @Authorized("admin")
  @Query(() => [BookingProducts])
  async getAllBookingProducts(): Promise<BookingProducts[]> {
    return this.bookingProductsService.getAllBookingProducts();
  }

	@Authorized("admin")
	@Query(() => [BookingProducts])
	async getBookingProductsByBookingId(@Arg("bookingId", () => ID) bookingId: number): Promise<BookingProducts[]> {
		return this.bookingProductsService.getBookingProductsByBookingId(bookingId);
	}

  @Authorized("admin")
  @Mutation(() => BookingProducts)
  async createBookingProduct(@Arg("data") data: CreateBookingProductsInput): Promise<BookingProducts> {
    return this.bookingProductsService.createBookingProduct(data);
  }

	@Authorized("admin")
	@Mutation(() => BookingProducts)
  async updateBookingProduct(@Arg("id", () => ID) id: number,@Arg("data") data: UpdateBookingProductsInput): Promise<BookingProducts> {
  return this.bookingProductsService.updateBookingProduct(id, data);
}

  @Authorized("admin")
  @Mutation(() => ID)
  async deleteBookingProduct(@Arg("id", () => ID) id: number): Promise<number> {
    return this.bookingProductsService.deleteBookingProduct(id);
  }
}

import { Booking } from "../entities/Booking";
import { BookingProducts } from "../entities/BookingProducts";
import { ProductVariant } from "../entities/ProductVariant";
import { CreateBookingProductsInput, UpdateBookingProductsInput } from "../dtos/booking-products.dto";
import { ProductVariantService } from "./product-variant.service";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing booking-product associations.
 * Handles linking product variants to bookings with quantity tracking and total price recalculation.
 */
export class BookingProductsService {
  private readonly productVariantService = new ProductVariantService();

  /**
   * Retrieves all booking-product entries with their related booking and product variant.
   * @returns Array of all booking-product associations
   */
  async getAllBookingProducts(): Promise<BookingProducts[]> {
    return BookingProducts.find({
      relations: ["booking", "productVariant", "productVariant.product"],
    });
  }

  /**
   * Retrieves all booking-product entries for a specific booking.
   * @param bookingId - The booking ID to filter by
   * @returns Array of booking-product associations for the given booking
   */
  async getBookingProductsByBookingId(bookingId: number): Promise<BookingProducts[]> {
    return BookingProducts.find({
      where: { booking: { id: bookingId } },
      relations: ["booking", "productVariant", "productVariant.product"],
    });
  }

  /**
   * Creates a new booking-product association, verifying stock availability for the rental period.
   * Recalculates the booking total price after insertion.
   * @param data - Input containing bookingId, productVariantId, and productQuantity
   * @returns The newly created booking-product entry
   * @throws BadRequestError if the quantity is zero or negative, or if stock is insufficient
   * @throws NotFoundError if the booking or product variant does not exist
   */
  async createBookingProduct(data: CreateBookingProductsInput): Promise<BookingProducts> {
    const productQuantity = data.productQuantity;
    if (productQuantity <= 0) throw Errors.badRequest("La quantité doit être supérieure à 0");

    const booking = await Booking.findOne({ where: { id: data.bookingId } });
    if (!booking) throw Errors.notFound("Booking");

    const productVariant = await ProductVariant.findOne({
      where: { id: data.productVariantId },
      relations: ["product"],
    });
    if (!productVariant) throw Errors.notFound("ProductVariant");

    const availableStock = await this.productVariantService.getAvailableStock(
      data.productVariantId,
      booking.startDate,
      booking.endDate
    );

    if (availableStock < productQuantity) {
      throw Errors.badRequest(
        `Stock insuffisant : seulement ${availableStock} disponible(s) sur cette période`
      );
    }

    const bookingProduct = BookingProducts.create({
      productQuantity,
      booking,
      productVariant,
    });

    await bookingProduct.save();
    await this.recalculateBookingTotal(booking.id);
    return bookingProduct;
  }

  /**
   * Updates the quantity of a booking-product entry and recalculates the booking total.
   * @param id - The booking-product ID to update
   * @param data - The fields to update (productQuantity)
   * @returns The updated booking-product entry
   * @throws NotFoundError if the booking-product does not exist
   * @throws BadRequestError if the quantity is zero/negative or exceeds available stock
   */
  async updateBookingProduct(id: number, data: UpdateBookingProductsInput): Promise<BookingProducts> {
    const bookingProduct = await BookingProducts.findOne({
      where: { id },
      relations: ["booking", "productVariant"],
    });
    if (!bookingProduct) throw Errors.notFound("BookingProduct");

    if (data.productQuantity !== undefined) {
      const productQuantity = data.productQuantity;

      if (productQuantity <= 0) {
        throw Errors.badRequest("La quantité doit être supérieure à 0");
      }

      if (bookingProduct.productVariant.quantity < productQuantity) {
        throw Errors.badRequest("Stock insuffisant pour ce produit");
      }

      bookingProduct.productQuantity = productQuantity;
    }

    await bookingProduct.save();
    await this.recalculateBookingTotal(bookingProduct.booking.id);
    return bookingProduct;
  }

  /**
   * Deletes a booking-product entry and recalculates the parent booking's total price.
   * @param id - The booking-product ID to delete
   * @returns The deleted booking-product's ID
   * @throws NotFoundError if the booking-product does not exist
   */
  async deleteBookingProduct(id: number): Promise<number> {
    const bookingProduct = await BookingProducts.findOne({
      where: { id },
      relations: ["booking"],
    });
    if (!bookingProduct) throw Errors.notFound("BookingProduct");

    const bookingId = bookingProduct.booking.id;

    await BookingProducts.remove(bookingProduct);
    await this.recalculateBookingTotal(bookingId);
    return id;
  }

  /**
   * Recalculates the total price of a booking based on its products, quantities, and rental duration.
   * @param bookingId - The booking ID to recalculate
   */
  private async recalculateBookingTotal(bookingId: number): Promise<void> {
    const booking = await Booking.findOne({
      where: { id: bookingId },
      relations: [
        "bookingsProducts",
        "bookingsProducts.productVariant",
        "bookingsProducts.productVariant.product",
      ],
    });

    if (!booking) return;

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let total = 0;
    for (const bp of booking.bookingsProducts) {
      total += bp.productQuantity * bp.productVariant.product.price * days;
    }

    booking.totalPrice = total;
    await booking.save();
  }
}

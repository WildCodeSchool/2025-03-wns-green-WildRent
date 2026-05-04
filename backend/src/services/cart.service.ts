import { Booking } from "../entities/Booking";
import { BookingProducts } from "../entities/BookingProducts";
import { ProductVariant } from "../entities/ProductVariant";
import { User } from "../entities/User";
import { BookingService } from "./booking.service";
import { BookingProductsService } from "./booking-products.service";
import { StatusService } from "./status.service";
import { ProductVariantService } from "./product-variant.service";
import { Errors } from "../errors/errors";

const CART_STATUS = "En attente";

/**
 * Service responsible for shopping cart management.
 * The cart is backed by bookings with a "Pending" status. Each cart entry
 * is a booking containing one or more product variants for a specific date range.
 */
export class CartService {
  private readonly bookingService = new BookingService();
  private readonly bookingProductsService = new BookingProductsService();
  private readonly statusService = new StatusService();
  private readonly productVariantService = new ProductVariantService();

  /**
   * Retrieves all pending bookings (cart items) for the authenticated user.
   * @param userId - The ID of the authenticated user
   * @returns Array of pending bookings with their products, ordered by most recent first
   */
  async getMyCart(userId: number): Promise<Booking[]> {
    const status = await this.statusService.getStatusByName(CART_STATUS);

    return Booking.find({
      where: { user: { id: userId }, status: { id: status.id } },
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
   * Adds a product variant to the user's cart.
   * - If a pending booking already exists with the same dates, the product is added to it.
   * - If the variant already exists in that booking, its quantity is incremented.
   * - Otherwise, a new pending booking is created.
   * @param userId - The ID of the authenticated user
   * @param productVariantId - The product variant to add
   * @param quantity - The desired rental quantity
   * @param startDate - The rental start date
   * @param endDate - The rental end date
   * @returns The updated or newly created booking with all relations
   * @throws BadRequestError if dates are invalid, quantity is non-positive, or stock is insufficient
   * @throws NotFoundError if the product variant does not exist
   */
  async addToCart(
    userId: number,
    productVariantId: number,
    quantity: number,
    startDate: Date,
    endDate: Date
  ): Promise<Booking> {
    if (endDate < startDate) {
      throw Errors.badRequest("La date de fin ne peut pas être avant la date de début");
    }
    if (quantity <= 0) {
      throw Errors.badRequest("La quantité doit être supérieure à 0");
    }

    const productVariant = await ProductVariant.findOne({
      where: { id: productVariantId },
      relations: ["product"],
    });
    if (!productVariant) throw Errors.notFound("ProductVariant");

    const status = await this.statusService.getStatusByName(CART_STATUS);

    // Look for an existing pending booking with the same dates
    let booking = await Booking.findOne({
      where: {
        user: { id: userId },
        status: { id: status.id },
        startDate,
        endDate,
      },
      relations: ["bookingsProducts", "bookingsProducts.productVariant", "status", "user"],
    });

    if (booking) {
      // Check if the variant already exists in this booking
      const existingItem = booking.bookingsProducts.find(
        (bp) => bp.productVariant.id === productVariantId
      );

      if (existingItem) {
        // Increment the quantity via BookingProductsService
        const newQuantity = existingItem.productQuantity + quantity;
        await this.checkStock(productVariantId, newQuantity, startDate, endDate);
        await this.bookingProductsService.updateBookingProduct(existingItem.id, {
          productQuantity: newQuantity,
        });
      } else {
        // Add a new BookingProduct via BookingProductsService
        await this.checkStock(productVariantId, quantity, startDate, endDate);
        await this.bookingProductsService.createBookingProduct({
          bookingId: booking.id,
          productVariantId,
          productQuantity: quantity,
        });
      }
    } else {
      // Create a new pending booking via BookingService
      await this.checkStock(productVariantId, quantity, startDate, endDate);
      booking = await this.bookingService.createBooking({ startDate, endDate }, userId);

      // Add the product to the new booking
      await this.bookingProductsService.createBookingProduct({
        bookingId: booking.id,
        productVariantId,
        productQuantity: quantity,
      });
    }

    return this.getBookingWithRelations(booking.id);
  }

  /**
   * Updates the quantity of a specific item in the user's cart.
   * @param userId - The ID of the authenticated user
   * @param bookingProductId - The booking-product entry to update
   * @param quantity - The new quantity
   * @returns The updated booking with all relations
   * @throws BadRequestError if the quantity is non-positive or exceeds available stock
   * @throws NotFoundError if the booking-product does not exist
   * @throws UnauthorizedError if the item does not belong to the user
   */
  async updateCartItemQuantity(
    userId: number,
    bookingProductId: number,
    quantity: number
  ): Promise<Booking> {
    if (quantity <= 0) {
      throw Errors.badRequest("La quantité doit être supérieure à 0");
    }

    const bookingProduct = await this.getCartBookingProduct(userId, bookingProductId);
    const booking = bookingProduct.booking;

    await this.checkStock(
      bookingProduct.productVariant.id,
      quantity,
      booking.startDate,
      booking.endDate
    );

    await this.bookingProductsService.updateBookingProduct(bookingProductId, {
      productQuantity: quantity,
    });

    return this.getBookingWithRelations(booking.id);
  }

  /**
   * Updates the rental dates of a cart item. Since dates are stored at the booking level,
   * the booking-product is moved to an existing booking with the new dates or a new one is created.
   * @param userId - The ID of the authenticated user
   * @param bookingProductId - The booking-product entry to update
   * @param newStartDate - The new rental start date
   * @param newEndDate - The new rental end date
   * @returns The target booking with all relations
   * @throws BadRequestError if dates are invalid or stock is insufficient for the new period
   * @throws NotFoundError if the booking-product does not exist
   * @throws UnauthorizedError if the item does not belong to the user
   */
  async updateCartItemDates(
    userId: number,
    bookingProductId: number,
    newStartDate: Date,
    newEndDate: Date
  ): Promise<Booking> {
    if (newEndDate < newStartDate) {
      throw Errors.badRequest("La date de fin ne peut pas être avant la date de début");
    }

    const bookingProduct = await this.getCartBookingProduct(userId, bookingProductId);
    const oldBooking = bookingProduct.booking;

    // If dates are the same, nothing to do
    if (
      oldBooking.startDate.getTime() === newStartDate.getTime() &&
      oldBooking.endDate.getTime() === newEndDate.getTime()
    ) {
      return this.getBookingWithRelations(oldBooking.id);
    }

    // Verify stock availability for the new dates
    await this.checkStock(
      bookingProduct.productVariant.id,
      bookingProduct.productQuantity,
      newStartDate,
      newEndDate
    );

    const status = await this.statusService.getStatusByName(CART_STATUS);

    // Look for an existing pending booking with the new dates
    let targetBooking = await Booking.findOne({
      where: {
        user: { id: userId },
        status: { id: status.id },
        startDate: newStartDate,
        endDate: newEndDate,
      },
      relations: ["bookingsProducts", "bookingsProducts.productVariant", "status", "user"],
    });

    if (!targetBooking) {
      // Create a new pending booking via BookingService
      targetBooking = await this.bookingService.createBooking(
        { startDate: newStartDate, endDate: newEndDate },
        userId
      );
    }

    // Move the bookingProduct to the target booking
    bookingProduct.booking = targetBooking;
    await bookingProduct.save();

    // Recalculate the target booking's total price
    await this.bookingProductsService.updateBookingProduct(bookingProductId, {
      productQuantity: bookingProduct.productQuantity,
    });

    // Clean up the old booking if it has no more products
    await this.cleanEmptyBooking(oldBooking.id);

    return this.getBookingWithRelations(targetBooking.id);
  }

  /**
   * Removes a specific item from the user's cart and cleans up empty bookings.
   * @param userId - The ID of the authenticated user
   * @param bookingProductId - The booking-product entry to remove
   * @returns The removed booking-product's ID
   * @throws NotFoundError if the booking-product does not exist
   * @throws UnauthorizedError if the item does not belong to the user
   */
  async removeCartItem(userId: number, bookingProductId: number): Promise<number> {
    const bookingProduct = await this.getCartBookingProduct(userId, bookingProductId);
    const bookingId = bookingProduct.booking.id;

    await this.bookingProductsService.deleteBookingProduct(bookingProductId);

    // Clean up the booking if it has no more products
    await this.cleanEmptyBooking(bookingId);

    return bookingProductId;
  }

  /**
   * Clears the entire cart by deleting all pending bookings for the user.
   * @param userId - The ID of the authenticated user
   * @returns true when the cart has been successfully cleared
   */
  async clearCart(userId: number): Promise<boolean> {
    const cartBookings = await this.getMyCart(userId);

    for (const booking of cartBookings) {
      await this.bookingService.deleteBooking(booking.id);
    }

    return true;
  }

  /**
   * Validates the cart by transitioning all pending bookings to "To prepare" status.
   * @param userId - The ID of the authenticated user
   * @returns Array of the validated bookings
   * @throws BadRequestError if the cart is empty
   */
  async validateCart(userId: number): Promise<Booking[]> {
    const cartBookings = await this.getMyCart(userId);

    if (cartBookings.length === 0) {
      throw Errors.badRequest("Le panier est vide");
    }

    const prepareStatus = await this.statusService.getStatusByName("À préparer");

    for (const booking of cartBookings) {
      await this.bookingService.updateBooking(booking.id, {
        statusId: prepareStatus.id,
      }, userId);
    }

    return cartBookings;
  }

  // ─── Private methods ─────────────────────────────────────────────────

  /** Checks that sufficient stock is available for a variant over a given rental period. */
  private async checkStock(
    productVariantId: number,
    quantity: number,
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    const availableStock = await this.productVariantService.getAvailableStock(
      productVariantId,
      startDate,
      endDate
    );

    if (availableStock < quantity) {
      throw Errors.badRequest(
        `Stock insuffisant : seulement ${availableStock} disponible(s) sur cette période`
      );
    }
  }

  /** Retrieves a cart booking-product, verifying it belongs to the user and has pending status. */
  private async getCartBookingProduct(
    userId: number,
    bookingProductId: number
  ): Promise<BookingProducts> {
    const bookingProduct = await BookingProducts.findOne({
      where: { id: bookingProductId },
      relations: ["booking", "booking.user", "booking.status", "productVariant"],
    });

    if (!bookingProduct) throw Errors.notFound("BookingProduct");

    // Verify the booking belongs to the user and has pending status
    if (bookingProduct.booking.user.id !== userId) {
      throw Errors.unauthorized();
    }
    if (bookingProduct.booking.status.statusName !== CART_STATUS) {
      throw Errors.badRequest("Cet item ne fait pas partie du panier");
    }

    return bookingProduct;
  }

  /** Deletes a booking if it no longer contains any booking-products. */
  private async cleanEmptyBooking(bookingId: number): Promise<void> {
    const booking = await Booking.findOne({
      where: { id: bookingId },
      relations: ["bookingsProducts"],
    });

    if (booking && booking.bookingsProducts.length === 0) {
      await this.bookingService.deleteBooking(bookingId);
    }
  }

  /** Fetches a booking with all its nested relations (status, user, products). */
  private async getBookingWithRelations(bookingId: number): Promise<Booking> {
    const booking = await Booking.findOne({
      where: { id: bookingId },
      relations: [
        "status",
        "user",
        "bookingsProducts",
        "bookingsProducts.productVariant",
        "bookingsProducts.productVariant.product",
      ],
    });

    if (!booking) throw Errors.notFound("Booking");
    return booking;
  }
}

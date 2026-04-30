import { Booking } from "../entities/Booking";
import { BookingProducts } from "../entities/BookingProducts";
import { ProductVariant } from "../entities/ProductVariant";
import { CreateBookingProductsInput, UpdateBookingProductsInput } from "../dtos/booking-products.dto";
import { ProductVariantService } from "./product-variant.service";
import { Errors } from "../errors/errors";

export class BookingProductsService {
	private readonly productVariantService = new ProductVariantService();
  async getAllBookingProducts(): Promise<BookingProducts[]> {
    return BookingProducts.find({
      relations: ["booking", "productVariant", "productVariant.product"],
    });
  }

  async getBookingProductsByBookingId(bookingId: number): Promise<BookingProducts[]> {
    return BookingProducts.find({
      where: { booking: { id: bookingId } },
      relations: ["booking", "productVariant", "productVariant.product"],
    });
  }

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
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let total = 0;
    for (const bp of booking.bookingsProducts) {
      total += bp.productQuantity * bp.productVariant.product.price * days;
    }

    booking.totalPrice = total;
    await booking.save();
  }
}

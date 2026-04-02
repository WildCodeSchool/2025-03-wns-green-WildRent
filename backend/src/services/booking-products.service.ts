import { Booking } from "../entities/Booking";
import { BookingProducts } from "../entities/BookingProducts";
import { Product } from "../entities/Product";
import { CreateBookingProductsInput, UpdateBookingProductsInput } from "../dtos/booking-products.dto";

export class BookingProductsService {
  async getAllBookingProducts(): Promise<BookingProducts[]> {
    return BookingProducts.find({
      relations: ["booking", "product"],
    });
  }

	async getBookingProductsByBookingId(bookingId: number): Promise<BookingProducts[]> {
		return BookingProducts.find({
			where: { booking: { id: bookingId } },
			relations: ["booking", "product"],
		});
	}

  async createBookingProduct(data: CreateBookingProductsInput): Promise<BookingProducts> {
		const productQuantity = data.productQuantity;
	  if (productQuantity <= 0) throw new Error("productQuantity must be > 0");
	
		const booking = await Booking.findOne({ where: { id: data.bookingId } });
		if (!booking) throw new Error("Booking not found");
	
		const product = await Product.findOne({ where: { id: data.productId } });
		if (!product) throw new Error("Product not found");

		if (product.quantityVariants < productQuantity) {
			throw new Error("Not enough stock available");
		}
	
		const bookingProduct = BookingProducts.create({
			productQuantity,
			booking,
			product,
		});
	
		await bookingProduct.save();
		return bookingProduct;
	}

  async updateBookingProduct(id: number, data: UpdateBookingProductsInput ): Promise<BookingProducts> {
    const bookingProduct = await BookingProducts.findOne({ where: { id },relations: ["booking", "product"], });
    if (!bookingProduct) { throw new Error("BookingProduct not found"); }

		if (data.productQuantity !== undefined) {
		const productQuantity = data.productQuantity;
	
		if (productQuantity <= 0) throw new Error("productQuantity must be > 0");

		if (bookingProduct.product.quantityVariants < productQuantity) {
      throw new Error("Not enough stock available");
    }
	
		bookingProduct.productQuantity = productQuantity;
		}

    await bookingProduct.save();
    return bookingProduct;
  }

  async deleteBookingProduct(id: number): Promise<number> {
    const bookingProduct = await BookingProducts.findOne({ where: { id } });
    if (!bookingProduct) throw new Error("BookingProduct not found");

    await BookingProducts.remove(bookingProduct);
    return id;
  }
}

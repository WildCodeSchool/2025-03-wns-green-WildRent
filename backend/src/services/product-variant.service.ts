import { FindManyOptions, In, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { Status } from "../entities/Status";
import { CreateProductVariantInput, UpdateProductVariantInput } from "../dtos/product-variant.dto";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { BookingProducts } from "../entities/BookingProducts";
import { generateProductRef } from "../utils/generateProductRef";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing product variants (size, color variations).
 * Handles CRUD operations, stock availability checks, and parent product quantity synchronization.
 */
export class ProductVariantService {
  /**
   * Recalculates and updates the total quantity of variants for a given product.
   * @param productId - The parent product ID
   */
  async updateQuantityVariants(productId: number): Promise<void> {
    const variants = await ProductVariant.find({
      where: { product: { id: productId } },
    });
    const total = variants.reduce((sum, v) => sum + v.quantity, 0);
    await Product.update(productId, { quantityVariants: total });
  }

  /**
   * Retrieves all product variants with their parent product.
   * @returns Array of all product variants
   */
  async getAllProductsVariant(): Promise<ProductVariant[]> {
    const findOptions: FindManyOptions<ProductVariant> = {
      relations: { product: true },
    };
    return await ProductVariant.find(findOptions);
  }

  /**
   * Retrieves a single product variant by its ID.
   * @param id - The product variant ID
   * @returns The matching product variant
   * @throws NotFoundError if no variant exists with the given ID
   */
  async getProductVariantById(id: number): Promise<ProductVariant> {
    const productVariant = await ProductVariant.findOneBy({ id });
    if (!productVariant) throw Errors.notFound("ProductVariant");
    return productVariant;
  }

  /**
   * Calculates the available stock for a product variant over a given date range.
   * Subtracts reserved quantities from overlapping bookings.
   * @param productVariantId - The product variant ID
   * @param startDate - The rental period start date
   * @param endDate - The rental period end date
   * @returns The number of available units for the period
   * @throws NotFoundError if the product variant does not exist
   */
  async getAvailableStock(
    productVariantId: number,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: number
  ): Promise<number> {
    const productVariant = await ProductVariant.findOne({ where: { id: productVariantId } });
    if (!productVariant) throw Errors.notFound("ProductVariant");

    const blockingStatuses = await Status.find({
      where: { statusName: In(["En attente", "À préparer", "En cours"]) },
    });
    const blockingStatusIds = blockingStatuses.map((s) => s.id);

    const whereCondition: any = {
      productVariant: { id: productVariantId },
      booking: {
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
        status: { id: In(blockingStatusIds) },
      },
    };

    if (excludeBookingId) {
      whereCondition.booking.id = Not(excludeBookingId);
    }

    const overlappingBookings = await BookingProducts.find({
      where: whereCondition,
      relations: ["booking", "booking.status"],
    });

    const reservedQuantity = overlappingBookings.reduce(
      (sum, bp) => sum + bp.productQuantity,
      0
    );

    return productVariant.quantity - reservedQuantity;
  }

  /**
   * Creates a new product variant with a unique auto-generated reference code.
   * Updates the parent product's total variant quantity after creation.
   * @param data - The variant creation input (color, size, image, quantity, discount, productId)
   * @returns The newly created product variant
   * @throws NotFoundError if the parent product does not exist
   * @throws BadRequestError if the variant discount is lower than the product discount
   */
  async createProductVariant(data: CreateProductVariantInput): Promise<ProductVariant> {
    const product = await Product.findOneBy({ id: data.productId });
    if (!product) throw Errors.notFound("Product");

    let productRef: string;
    do {
      productRef = generateProductRef();
    } while (await ProductVariant.findOneBy({ productRef }));

    const discount = data.discount ?? 0;
    if (discount > 0 && discount < product.discount) {
      throw Errors.badRequest("La réduction du variant ne peut pas être inférieure à celle du produit");
    }

    const productVariant = ProductVariant.create({
      color: data.color,
      size: data.size,
      image: data.image,
      quantity: data.quantity,
      discount,
      productRef,
      product,
    });
    await productVariant.save();
    await this.updateQuantityVariants(product.id);
    return productVariant;
  }

  /**
   * Updates an existing product variant's fields. Syncs parent product quantity if quantity changed.
   * @param id - The product variant ID to update
   * @param data - The fields to update (color, size, image, quantity, discount)
   * @returns The updated product variant
   * @throws NotFoundError if the variant does not exist
   * @throws BadRequestError if the variant discount is lower than the product discount
   */
  async updateProductVariant(id: number, data: UpdateProductVariantInput): Promise<ProductVariant> {
    const currProductVariant = await ProductVariant.findOne({ where: { id }, relations: { product: true } });
    if (!currProductVariant) throw Errors.notFound("ProductVariant");

    if (data.discount !== undefined && data.discount > 0 && data.discount < currProductVariant.product.discount) {
      throw Errors.badRequest("La réduction du variant ne peut pas être inférieure à celle du produit");
    }

    Object.assign(currProductVariant, data);
    await currProductVariant.save();

    if (data.quantity !== undefined) {
      await this.updateQuantityVariants(currProductVariant.product.id);
    }
    return currProductVariant;
  }

  /**
   * Deletes a product variant and updates the parent product's total variant quantity.
   * @param id - The product variant ID to delete
   * @returns A confirmation message string
   * @throws NotFoundError if the variant does not exist
   */
  async deleteProductVariant(id: number): Promise<string> {
    const currProductVariant = await ProductVariant.findOne({ where: { id }, relations: { product: true } });
    if (!currProductVariant) throw Errors.notFound("ProductVariant");

    const productId = currProductVariant.product.id;
    await ProductVariant.remove(currProductVariant);
    await this.updateQuantityVariants(productId);
    return "PRODUCT_VARIANT DELETED";
  }
}

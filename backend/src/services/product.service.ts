import { NewProductInput, UpdateProductInput } from "../dtos/product.dto";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { generateProductRef } from "../utils/generateProductRef";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing products.
 * Handles CRUD operations, search and pagination with category and variant relations.
 */
export class ProductService {
  /**
   * Retrieves all products with pagination (intended for admin usage).
   * @param limit - Maximum number of products to return (default: 20)
   * @param offset - Number of products to skip (default: 0)
   * @returns Object containing products array, total count and hasMore flag
   */
  async getAllProducts(
    limit: number = 20,
    offset: number = 0
  ): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    const [products, total] = await Product.findAndCount({
      relations: { category: true, productVariant: true },
      take: limit,
      skip: offset,
      order: { id: "DESC" },
    });

    return { products, total, hasMore: offset + limit < total };
  }

  /**
   * Searches products by a query string across name, brand, reference and category name.
   * Uses PostgreSQL ILIKE for case-insensitive partial matching.
   * @param query - The search term
   * @param limit - Maximum number of results to return (default: 20)
   * @param offset - Number of results to skip for pagination (default: 0)
   * @returns Object containing matching products array, total count and hasMore flag
   */
  async searchProducts(
    query: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    const words = query.split(/\s+/).filter((w) => w.length > 0);

    const qb = Product.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.productVariant", "productVariant");

    for (const [i, word] of words.entries()) {
      const param = `word${i}`;
      qb.andWhere(
        `(product.name ILIKE :${param} OR product.brand ILIKE :${param} OR product.productRef ILIKE :${param} OR category.name ILIKE :${param})`,
        { [param]: `%${word}%` },
      );
    }

    qb.orderBy("product.id", "DESC").skip(offset).take(limit);

    const [products, total] = await qb.getManyAndCount();

    return { products, total, hasMore: offset + limit < total };
  }

  /**
   * Retrieves a single product by its ID with category and variants.
   * @param id - The product ID
   * @returns The matching product
   * @throws NotFoundError if no product exists with the given ID
   */
  async getProductById(id: number): Promise<Product> {
    const product = await Product.findOne({
      where: { id },
      relations: { category: true, productVariant: true },
    });
    if (!product) throw Errors.notFound("Product");
    return product;
  }

  /**
   * Retrieves all products belonging to a specific category.
   * @param categoryId - The category ID to filter by
   * @returns Array of products in the given category
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Product.find({
      where: { category: { id: categoryId } },
      relations: { category: true, productVariant: true },
    });
  }

  /**
   * Creates a new product with a unique auto-generated reference code.
   * @param data - The product creation input (name, price, description, image, brand, gender, categoryId)
   * @returns The newly created product
   * @throws NotFoundError if the specified category does not exist
   */
  async createProduct(data: NewProductInput): Promise<Product> {
    let productRef: string;
    do {
      productRef = generateProductRef();
    } while (await Product.findOneBy({ productRef }));

    const category = await Category.findOneBy({ id: data.categoryId });
    if (!category) throw Errors.notFound("Category");

    const product = Product.create({
      name: data.name,
      price: data.price,
      productRef,
      description: data.description,
      image: data.image,
      brand: data.brand,
      gender: data.gender,
      category,
    });
    await product.save();
    return product;
  }

  /**
   * Updates an existing product's fields and category.
   * @param id - The product ID to update
   * @param data - The fields to update, including categoryId
   * @returns The updated product
   * @throws NotFoundError if the product or category does not exist
   */
  async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
    const currProduct = await Product.findOne({ where: { id } });
    if (!currProduct) throw Errors.notFound("Product");

    const category = await Category.findOneBy({ id: data.categoryId });
    if (!category) throw Errors.notFound("Category");

    Object.assign(currProduct, data, { category });
    await currProduct.save();
    return currProduct;
  }

  /**
   * Deletes a product by its ID.
   * @param id - The product ID to delete
   * @returns true if the product was successfully deleted
   * @throws NotFoundError if the product does not exist
   */
  async deleteProduct(id: number): Promise<Boolean> {
    const currProduct = await Product.findOne({ where: { id } });
    if (!currProduct) throw Errors.notFound("Product");
    await Product.remove(currProduct);
    return true;
  }
}

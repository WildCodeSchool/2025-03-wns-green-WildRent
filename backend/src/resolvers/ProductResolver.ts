import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";
import {
  NewProductInput,
  UpdateProductInput,
  SearchProductsInput,
  PaginatedProducts,
} from "../dtos/product.dto";

@Resolver(Product)
export default class ProductResolver {
  private readonly productService = new ProductService();

  @Query(() => PaginatedProducts)
  async getAllProducts(
    @Arg("limit", () => Int, { defaultValue: 20 }) limit: number,
    @Arg("offset", () => Int, { defaultValue: 0 }) offset: number,
  ): Promise<PaginatedProducts> {
    return this.productService.getAllProducts(limit, offset);
  }

  @Query(() => PaginatedProducts)
  async searchProducts(
    @Arg("data") data: SearchProductsInput,
  ): Promise<PaginatedProducts> {
    return this.productService.searchProducts(
      data.query,
      data.limit ?? 20,
      data.offset ?? 0,
    );
  }

  @Query(() => Product)
  async getProductByRef(@Arg("id") id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Query(() => [Product])
  async getProductsByCategory(
    @Arg("categoryId") categoryId: number,
  ): Promise<Product[]> {
    return this.productService.getProductsByCategory(categoryId);
  }

  @Authorized("admin")
  @Mutation(() => Product)
  async createProduct(@Arg("data") data: NewProductInput): Promise<Product> {
    return this.productService.createProduct(data);
  }

  @Authorized("admin")
  @Mutation(() => Product)
  async updateProduct(
    @Arg("id") id: number,
    @Arg("data") data: UpdateProductInput,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @Authorized("admin")
  @Mutation(() => Product)
  async deleteProduct(@Arg("id") id: number): Promise<Boolean> {
    return this.productService.deleteProduct(id);
  }
}

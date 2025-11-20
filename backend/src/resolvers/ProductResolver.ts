import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";
import { NewProductInput, UpdateProductInput } from "../dtos/product.dto";

@Resolver(Product)
export default class ProductResolver {
    private readonly productService = new ProductService(); 

    @Query(() => [Product])
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Query(() => Product)
    async getProductByRef(@Arg("id") id: number): Promise<Product>{
        return this.productService.getProductById(id);
    }

    @Mutation(() => Product)
    async createProduct(@Arg("data") data: NewProductInput): Promise<Product>{
        return this.productService.createProduct(data);
    }

    @Mutation(() => Product)
    async updateProduct(@Arg("id") id: number, @Arg("data") data: UpdateProductInput) {
        return this.productService.updateProduct(id, data);
    }

    @Mutation(() => Product)
    async deleteProduct(@Arg("id") id: number): Promise<Boolean> {
        return this.productService.deleteProduct(id); 
    }
}; 
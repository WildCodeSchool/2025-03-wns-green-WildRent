import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { ProductVariant } from "../entities/ProductVariant";
import { ProductVariantService } from "../services/product-variant.service";
import { CreateProductVariantInput, UpdateProductVariantInput } from "../dtos/product-variant.dto";

@Resolver(ProductVariant)
export default class ProductVariantResolver {
    private readonly productVariantService = new ProductVariantService(); 

    @Query(() => [ProductVariant])
    async getAllProductVariant() {
        return this.productVariantService.getAllProductsVariant(); 
    }

    @Query(() => ProductVariant)
    async getProductVariantById(@Arg("id") id: number) {
        return this.productVariantService.getProductVariantById(id); 
    }

    @Query(() => Int)
    async getAvailableStock(
        @Arg("productVariantId") productVariantId: number,
        @Arg("startDate") startDate: Date,
        @Arg("endDate") endDate: Date,
    ): Promise<number> {
        return this.productVariantService.getAvailableStock(productVariantId, startDate, endDate);
    }
    
    @Authorized("admin")
    @Mutation(() => ProductVariant)
    async createProductVariant(@Arg("data") data: CreateProductVariantInput): Promise<ProductVariant> {
        return this.productVariantService.createProductVariant(data); 
    }

    @Authorized("admin")
    @Mutation(() => ProductVariant)
    async updateProductVariant(@Arg("id") id: number, @Arg("data") data: UpdateProductVariantInput): Promise<ProductVariant> {
        return this.productVariantService.updateProductVariant(id, data); 
    }

    @Authorized("admin")
    @Mutation(() => ProductVariant)
    async deleteProductVariant(@Arg("id") id: number): Promise<String> {
        return this.productVariantService.deleteProductVariant(id); 
    }    
}; 
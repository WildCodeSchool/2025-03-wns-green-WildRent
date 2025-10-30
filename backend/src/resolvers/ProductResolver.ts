import { Arg, Field, InputType, Query, Resolver } from "type-graphql";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";

@InputType()
class NewProductInput implements Partial<Product> {
    @Field()
    productRef!: number;
    
    @Field()
    name!: string;

    @Field()
    quantity!: number;

    @Field()
    price!: number;

    @Field()
    description!: string;

    @Field()
    image!: string;

    @Field()
    brand!: string;

    @Field()
    gender!: string;
    
    @Field()
    discount!: number;
}

class UpdateProductInput implements Partial<Product> {
    @Field()
    name!: string;

    @Field()
    price!: number;

    @Field()
    description!: string;

    @Field()
    image!: string;
    
    @Field()
    discount!: number;
}

@Resolver(Product)
export default class ProductResolver {
    private readonly productService = new ProductService(); 

    @Query(() => [Product])
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Query(() => Product)
    async getProductByRef(@Arg("productRef") productRef: number): Promise<Product>{
        return this.productService.getProductByRef(productRef)
    }
}; 
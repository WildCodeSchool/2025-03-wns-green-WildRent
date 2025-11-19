import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";
import { Category } from "../entities/Category";

@InputType()
export class NewProductInput {
    // @Field()
    // productRef!: number;
    
    @Field()
    name!: string;

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

    @Field(() => ID, { nullable: true })
    category!: Category;
}

@InputType()
export class UpdateProductInput {
    @Field()
    name!: string;

    @Field()
    price!: number;

    @Field()
    description!: string;

    @Field()
    image!: string;

    @Field()
    gender!: string;
    
    @Field()
    discount!: number;

    @Field(() => ID, { nullable: true })
    category!: Category;

    @Field()
    note!: number;
}

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
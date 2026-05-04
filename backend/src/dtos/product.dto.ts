import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { IsOptional, Min, Max, IsString } from "class-validator";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

@InputType()
export class NewProductInput {
    @Field()
    name!: string;

    @Field()
    price!: number;

    @Field()
    description!: string;

    @Field()
    image!: string;

    @Field({ nullable: true })
    image1?: string;

    @Field({ nullable: true })
    image2?: string;

    @Field({ nullable: true })
    image3?: string;

    @Field()
    brand!: string;

    @Field()
    gender!: string;

    @Field(() => ID)
    categoryId!: number;
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

    @Field({ nullable: true })
    image1?: string;

    @Field({ nullable: true })
    image2?: string;

    @Field({ nullable: true })
    image3?: string;

    @Field()
    gender!: string;

    @Field({ nullable: true })
    quantityVariants?: number;
    
    @Field({ nullable: true })
    discount?: number;

    @Field(() => ID)
    categoryId!: number;
}

@InputType()
export class UpdateRatingProductInput {
    @Field()
    note!: number;
}

@InputType()
export class PaginationInput {
    @Field(() => Int, { defaultValue: 20 })
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number;

    @Field(() => Int, { defaultValue: 0 })
    @IsOptional()
    @Min(0)
    offset?: number;
}

@InputType()
export class SearchProductsInput extends PaginationInput {
    @Field()
    @IsString()
    query!: string;
}

@ObjectType()
export class PaginatedProducts {
    @Field(() => [Product])
    products!: Product[];

    @Field(() => Int)
    total!: number;

    @Field()
    hasMore!: boolean;
}
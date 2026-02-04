import { Field, ID, InputType } from "type-graphql";
import { Category } from "../entities/Category";

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
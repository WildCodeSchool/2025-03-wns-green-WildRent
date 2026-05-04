import { Field, ID, InputType } from "type-graphql";

@InputType()
export class CreateProductVariantInput {
    @Field()
    color!: string;

    @Field()
    size!: string;

    @Field({ nullable: true })
    image?: string;

    @Field()
    quantity!: number;

    @Field({ nullable: true, defaultValue: 0 })
    discount?: number;

    @Field(() => ID)
    productId!: number;
}

@InputType()
export class UpdateProductVariantInput {
    @Field({ nullable: true })
    color?: string;

    @Field({ nullable: true })
    size?: string;

    @Field({ nullable: true })
    image?: string;

    @Field({ nullable: true })
    quantity?: number;

    @Field({ nullable: true })
    discount?: number;
}
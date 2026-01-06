import { Field, InputType } from "type-graphql";

@InputType()
export class CreateProductVariantInput {
    @Field()
    name!: string;

    @Field()
    color!: string;

    @Field()
    size!: string;

    @Field()
    image!: string;

    @Field()
    quantity!: number;
}

@InputType()
export class UpdateProductVariantInput {
    @Field()
    name!: string;
    
    @Field()
    color!: string;
    
    @Field()
    size!: string;
    
    @Field()
    image!: string;
    
    @Field()
    quantity!: string;

    @Field()
    price_overide!: number;
}
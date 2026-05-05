import { Field, InputType, Int } from "type-graphql";
import { IsInt, Min, IsOptional } from "class-validator";

@InputType()
export class CreateBookingProductsInput {
  @Field(() => Int)
  @IsInt()
  bookingId!: number;

  @Field(() => Int)
  @IsInt()
  productVariantId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  productQuantity!: number;
}

@InputType()
export class UpdateBookingProductsInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  productQuantity?: number;
}
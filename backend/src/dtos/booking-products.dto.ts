import { Field, InputType, ID, Int } from "type-graphql";
import { IsInt, Min, IsOptional } from "class-validator";

@InputType()
export class CreateBookingProductsInput {
  @Field(() => ID)
  @IsInt()
  bookingId!: number;

  @Field(() => ID)
  @IsInt()
  productId!: number;

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
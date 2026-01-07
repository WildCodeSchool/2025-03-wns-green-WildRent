import { Field, InputType, ID, Int } from "type-graphql";

@InputType()
export class CreateBookingProductsInput {
  @Field(() => ID)
  bookingId!: number;

  @Field(() => ID)
  productId!: number;

  @Field(() => Int)
  productQuantity!: number;
}

@InputType()
export class UpdateBookingProductsInput {
  @Field(() => Int, { nullable: true })
  productQuantity?: number;
}
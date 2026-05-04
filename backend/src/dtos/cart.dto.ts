import { Field, InputType, Int } from "type-graphql";
import { IsInt, Min, IsDate } from "class-validator";

@InputType()
export class AddToCartInput {
  @Field(() => Int)
  @IsInt()
  productVariantId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity!: number;

  @Field(() => Date)
  @IsDate()
  startDate!: Date;

  @Field(() => Date)
  @IsDate()
  endDate!: Date;
}

@InputType()
export class UpdateCartItemQuantityInput {
  @Field(() => Int)
  @IsInt()
  bookingProductId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity!: number;
}

@InputType()
export class UpdateCartItemDatesInput {
  @Field(() => Int)
  @IsInt()
  bookingProductId!: number;

  @Field(() => Date)
  @IsDate()
  startDate!: Date;

  @Field(() => Date)
  @IsDate()
  endDate!: Date;
}

@InputType()
export class RemoveCartItemInput {
  @Field(() => Int)
  @IsInt()
  bookingProductId!: number;
}

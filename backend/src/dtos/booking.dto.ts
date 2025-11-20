import {
  Field,
  InputType,
	ID,
} from "type-graphql";

@InputType()
export class CreateBookingInput {
  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date)
  endDate!: Date;

  @Field(() => ID)
  statusId!: number;
}

@InputType()
export class UpdateBookingInput {
  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => ID, { nullable: true })
  statusId?: number;
}

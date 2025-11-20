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

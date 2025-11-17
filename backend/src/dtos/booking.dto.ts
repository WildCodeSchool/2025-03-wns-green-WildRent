import {
  Field,
  InputType,
	ID,
} from "type-graphql";

@InputType()
export class CreateBookingInput {

	@Field()
	totalPrice!:number;

	@Field()
	startDate!:Date;

	@Field()
	endDate!:Date;

	@Field(() => ID)
  statusId!: number;
}

@InputType()
export class UpdateBookingInput {

  @Field({ nullable: true })
	totalPrice?:number;

	@Field({ nullable: true })
	startDate?:Date;

  @Field({ nullable: true })
	endDate?:Date;

	@Field({ nullable: true})
	isValidate?: boolean;

	@Field(() => ID, { nullable: true })
  statusId?: number;
}
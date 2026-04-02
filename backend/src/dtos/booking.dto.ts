import { Field, InputType,ID } from "type-graphql";
import { IsInt, Min, IsOptional, IsDate } from "class-validator";

@InputType()
export class CreateBookingInput {
  @Field(() => Date)
  @IsDate()
  startDate!: Date;

  @Field(() => Date)
  @IsDate()
  endDate!: Date;
	
}

@InputType()
export class UpdateBookingInput {
  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => ID, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  statusId?: number;
}

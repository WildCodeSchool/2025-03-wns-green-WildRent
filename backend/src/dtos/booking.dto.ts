import {
  Field,
  InputType,
} from "type-graphql";
import { StatusInput } from "./status.dto";

@InputType()
export class BookingInput {

	@Field({ nullable: true })
	startDate?:Date;

  @Field({ nullable: true })
	endDate?:Date;

	@Field(() => StatusInput, { nullable: true })
  status?: StatusInput;
}

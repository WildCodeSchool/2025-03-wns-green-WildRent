import { Field,InputType } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";

@InputType()
export class StatusInput {
	
  @Field() 
	@IsNotEmpty({ message: "Status name must not be empty" })
	@Length(3, 20, { message: "Status name must be between 3 and 20 characters" })
  statusName!: string;
}

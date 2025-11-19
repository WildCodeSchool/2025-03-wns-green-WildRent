import {
	Field,
	InputType,
	ID,
} from "type-graphql";

@InputType()
export class StatusInput {

	@Field(() => ID)
  id!: number;
	
  @Field({ nullable: true }) 
  statusName?: string;
}

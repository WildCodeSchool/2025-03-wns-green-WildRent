import {
	Field,
	InputType,
} from "type-graphql";

@InputType()
export class StatusInput {
	
  @Field() 
  statusName!: string;
}

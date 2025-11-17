import {
	Field,
	InputType,
} from "type-graphql";

@InputType()
export class CreateStatusInput{
	@Field()
	statusName!:string;
}

@InputType()
export class UpdateStatusInput{
	@Field()
	statusName!:string;
}
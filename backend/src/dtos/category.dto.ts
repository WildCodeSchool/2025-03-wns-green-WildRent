import { Field, InputType } from "type-graphql";

@InputType()
export class CategoryDto {
  @Field()
  name!: string;
}

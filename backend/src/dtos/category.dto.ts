import { Field, InputType } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";

@InputType()
export class CategoryInput {
  @Field()
  @IsNotEmpty({message: "Category name must not be empty" })
  @Length(4,20, {message: "Category name length must be between 4 and 20 characters"})
  name!: string;
}
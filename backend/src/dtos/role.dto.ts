import { Field, InputType } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";
@InputType()
export class RoleInput {
    @Field()
    @IsNotEmpty({ message: "Role name must not be empty" })
    @Length(3, 20, { message: "Role name must be between 3 and 20 characters" })
    roleName!: string;
}
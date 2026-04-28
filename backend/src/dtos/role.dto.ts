import { Field, InputType } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";
@InputType()
export class RoleInput {
    @Field()
    @IsNotEmpty({ message: "Le nom du rôle ne doit pas être vide" })
    @Length(3, 20, { message: "Le nom du rôle doit contenir entre 3 et 20 caractères" })
    roleName!: string;
}
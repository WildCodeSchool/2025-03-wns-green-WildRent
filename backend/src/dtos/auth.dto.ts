import { Field, InputType } from "type-graphql";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

@InputType()
export class LoginDto {
  @Field()
  @IsEmail({}, { message: "L'email doit être valide" })
  @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
  mail!: string;

  @Field()
  @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
  password!: string;
}

@InputType()
export class DeleteAccountDto {
  @Field()
  @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
  password!: string;
}

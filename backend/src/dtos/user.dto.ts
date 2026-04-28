import { Field, ID, InputType } from "type-graphql";
import { IsEmail, IsNotEmpty, Length, Matches, MinLength, IsOptional, IsStrongPassword, ValidateIf, Equals, IsInt } from "class-validator";
import { Transform, Type  } from "class-transformer";
import { Match } from "../validators/match.validator";

@InputType()
export class CreateUserDto {
    @Field()
    @IsEmail({}, { message: "L'email doit être valide" })
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email!: string;

    @Field()
    @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }, { message: "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole et faire au moins 8 caractères" })
    password!: string;

    @Field()
    @IsNotEmpty({ message: "La confirmation du mot de passe ne doit pas être vide" })
    @ValidateIf(o => o.password !== undefined)
    @Match("password", { message: "La confirmation du mot de passe doit correspondre au mot de passe" })
    passwordConfirm!: string;
}

@InputType()
export class CreateUserByAdminDto extends CreateUserDto {
    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Le prénom doit contenir entre 2 et 20 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    firstname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Le nom doit contenir entre 2 et 20 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    lastname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/, { message: "Le numéro de téléphone doit être un numéro français valide" })
    @Transform(({ value }) => (typeof value === "string" ? value.replace(/\s|\-/g, "") : value))
    phoneNumber?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(5, 250, { message: "L'adresse doit contenir au moins 5 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 50, { message: "La ville doit contenir entre 2 et 50 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    city?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^\d{5}$/, { message: "Le code postal doit être un code français à 5 chiffres" })
    postalCode?: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    roleId?: number;
}

@InputType()
export class UpdateUserDto {
    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Le prénom doit contenir entre 2 et 20 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    firstname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Le nom doit contenir entre 2 et 20 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    lastname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/, { message: "Le numéro de téléphone doit être un numéro français valide" })
    @Transform(({ value }) => (typeof value === "string" ? value.replace(/\s|\-/g, "") : value))
    phoneNumber?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail({}, { message: "L'email doit être valide" })
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(5, 250, { message: "L'adresse doit contenir au moins 5 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 50, { message: "La ville doit contenir entre 2 et 50 caractères" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    city?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^\d{5}$/, { message: "Le code postal doit être un code français à 5 chiffres" })
    postalCode?: string;
}

@InputType()
export class UpdateUserByAdminDto extends UpdateUserDto {
    @Field(() => ID, { nullable: true })
    @IsOptional()
    roleId?: number;
}

@InputType()
export class UpdateUserPasswordDto {
    @Field()
    @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }, { message: "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 symbole et faire au moins 8 caractères" })
    password!: string;

    @Field()
    @IsNotEmpty({ message: "La confirmation du mot de passe ne doit pas être vide" })
    @ValidateIf(o => o.password !== undefined)
    @Match("password", { message: "La confirmation du mot de passe doit correspondre au mot de passe" })
    passwordConfirm!: string;
}

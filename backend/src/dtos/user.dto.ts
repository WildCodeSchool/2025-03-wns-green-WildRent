import { Field, ID, InputType } from "type-graphql";
import { IsEmail, IsNotEmpty, Length, Matches, MinLength, IsOptional, IsStrongPassword, ValidateIf, Equals, IsInt } from "class-validator";
import { Transform, Type  } from "class-transformer";
import { Match } from "../validators/match.validator";

@InputType()
export class CreateUserDto {
    @Field()
    @IsEmail({}, { message: "Email must be valid" })
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email!: string;

    @Field()
    @IsNotEmpty({ message: "Password must not be empty" })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }, { message: "The password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 symbol and be at least 8 characters long" })
    password!: string;

    @Field()
    @IsNotEmpty({ message: "Password confirmation must not be empty" })
    @ValidateIf(o => o.password !== undefined)
    @Match("password", { message: "Password confirmation must match password" })
    passwordConfirm!: string;
}

@InputType()
export class CreateUserByAdminDto extends CreateUserDto {
    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Firstname must be between 2 and 20 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    firstname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Lastname must be between 2 and 20 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    lastname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/, { message: "Phone number must be a valid French number" })
    @Transform(({ value }) => (typeof value === "string" ? value.replace(/\s|\-/g, "") : value))
    phoneNumber?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(5, 250, { message: "Address must be at least 5 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 50, { message: "City must be between 2 and 50 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    city?: string;

    @Field(() => ID, { nullable: true })
    @IsOptional()
    roleId?: number;
}

@InputType()
export class UpdateUserDto {
    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Firstname must be between 2 and 20 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    firstname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 20, { message: "Lastname must be between 2 and 20 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    lastname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(/^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/, { message: "Phone number must be a valid French number" })
    @Transform(({ value }) => (typeof value === "string" ? value.replace(/\s|\-/g, "") : value))
    phoneNumber?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail({}, { message: "Email must be valid" })
    @Transform(({ value }) => (typeof value === "string" ? value.toLowerCase().trim() : value))
    email?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(5, 250, { message: "Address must be at least 5 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    address?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Length(2, 50, { message: "City must be between 2 and 50 characters" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    city?: string;
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
    @IsNotEmpty({ message: "Password must not be empty" })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }, { message: "The password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 symbol and be at least 8 characters long" })
    password!: string;

    @Field()
    @IsNotEmpty({ message: "Password confirmation must not be empty" })
    @ValidateIf(o => o.password !== undefined)
    @Match("password", { message: "Password confirmation must match password" })
    passwordConfirm!: string;
}

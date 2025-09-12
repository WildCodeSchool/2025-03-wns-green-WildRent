import { GraphQLJSONObject } from "graphql-scalars";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { UserService } from "../services/user.service";
import { AnonContext, BaseContext, UserToken } from "../types/types";
import { User } from "../entities/User";

function getUserTokenContent(user: User): UserToken{
  return {
    mail: user.email,
    firstName: user.firstname,
    lastName: user.lastname
  }
};

function getUserPublicProfil(user: User) {
  return {
    id: user.id,
    firstName: user.firstname,
    lastName: user.lastname
  }
};

function setCookie(context: AnonContext, tokenName: string, tokenValue: string) {
  context.res.setHeader(
    "Set-Cookie",
    `${tokenName}=${tokenValue};secure;httpOnly;SameSite=strict`
  );
};

@InputType()
export class LoginInput {
  @Field()
  mail!: string;

  @Field()
  password!: string;
}

@Resolver()
export default class AuthResolver {

  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  @Mutation(() => GraphQLJSONObject)
  async login(@Arg("data") data: LoginInput, @Ctx() context: AnonContext){
    try {
      if(!process.env.JWT_SECRET) throw new Error("Clé secrète manquante");

      const user = await this.userService.findByMail(data.mail);
      if(!user) throw new Error("Utilisateur introuvable");

      const isValid = await argon2.verify(user.password, data.password);
      if(!isValid) throw new Error("Mot de passe incorrecte");

      const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);

      setCookie(context, "WildRentAuthToken", token);

      return getUserPublicProfil(user);

    } catch (err: any) {
      throw new Error(`Failed to login: ${err.message}`);
    }

}};

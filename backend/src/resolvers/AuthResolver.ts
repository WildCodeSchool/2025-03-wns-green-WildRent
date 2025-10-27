import * as jwt from "jsonwebtoken";
import argon2 from "argon2";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { UserService } from "../services/user.service";
import { AnonContext, UserToken } from "../types/types";
import { User } from "../entities/User";

function getUserTokenContent(user: User): UserToken{
  return {
    mail: user.email,
    firstName: user.firstname,
    lastName: user.lastname
  }
};

function getUserPublicProfil(user: User) {
  console.log("Information sur l'utilisateur: " + JSON.stringify(user))
  return {
    name: user.firstname,
  }
};

function setCookie(context: AnonContext, tokenName: string, tokenValue: string) {
  context.res.setHeader(
    "Set-Cookie",
    `${tokenName}=${tokenValue};secure;httpOnly;SameSite=strict`
  );
  console.log("HEADER: " + JSON.stringify(context.res.getHeaders()))
};

@InputType()
export class LoginInput {
  @Field()
  mail!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class UserLogin {
  @Field()
  name!: string;
}

@Resolver()
export default class AuthResolver {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }
    @Mutation(() => UserLogin)
    async login(@Arg("data") data: LoginInput, @Ctx() context: AnonContext){
      try {
        if(!process.env.JWT_SECRET) throw new Error("Clé secrète manquante");

        const user = await this.userService.findByMail(data.mail);
        console.log("user trouvé :", user);
        if(!user) throw new Error("Utilisateur introuvable");

        const isValid = await argon2.verify(user.password, data.password);
        if(!isValid) throw new Error("Mot de passe incorrecte");

        const token = jwt.sign(getUserTokenContent(user), process.env.JWT_SECRET);

        setCookie(context, "WildRentAuthToken", token);

        return getUserPublicProfil(user);

      } catch (err: any) {
        throw new Error(`Failed to login: ${err.message}`);
      }
    };

    async logout(){

    };
};

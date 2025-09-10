import { Field, InputType, Resolver } from "type-graphql";
import { User } from "../entities/User";

@InputType()
export class LoginInput {
  @Field()
  mail!: string;

  @Field()
  password!: string;
}

@Resolver(User)
export default class AuthResolver {    
}; 
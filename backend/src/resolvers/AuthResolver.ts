import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  mail!: string;

  @Field()
  password!: string;
}

@Resolver()
export default class AuthResolver { 
    @Mutation(() => String) 
    async login(@Arg("data") data: LoginInput): Promise<string> {
        return "login ok"
    }
}; 
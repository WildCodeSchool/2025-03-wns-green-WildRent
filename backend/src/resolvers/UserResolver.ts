import { Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";

@InputType()
export class NewUserInput implements Partial<User> {
  @Field()
  mail!: string;

  @Field()
  password!: string;

  @Field()
  name!: string;
}

@InputType()
export class UserInput {
  @Field()
  mail!: string;

  @Field()
  password!: string;
}

@Resolver(User)
export default class UserResolver {
    @Query(() => [User])
    async getAllUsers() {
        const allUsers = await User.find(); 
        return allUsers;
    }

    @Mutation(() => String)
    async signup() {
        
    }
}; 
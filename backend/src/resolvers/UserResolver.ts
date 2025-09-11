import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserService } from "../services/user.service";

@InputType()
export class NewUserInput implements Partial<User> {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  name!: string;
}
@Resolver(User)
export default class UserResolver {
  private readonly userService = new UserService();
  @Query(() => [User])
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Mutation(() => String)
  async signup(@Arg("data") data: NewUserInput): Promise<string> {
    return this.userService.signup({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  }
}

import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserService } from "../services/user.service";

@InputType()
export class NewUserInput implements Partial<User> {

  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  phoneNumber!: number;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  address!: string;

  @Field()
  city!: string;

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
      firstname: data.firstname,
      lastname: data.lastname,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
      address: data.address,
      city: data.city,
    });
  }
}

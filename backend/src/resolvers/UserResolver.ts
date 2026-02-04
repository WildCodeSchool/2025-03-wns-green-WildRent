import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserService } from "../services/user.service";
import { CreateUserDto, CreateUserByAdminDto, UpdateUserDto, UpdateUserByAdminDto, UpdateUserPasswordDto } from "../dtos/user.dto";

@Resolver(User)
export default class UserResolver {
  private readonly userService = new UserService();

    @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserDto): Promise<User> {
    return this.userService.createUser(data);
  }

  @Mutation(() => User)
  async createUserByAdmin(@Arg("data") data: CreateUserByAdminDto): Promise<User> {
    return this.userService.createUserByAdmin(data);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => ID) id: number): Promise<boolean> {
    return this.userService.deleteUser(id);
  }


  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query(() => User)
  async getUserById(@Arg("id", () => Number) id: number): Promise<User> {
    return this.userService.getUserById(id); ;
  }

    @Mutation(() => User)
  async updateUser(@Arg("id", () => ID) id: number, @Arg("data") data: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => User)
  async updateUserByAdmin(@Arg("id", () => ID) id: number,@Arg("data") data: UpdateUserByAdminDto
  ): Promise<User> {
    return this.userService.updateUserByAdmin(id, data);
  }

  @Mutation(() => Boolean)
  async updateUserPassword(@Arg("id", () => ID) id: number,@Arg("data") data: UpdateUserPasswordDto
  ): Promise<boolean> {
    return this.userService.updateUserPassword(id, data);
  }

}

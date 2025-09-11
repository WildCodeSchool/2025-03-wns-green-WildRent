import argon2 from "argon2";
import { User } from "../entities/User";
import { NewUserInput } from "../resolvers/UserResolver";

export class UserService {
  async signup(data: NewUserInput): Promise<string> {
    if (!data.name.trim() || !data.password.trim() || !data.email.trim()) {
      throw new Error("INVALID_INPUT");
    }

    const hashed = await argon2.hash(data.password);
    // const user = User.create({
    //   firstname: data.name,
    //   lastname: "",
    //   phoneNumber: 0,
    //   email: data.email,
    //   password: hashed,
    //   address: "",
    //   city: "",
    // } as unknown as User);

    const user = User.create({
      firstname: data.name,
      email: data.email,
      password: hashed,
    });

    await user.save();

    return "USER_CREATED";
  }

  async getAllUsers(): Promise<User[]> {
    return User.find();
  }
}

import argon2 from "argon2";
import { User } from "../entities/User";
import { NewUserInput } from "../resolvers/UserResolver";
import { Role } from "../entities/Role";

const DEFAULT_ROLE = "USER";

export class UserService {
  async signup(data: NewUserInput): Promise<string> {
    if (
      !data.firstname.trim() ||
      !data.lastname.trim() ||
      !data.password.trim() ||
      !data.email.trim()
    ) {
      throw new Error("INVALID_INPUT");
    }

    const hashed = await argon2.hash(data.password);

    let role = await Role.findOne({ where: { roleName: DEFAULT_ROLE } });
    if (!role) {
      role = Role.create({ roleName: DEFAULT_ROLE });
      await role.save();
    }

    const user = User.create({
      firstname: data.firstname,
      lastname: data.lastname,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: hashed,
      address: data.address,
      city: data.city,
      role,
    });

    await user.save();

    return "USER_CREATED";
  }

  async getAllUsers(): Promise<User[]> {
    return User.find({ relations: ["role"] });
  }

  async findByMail(email: string): Promise<User | null> {
    return User.findOne({
      select:["email", "password", "firstname"],
      where: { "email": email }
    });
  }
}

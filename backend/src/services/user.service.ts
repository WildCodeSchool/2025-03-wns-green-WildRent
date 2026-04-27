import argon2 from "argon2";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import {
  CreateUserDto,
  CreateUserByAdminDto,
  UpdateUserDto,
  UpdateUserByAdminDto,
  UpdateUserPasswordDto,
} from "../dtos/user.dto";
import { Errors } from "../errors/errors";

const DEFAULT_ROLE = "user";

const DEFAULT_VALUES = {
  firstname: "non renseigné",
  lastname: "non renseigné",
  phoneNumber: "0000000000",
  address: "non renseigné",
  city: "non renseigné",
  postalCode: "00000",
} as const;

export class UserService {
  /**
   * Creates a standard user (registration).
   * Only email and password are required, other fields use default values.
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) throw Errors.alreadyExists("User");

    const hashedPassword = await argon2.hash(data.password);
    const defaultRole = await Role.findOne({ where: { roleName: DEFAULT_ROLE } });
    if (!defaultRole) throw Errors.notFound("Role");

    const user = User.create({
      email: data.email,
      password: hashedPassword,
      ...DEFAULT_VALUES,
      role: defaultRole,
    });

    await user.save();
    return user;
  }

  /**
   * Creates a user as an administrator.
   * Allows setting all fields and assigning a specific role.
   */
  async createUserByAdmin(data: CreateUserByAdminDto): Promise<User> {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) throw Errors.alreadyExists("User");

    const hashedPassword = await argon2.hash(data.password);

    const role = data.roleId
      ? await Role.findOne({ where: { id: data.roleId } })
      : await Role.findOne({ where: { roleName: DEFAULT_ROLE } });

    if (!role) throw Errors.notFound("Role");

    const user = User.create({
      email: data.email,
      password: hashedPassword,
      firstname: data.firstname ?? DEFAULT_VALUES.firstname,
      lastname: data.lastname ?? DEFAULT_VALUES.lastname,
      phoneNumber: data.phoneNumber ?? DEFAULT_VALUES.phoneNumber,
      address: data.address ?? DEFAULT_VALUES.address,
      city: data.city ?? DEFAULT_VALUES.city,
      postalCode: data.postalCode ?? DEFAULT_VALUES.postalCode,
      role,
    });

    await user.save();
    return user;
  }

  /** Deletes a user by ID. */
  async deleteUser(id: number): Promise<boolean> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw Errors.notFound("User");

    await User.remove(user);
    return true;
  }

  /** Finds a user by email (used for authentication). */
  async findByMail(email: string): Promise<User | null> {
    return User.findOne({
      select: ["id", "email", "password", "firstname", "lastname"],
      where: { email },
      relations: ["role"],
    });
  }

  /** Returns all users with their role. */
  async getAllUsers(): Promise<User[]> {
    return User.find({ relations: ["role"] });
  }

  /** Returns a user by ID with their role. */
  async getUserById(id: number): Promise<User> {
    const user = await User.findOne({ where: { id }, relations: ["role"] });
    if (!user) throw Errors.notFound("User");
    return user;
  }

  /** Updates a user's information (by the user themselves). */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw Errors.notFound("User");

    Object.assign(user, data);
    await user.save();

    return user;
  }

  /** Updates a user as an administrator (can change role). */
  async updateUserByAdmin(id: number, data: UpdateUserByAdminDto): Promise<User> {
    const user = await User.findOne({ where: { id }, relations: ["role"] });
    if (!user) throw Errors.notFound("User");

    const role = data.roleId
      ? await Role.findOne({ where: { id: data.roleId } })
      : user.role;

    if (!role) throw Errors.notFound("Role");
    user.role = role;

    Object.assign(user, data);
    await user.save();

    return user;
  }

  /** Updates a user's password. */
  async updateUserPassword(id: number, data: UpdateUserPasswordDto): Promise<boolean> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw Errors.notFound("User");

    user.password = await argon2.hash(data.password);
    await user.save();

    return true;
  }
}

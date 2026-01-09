import argon2 from "argon2";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { CreateUserDto,CreateUserByAdminDto,UpdateUserDto,UpdateUserByAdminDto,UpdateUserPasswordDto } from "../dtos/user.dto";
import { Errors } from "../errors/errors";


const DEFAULT_ROLE = "user";
export class UserService {
  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) throw Errors.alreadyExists("User");

    const hashedPassword = await argon2.hash(data.password);
    let DefaultRole = await Role.findOne({ where: { roleName: DEFAULT_ROLE } });
    if (!DefaultRole) throw Errors.notFound("Role");

    const user = User.create({
      email: data.email,
      password: hashedPassword,
      firstname: "non renseignée",
      lastname: "non renseignée",
      phoneNumber: "0000000000",
      address: "non renseignée",
      city: "non renseignée",
      role: DefaultRole,
    });

    await user.save();
    return user;
  }

  async createUserByAdmin(data: CreateUserByAdminDto): Promise<User> {
    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) throw Errors.alreadyExists("User");

    const hashedPassword = await argon2.hash(data.password);
    
    const role = data.roleId 
      ? await Role.findOne({ where: { id: data.roleId } })
      : await Role.findOne({ where: { roleName: DEFAULT_ROLE } });

    if (!role) throw Errors.notFound("Role");

    const user = User.create({
      email: data.email,
      password: hashedPassword,
      firstname: data.firstname ?? "non renseignée",
      lastname: data.lastname ?? "non renseignée",
      phoneNumber: data.phoneNumber ?? "0000000000",
      address: data.address ?? "non renseignée",
      city: data.city ?? "non renseignée",
      role: role,
    });

    await user.save();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw Errors.notFound("User");

    await User.remove(user);
    return true;
  }

  async findByMail(email: string): Promise<User | null> {
    return User.findOne({
      select: ["id", "email", "password", "firstname", "lastname"],
      where: { "email": email },
      relations: ["role"],
    });
  }

  async getAllUsers(): Promise<User[]> {
    return User.find({ relations: ["role"] });
  }

    async getUserById(id: number): Promise<User> {
    const user = await User.findOne({ where: { id }, relations: ["role"] });
    if (!user) throw Errors.notFound("User");
    return user;
  }

    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw Errors.notFound("User");

    Object.assign(user, data);
    await user.save();

    return user;
  }

    async updateUserByAdmin(id: number, data: UpdateUserByAdminDto): Promise<User> {
    const user = await User.findOne({ where: { id }, relations: ["role"] });
    if (!user) throw Errors.notFound("User");

  const role = data.roleId 
      ? await Role.findOne({ where: { id: data.roleId } })
      : await Role.findOne({ where: { roleName: DEFAULT_ROLE } });

    if (!role) throw Errors.notFound("Role");
    user.role = role;

    Object.assign(user, data);
    await user.save();

    return user;
  }

  async updateUserPassword(id: number, data: UpdateUserPasswordDto): Promise<boolean> {
    const user = await User.findOne({ where: { id } });
    if (!user) throw Errors.notFound("User");

    user.password = await argon2.hash(data.password);
    await user.save();

    return true;
  }

}

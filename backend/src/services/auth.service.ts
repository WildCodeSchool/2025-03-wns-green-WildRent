import * as jwt from "jsonwebtoken";
import argon2 from "argon2";
import { User } from "../entities/User";
import { UserService } from "./user.service";
import { Errors } from "../errors/errors";
import { UserToken } from "../types/types";

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  /**
   * Authenticates a user by email and password.
   * Returns a signed JWT token if credentials are valid.
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.userService.findByMail(email);
    if (!user) throw Errors.mustRegister();

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) throw Errors.invalidCredentials();

    const token = this.generateToken(user);
    return { token, user };
  }

  /**
   * Verifies a user's password against the stored hash.
   * Used for sensitive operations like account deletion.
   */
  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.userService.findByMail(
      (await this.userService.getUserById(userId)).email
    );
    if (!user) throw Errors.notFound("User");

    return argon2.verify(user.password, password);
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   * Returns null if the token is invalid or expired.
   */
  verifyToken(token: string): UserToken | null {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) return null;

      return jwt.verify(token, secret) as UserToken;
    } catch {
      return null;
    }
  }

  /**
   * Generates a JWT token for a given user.
   */
  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const payload: UserToken = {
      id: user.id,
      mail: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      role: user.role.roleName,
    };

    return jwt.sign(payload, secret, { expiresIn: "24h" });
  }
}

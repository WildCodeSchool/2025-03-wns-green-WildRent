import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { AnonContext, AuthContext } from "../types/types";
import { Errors } from "../errors/errors";
import { User } from "../entities/User";
import { LoginDto, DeleteAccountDto } from "../dtos/auth.dto";
import { UpdateUserDto } from "../dtos/user.dto";

const COOKIE_NAME = "WildRentAuthToken";
const isProduction = process.env.NODE_ENV === "production";

/** Builds cookie attributes based on environment. */
function buildCookieAttributes(maxAge: number): string {
  const attrs = [`HttpOnly`, `SameSite=None`, `Path=/`, `Max-Age=${maxAge}`, `Secure`];
  if (!isProduction) {
    return [`HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=${maxAge}`].join("; ");
  }
  return attrs.join("; ");
}

/** Sets an HTTP-only cookie on the response. */
function setCookie(context: AnonContext, name: string, value: string) {
  context.res.setHeader(
    "Set-Cookie",
    `${name}=${value}; ${buildCookieAttributes(86400)}`
  );
}

/** Clears an HTTP-only cookie from the response. */
function clearCookie(context: AnonContext | AuthContext, name: string) {
  context.res.setHeader(
    "Set-Cookie",
    `${name}=; ${buildCookieAttributes(0)}`
  );
}

@ObjectType()
export class UserLogin {
  @Field()
  id!: number;

  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;
}

@Resolver()
export default class AuthResolver {
  private authService: AuthService;
  private userService: UserService;

  constructor(
    authService: AuthService = new AuthService(),
    userService: UserService = new UserService(),
  ) {
    this.authService = authService;
    this.userService = userService;
  }

  /** Authenticates a user and sets a JWT cookie. */
  @Mutation(() => UserLogin)
  async login(@Arg("data") data: LoginDto, @Ctx() context: AnonContext): Promise<UserLogin> {
    const { token, user } = await this.authService.login(data.mail, data.password);

    setCookie(context, COOKIE_NAME, token);

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role.roleName,
    };
  }

  /** Clears the JWT cookie (logout). */
  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() context: AnonContext | AuthContext): Promise<boolean> {
    clearCookie(context, COOKIE_NAME);
    return true;
  }

  /** Returns the currently authenticated user, or throws if not connected. */
  @Authorized()
  @Query(() => User)
  async whoAmI(@Ctx() context: AuthContext): Promise<User> {
    return this.userService.getUserById(context.user.id);
  }

  /** Updates the authenticated user's profile using the ID from the JWT. */
  @Authorized()
  @Mutation(() => User)
  async updateMyProfile(
    @Arg("data") data: UpdateUserDto,
    @Ctx() context: AuthContext,
  ): Promise<User> {
    return this.userService.updateUser(context.user.id, data);
  }

  /** Deletes the authenticated user's account after password verification. */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteMyAccount(
    @Arg("data") data: DeleteAccountDto,
    @Ctx() context: AuthContext,
  ): Promise<boolean> {
    const isValid = await this.authService.verifyPassword(context.user.id, data.password);
    if (!isValid) throw Errors.invalidCredentials();

    await this.userService.deleteUser(context.user.id);
    clearCookie(context, COOKIE_NAME);

    return true;
  }
}

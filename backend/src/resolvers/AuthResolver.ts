import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { IsEmail, IsNotEmpty } from "class-validator";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { AnonContext, AuthContext } from "../types/types";
import { Errors } from "../errors/errors";
import { User } from "../entities/User";

const COOKIE_NAME = "WildRentAuthToken";
const isProduction = process.env.NODE_ENV === "production";

/** Builds cookie attributes based on environment. */
function buildCookieAttributes(maxAge: number): string {
  const attrs = [`HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=${maxAge}`];
  if (isProduction) attrs.push("Secure");
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

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: "L'email doit être valide" })
  mail!: string;

  @Field()
  @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
  password!: string;
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
  async login(@Arg("data") data: LoginInput, @Ctx() context: AnonContext): Promise<UserLogin> {
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
  @Mutation(() => Boolean)
  async logout(@Ctx() context: AnonContext | AuthContext): Promise<boolean> {
    clearCookie(context, COOKIE_NAME);
    return true;
  }

  /** Returns the currently authenticated user, or throws if not connected. */
  @Query(() => User)
  async whoAmI(@Ctx() context: AnonContext | AuthContext): Promise<User> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.userService.getUserById(userToken.id);
  }
}

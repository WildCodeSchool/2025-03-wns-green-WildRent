import { AuthCheckerFn } from "type-graphql";
import { AnonContext, AuthContext } from "../types/types";
import { Errors } from "../errors/errors";

/**
 * Custom auth checker for type-graphql @Authorized() decorator.
 *
 * - @Authorized()          → requires any authenticated user
 * - @Authorized("admin")   → requires admin role
 * - @Authorized("admin", "manager") → requires admin OR manager role
 *
 * Throws typed AppErrors so the customErrorFormatter can return
 * proper NOT_AUTHENTICATED / UNAUTHORIZED codes to the client.
 */
export const authChecker: AuthCheckerFn<AnonContext | AuthContext> = (
  { context },
  roles,
) => {
  const user = (context as AuthContext).user;

  if (!user) throw Errors.notAuthenticated();
  if (roles.length === 0) return true;
  if (!roles.includes(user.role)) throw Errors.unauthorized();

  return true;
};

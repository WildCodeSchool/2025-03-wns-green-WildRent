import { AuthChecker } from "type-graphql";
import { AnonContext, AuthContext } from "../types/types";

/**
 * Custom auth checker for type-graphql @Authorized() decorator.
 *
 * - @Authorized()          → requires any authenticated user
 * - @Authorized("admin")   → requires admin role
 * - @Authorized("admin", "manager") → requires admin OR manager role
 */
export const authChecker: AuthChecker<AnonContext | AuthContext> = (
  { context },
  roles,
) => {
  const user = (context as AuthContext).user;

  // No token → not authenticated
  if (!user) return false;

  // No roles specified → just needs to be logged in
  if (roles.length === 0) return true;

  // Check if user's role matches any of the required roles
  return roles.includes(user.role);
};

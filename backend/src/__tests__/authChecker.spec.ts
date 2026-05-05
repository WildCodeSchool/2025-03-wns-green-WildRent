import { authChecker } from "../auth/authChecker";
import { AuthContext, AnonContext } from "../types/types";

/** Helper to build a minimal ResolverData object for authChecker */
function buildResolverData(context: AnonContext | AuthContext) {
  return { context } as Parameters<typeof authChecker>[0];
}

describe("authChecker", () => {
  const authenticatedContext: AuthContext = {
    req: {} as AuthContext["req"],
    res: {} as AuthContext["res"],
    user: {
      id: 1,
      mail: "user@test.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
    },
  };

  const adminContext: AuthContext = {
    req: {} as AuthContext["req"],
    res: {} as AuthContext["res"],
    user: {
      id: 2,
      mail: "admin@test.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
  };

  const anonymousContext: AnonContext = {
    req: {} as AnonContext["req"],
    res: {} as AnonContext["res"],
  };

  it("should throw NOT_AUTHENTICATED when no user token is present", () => {
    expect(() => authChecker(buildResolverData(anonymousContext), [])).toThrow(
      "Vous devez être connecté pour accéder à cette ressource",
    );
  });

  it("should allow authenticated user with no roles required", () => {
    const result = authChecker(buildResolverData(authenticatedContext), []);
    expect(result).toBe(true);
  });

  it("should throw UNAUTHORIZED when user role does not match", () => {
    expect(() => authChecker(buildResolverData(authenticatedContext), ["admin"])).toThrow(
      "Vous n'êtes pas autorisé",
    );
  });

  it("should allow admin user when admin role is required", () => {
    const result = authChecker(buildResolverData(adminContext), ["admin"]);
    expect(result).toBe(true);
  });

  it("should allow user when their role is in the allowed list", () => {
    const result = authChecker(buildResolverData(authenticatedContext), ["user", "admin"]);
    expect(result).toBe(true);
  });

  it("should throw NOT_AUTHENTICATED even when roles are specified", () => {
    expect(() => authChecker(buildResolverData(anonymousContext), ["admin"])).toThrow(
      "Vous devez être connecté pour accéder à cette ressource",
    );
  });
});

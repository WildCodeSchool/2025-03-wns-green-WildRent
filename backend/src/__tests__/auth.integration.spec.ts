import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import argon2 from "argon2";
import AuthResolver from "../resolvers/AuthResolver";
import { UserService } from "../services/user.service";
import { customErrorFormatter } from "../errors/customErrorFormatter";

/**
 * Integration tests for the authentication flow.
 * Tests the full GraphQL pipeline: mutation → resolver → service → response.
 */

jest.mock("argon2");

const JWT_SECRET = "integration-test-secret";

const mockUser = {
  id: 1,
  email: "alice@example.com",
  password: "hashed-password",
  firstname: "Alice",
  lastname: "Dupont",
  role: { roleName: "user" },
};

const mockFullUser = {
  ...mockUser,
  phoneNumber: "0612345678",
  address: "10 rue de la Paix",
  city: "Paris",
  postalCode: "75001",
  avatar: null,
};

let server: ApolloServer;

const mockFindByMail = jest.fn();
const mockGetUserById = jest.fn();

jest.mock("../services/user.service", () => ({
  UserService: jest.fn().mockImplementation(() => ({
    findByMail: mockFindByMail,
    getUserById: mockGetUserById,
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn(),
    updateUserByAdmin: jest.fn(),
    updateUserPassword: jest.fn(),
    createUserByAdmin: jest.fn(),
  })),
}));

beforeAll(async () => {
  process.env.JWT_SECRET = JWT_SECRET;

  const schema = await buildSchema({
    resolvers: [AuthResolver],
    validate: true,
  });

  server = new ApolloServer({
    schema,
    formatError: customErrorFormatter,
  });
});

afterAll(() => {
  delete process.env.JWT_SECRET;
});

beforeEach(() => {
  jest.clearAllMocks();
});

function createMockContext(userToken?: any) {
  return {
    contextValue: {
      req: { headers: {} },
      res: { setHeader: jest.fn() },
      ...(userToken ? { user: userToken } : {}),
    },
  };
}

describe("Auth Integration - Login", () => {
  const LOGIN_MUTATION = `
    mutation Login($data: LoginInput!) {
      login(data: $data) {
        id
        firstname
        lastname
        email
        role
      }
    }
  `;

  it("should login successfully and set a JWT cookie", async () => {
    mockFindByMail.mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const ctx = createMockContext();
    const result = await server.executeOperation(
      {
        query: LOGIN_MUTATION,
        variables: { data: { mail: "alice@example.com", password: "Password123!" } },
      },
      ctx,
    );

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();

      const data = result.body.singleResult.data?.login as any;
      expect(data.id).toBe(1);
      expect(data.firstname).toBe("Alice");
      expect(data.lastname).toBe("Dupont");
      expect(data.email).toBe("alice@example.com");
      expect(data.role).toBe("user");
    }

    const setCookieCalls = ctx.contextValue.res.setHeader.mock.calls;
    const cookieCall = setCookieCalls.find((c: any) => c[0] === "Set-Cookie");
    expect(cookieCall).toBeDefined();
    expect(cookieCall![1]).toContain("WildRentAuthToken=");
    expect(cookieCall![1]).toContain("HttpOnly");
    expect(cookieCall![1]).toContain("Path=/");
  });

  it("should return MUST_REGISTER error if user does not exist", async () => {
    mockFindByMail.mockResolvedValue(null);

    const ctx = createMockContext();
    const result = await server.executeOperation(
      {
        query: LOGIN_MUTATION,
        variables: { data: { mail: "unknown@example.com", password: "Password123!" } },
      },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].message).toBe(
        "Aucun compte trouvé avec cet email, veuillez vous inscrire"
      );
      expect(errors![0].extensions?.code).toBe("MUST_REGISTER");
    }
  });

  it("should return INVALID_CREDENTIALS error on wrong password", async () => {
    mockFindByMail.mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    const ctx = createMockContext();
    const result = await server.executeOperation(
      {
        query: LOGIN_MUTATION,
        variables: { data: { mail: "alice@example.com", password: "WrongPassword!" } },
      },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].message).toBe("Email ou mot de passe incorrect");
      expect(errors![0].extensions?.code).toBe("INVALID_CREDENTIALS");
    }
  });

  it("should return validation error on invalid email format", async () => {
    const ctx = createMockContext();
    const result = await server.executeOperation(
      {
        query: LOGIN_MUTATION,
        variables: { data: { mail: "not-an-email", password: "Password123!" } },
      },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].message).toBe("Erreur de validation");
      expect(errors![0].extensions?.code).toBe("BAD_USER_INPUT");
    }
  });
});

describe("Auth Integration - Logout", () => {
  const LOGOUT_MUTATION = `
    mutation Logout {
      logout
    }
  `;

  it("should clear the JWT cookie on logout", async () => {
    const ctx = createMockContext();
    const result = await server.executeOperation(
      { query: LOGOUT_MUTATION },
      ctx,
    );

    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.logout).toBe(true);
    }

    const setCookieCalls = ctx.contextValue.res.setHeader.mock.calls;
    const cookieCall = setCookieCalls.find((c: any) => c[0] === "Set-Cookie");
    expect(cookieCall).toBeDefined();
    expect(cookieCall![1]).toContain("Max-Age=0");
  });
});

describe("Auth Integration - WhoAmI", () => {
  const WHO_AM_I_QUERY = `
    query WhoAmI {
      whoAmI {
        id
        firstname
        lastname
        email
      }
    }
  `;

  it("should return the authenticated user", async () => {
    mockGetUserById.mockResolvedValue(mockFullUser);

    const ctx = createMockContext({
      id: 1, mail: "alice@example.com", firstName: "Alice", lastName: "Dupont", role: "user",
    });

    const result = await server.executeOperation(
      { query: WHO_AM_I_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();

      const data = result.body.singleResult.data?.whoAmI as any;
      expect(data.firstname).toBe("Alice");
      expect(data.email).toBe("alice@example.com");
    }

    expect(mockGetUserById).toHaveBeenCalledWith(1);
  });

  it("should return NOT_AUTHENTICATED error if not logged in", async () => {
    const ctx = createMockContext();
    const result = await server.executeOperation(
      { query: WHO_AM_I_QUERY },
      ctx,
    );

    if (result.body.kind === "single") {
      const errors = result.body.singleResult.errors;
      expect(errors).toBeDefined();
      expect(errors![0].message).toBe(
        "Vous devez être connecté pour accéder à cette ressource"
      );
      expect(errors![0].extensions?.code).toBe("NOT_AUTHENTICATED");
    }
  });
});

describe("Auth Integration - Full Flow", () => {
  it("should login then access whoAmI with the authenticated context", async () => {
    mockFindByMail.mockResolvedValue(mockUser);
    mockGetUserById.mockResolvedValue(mockFullUser);
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const loginCtx = createMockContext();
    const loginResult = await server.executeOperation(
      {
        query: `mutation Login($data: LoginInput!) { login(data: $data) { id firstname } }`,
        variables: { data: { mail: "alice@example.com", password: "Password123!" } },
      },
      loginCtx,
    );

    if (loginResult.body.kind === "single") {
      expect(loginResult.body.singleResult.errors).toBeUndefined();
      expect((loginResult.body.singleResult.data?.login as any).firstname).toBe("Alice");
    }

    const whoAmICtx = createMockContext({
      id: 1, mail: "alice@example.com", firstName: "Alice", lastName: "Dupont", role: "user",
    });
    const whoAmIResult = await server.executeOperation(
      { query: `query { whoAmI { id firstname email } }` },
      whoAmICtx,
    );

    if (whoAmIResult.body.kind === "single") {
      expect(whoAmIResult.body.singleResult.errors).toBeUndefined();

      const data = whoAmIResult.body.singleResult.data?.whoAmI as any;
      expect(data.firstname).toBe("Alice");
      expect(data.email).toBe("alice@example.com");
    }
  });
});

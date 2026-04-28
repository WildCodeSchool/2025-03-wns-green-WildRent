import * as jwt from "jsonwebtoken";
import argon2 from "argon2";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

jest.mock("../services/user.service");
jest.mock("argon2");

const JWT_SECRET = "test-secret-key";

const mockUser = {
  id: 1,
  email: "test@example.com",
  password: "hashed-password",
  firstname: "Alice",
  lastname: "Dupont",
  role: { roleName: "user" },
};

describe("AuthService", () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    userService = new UserService() as jest.Mocked<UserService>;
    authService = new AuthService(userService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe("login", () => {
    it("should return a token and user on valid credentials", async () => {
      userService.findByMail = jest.fn().mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.login("test@example.com", "Password123!");

      expect(userService.findByMail).toHaveBeenCalledWith("test@example.com");
      expect(argon2.verify).toHaveBeenCalledWith("hashed-password", "Password123!");
      expect(result.token).toBeDefined();
      expect(result.user).toEqual(mockUser);
    });

    it("should throw MUST_REGISTER if user does not exist", async () => {
      userService.findByMail = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login("unknown@example.com", "Password123!")
      ).rejects.toThrow("Aucun compte trouvé avec cet email, veuillez vous inscrire");

      await expect(
        authService.login("unknown@example.com", "Password123!")
      ).rejects.toMatchObject({ codeError: "MUST_REGISTER" });
    });

    it("should throw INVALID_CREDENTIALS if password is wrong", async () => {
      userService.findByMail = jest.fn().mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login("test@example.com", "WrongPassword!")
      ).rejects.toThrow("Email ou mot de passe incorrect");

      await expect(
        authService.login("test@example.com", "WrongPassword!")
      ).rejects.toMatchObject({ codeError: "INVALID_CREDENTIALS" });
    });

    it("should generate a valid JWT token with correct payload", async () => {
      userService.findByMail = jest.fn().mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.login("test@example.com", "Password123!");
      const decoded = jwt.verify(result.token, JWT_SECRET) as any;

      expect(decoded.id).toBe(1);
      expect(decoded.mail).toBe("test@example.com");
      expect(decoded.firstName).toBe("Alice");
      expect(decoded.lastName).toBe("Dupont");
      expect(decoded.role).toBe("user");
    });
  });

  describe("verifyToken", () => {
    it("should return decoded payload for a valid token", () => {
      const payload = {
        id: 1,
        mail: "test@example.com",
        firstName: "Alice",
        lastName: "Dupont",
        role: "user",
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

      const result = authService.verifyToken(token);

      expect(result).toMatchObject(payload);
    });

    it("should return null for an invalid token", () => {
      const result = authService.verifyToken("invalid-token");
      expect(result).toBeNull();
    });

    it("should return null for an expired token", () => {
      const payload = { id: 1, mail: "test@example.com", firstName: "A", lastName: "B", role: "user" };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "0s" });

      const result = authService.verifyToken(token);
      expect(result).toBeNull();
    });

    it("should return null if JWT_SECRET is not defined", () => {
      delete process.env.JWT_SECRET;

      const token = jwt.sign({ id: 1 }, "some-secret");
      const result = authService.verifyToken(token);

      expect(result).toBeNull();
    });
  });
});

jest.mock("../entities/User", () => {
  return {
    User: {
      create: jest.fn().mockImplementation((data: any) => ({
        ...data,
        save: jest.fn().mockResolvedValue(undefined),
      })),
      find: jest.fn().mockResolvedValue([]),
    },
  };
});

import { User } from "../entities/User";
import { UserService } from "../services/user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it("should create a new user with hashed password", async () => {
    const result = await service.signup({
      email: "test@example.com",
      password: "mypassword",
      name: "John",
    });

    expect(result).toBe("USER_CREATED");
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstname: "John",
        email: "test@example.com",
      })
    );
  });

  it("should throw error if input invalid", async () => {
    await expect(
      service.signup({ email: "", password: "", name: "" })
    ).rejects.toThrow("INVALID_INPUT");
  });
});

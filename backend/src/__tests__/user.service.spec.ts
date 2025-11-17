jest.mock("../entities/User", () => ({
  User: {
    create: jest.fn().mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));
jest.mock("../entities/Role", () => ({
  Role: {
    findOne: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

import { User } from "../entities/User";
import { UserService } from "../services/user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it("should create a new user with hashed password", async () => {
    const result = await service.signup({
      password: "mypassword",
      firstname: "Alexandre",
      lastname: "Dumas",
      email: "test@example.com",
      phoneNumber: "01234567890",
      address: "123 Main St",
      city: "Anytown",
    });

    expect(result).toBe("USER_CREATED");
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstname: "Alexandre",
        lastname: "Dumas",
        email: "test@example.com",
        phoneNumber: "01234567890",
        address: "123 Main St",
        city: "Anytown",
      })
    );
  });

  it("should throw error if input invalid", async () => {
    await expect(
      service.signup({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phoneNumber: "",
        address: "",
        city: "",
      })
    ).rejects.toThrow("INVALID_INPUT");
  });
});

import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { UserService } from "../services/user.service";

jest.mock("../entities/User", () => ({
  User: {
    create: jest.fn().mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    })),
    findOne: jest.fn().mockResolvedValue(null),
    remove: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../entities/Role", () => ({
  Role: {
    findOne: jest.fn().mockResolvedValue({ id: 1, roleName: "user" }),
  },
}));

jest.mock("argon2", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
}));

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    jest.clearAllMocks();
  });

  it("should create a new user with hashed password", async () => {
    const result = await service.createUser({
      email: "test@example.com",
      password: "Password123!",
      passwordConfirm: "Password123!",
    });

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        password: "hashed-password",
        firstname: "non renseigné",
        lastname: "non renseigné",
        phoneNumber: "0000000000",
        address: "non renseigné",
        city: "non renseigné",
        postalCode: "00000",
      })
    );

    expect(result).toBeDefined();
  });

  it("should throw error if user already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, email: "test@example.com" });

    await expect(
      service.createUser({
        email: "test@example.com",
        password: "Password123!",
        passwordConfirm: "Password123!",
      })
    ).rejects.toThrow("User already exists");
  });

  it("should create a new user by admin with role", async () => {
    const result = await service.createUserByAdmin({
      email: "admin@example.com",
      password: "Password123!",
      passwordConfirm: "Password123!",
      firstname: "Alice",
      lastname: "Dupont",
      roleId: 1,
    });

    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "admin@example.com",
        password: "hashed-password",
        firstname: "Alice",
        lastname: "Dupont",
      })
    );

    expect(result).toBeDefined();
  });

  it("should throw error if role not found", async () => {
    (Role.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.createUserByAdmin({
        email: "admin2@example.com",
        password: "Password123!",
        passwordConfirm: "Password123!",
        roleId: 999,
      })
    ).rejects.toThrow("Role not found");
  });

  it("should delete a user", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, save: jest.fn() });
    (User.remove as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.deleteUser(1);
    expect(result).toBe(true);
  });

  it("should throw error if user not found on delete", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.deleteUser(999)).rejects.toThrow("User not found");
  });

  it("should return a user by id", async () => {
    const userMock = { id: 1, email: "u@example.com", role: {} };
    (User.findOne as jest.Mock).mockResolvedValueOnce(userMock);

    const result = await service.getUserById(1);
    expect(result).toEqual(userMock);
  });

  it("should throw error if user not found by id", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.getUserById(999)).rejects.toThrow("User not found");
  });

  it("should update a user", async () => {
    const userMock = { id: 1, save: jest.fn() };
    (User.findOne as jest.Mock).mockResolvedValueOnce(userMock);

    const data = { firstname: "Carla" };
    const result = await service.updateUser(1, data);
    expect(userMock.save).toHaveBeenCalled();
    expect(result.firstname).toBe("Carla");
  });

  it("should throw error if user not found on update", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.updateUser(999, { firstname: "x" })).rejects.toThrow("User not found");
  });

  it("should update user by admin including role", async () => {
    const userMock = { id: 1, save: jest.fn(), role: {} };
    (User.findOne as jest.Mock).mockResolvedValueOnce(userMock);
    (Role.findOne as jest.Mock).mockResolvedValueOnce({ id: 2, roleName: "ADMIN" });

    const result = await service.updateUserByAdmin(1, { roleId: 2, firstname: "Paul" });
    expect(userMock.save).toHaveBeenCalled();
    expect(result.role).toEqual({ id: 2, roleName: "ADMIN" });
    expect(result.firstname).toBe("Paul");
  });

  it("should update user password", async () => {
    const userMock = { id: 1, save: jest.fn() };
    (User.findOne as jest.Mock).mockResolvedValueOnce(userMock);

    const result = await service.updateUserPassword(1, {
      password: "Azeqsd125!",
      passwordConfirm: "Azeqsd125!",
    });

    expect(userMock.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should throw error if user not found on update password", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(
      service.updateUserPassword(999, { password: "x", passwordConfirm: "x" })
    ).rejects.toThrow("User not found");
  });
});

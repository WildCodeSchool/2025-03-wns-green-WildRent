import { User } from "../entities/User";
import cloudinary from "../config/cloudinary";
import { UploadService } from "../services/upload.service";

jest.mock("../entities/User", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../config/cloudinary", () => ({
  uploader: {
    upload_stream: jest.fn(),
  },
}));

describe("UploadService", () => {
  let service: UploadService;

  beforeEach(() => {
    service = new UploadService();
    jest.clearAllMocks();
  });

  it("should throw error if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.uploadAvatar(999, Buffer.from("fake-image"))
    ).rejects.toThrow("User not found");

    await expect(
      service.uploadAvatar(999, Buffer.from("fake-image"))
    ).rejects.toMatchObject({ codeError: "NOT_FOUND" });
  });

  it("should upload avatar and return URL", async () => {
    const mockUser = { id: 1, avatar: null, save: jest.fn() };
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockUrl = "https://res.cloudinary.com/test/image/upload/wildrent/avatars/user-1.jpg";
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((_opts: any, callback: any) => {
      callback(null, { secure_url: mockUrl });
      return { end: jest.fn() };
    });

    const result = await service.uploadAvatar(1, Buffer.from("fake-image"));

    expect(result).toBe(mockUrl);
    expect(mockUser.avatar).toBe(mockUrl);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should throw error if Cloudinary upload fails", async () => {
    const mockUser = { id: 1, avatar: null, save: jest.fn() };
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((_opts: any, callback: any) => {
      callback(new Error("Cloudinary error"), null);
      return { end: jest.fn() };
    });

    await expect(
      service.uploadAvatar(1, Buffer.from("fake-image"))
    ).rejects.toThrow("Cloudinary error");
  });

  it("should throw error if Cloudinary returns empty response", async () => {
    const mockUser = { id: 1, avatar: null, save: jest.fn() };
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((_opts: any, callback: any) => {
      callback(null, null);
      return { end: jest.fn() };
    });

    await expect(
      service.uploadAvatar(1, Buffer.from("fake-image"))
    ).rejects.toThrow("Empty Cloudinary response");
  });
});

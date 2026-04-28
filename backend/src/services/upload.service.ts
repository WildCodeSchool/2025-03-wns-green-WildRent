import cloudinary from "../config/cloudinary";
import { User } from "../entities/User";
import { Errors } from "../errors/errors";
import type { UploadApiResponse } from "cloudinary";

export class UploadService {
  /** Uploads a user's avatar to Cloudinary and saves the URL in the database. */
  async uploadAvatar(userId: number, fileBuffer: Buffer): Promise<string> {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw Errors.notFound("User");

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "wildrent/avatars",
          public_id: `user-${userId}`,
          overwrite: true,
          transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Empty Cloudinary response"));
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    user.avatar = result.secure_url;
    await user.save();

    return result.secure_url;
  }
}

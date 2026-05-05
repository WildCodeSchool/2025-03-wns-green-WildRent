import cloudinary from "../config/cloudinary";
import { User } from "../entities/User";
import { Errors } from "../errors/errors";
import type { UploadApiResponse } from "cloudinary";

/**
 * Service responsible for file uploads to Cloudinary.
 * Handles user avatar upload with automatic cropping and face detection.
 */
export class UploadService {
  /**
   * Uploads a user avatar image to Cloudinary and updates the user's avatar URL.
   * The image is cropped to 300x300 pixels with face-detection gravity.
   * @param userId - The ID of the user whose avatar is being uploaded
   * @param fileBuffer - The raw image file buffer
   * @returns The secure URL of the uploaded avatar
   * @throws NotFoundError if the user does not exist
   */
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

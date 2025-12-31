import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

// ----- Cloudinary config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = (
  fileBuffer,
  folderName = "avatars"
) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(upload);
  });
};

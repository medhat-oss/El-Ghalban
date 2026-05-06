// ============================================================
// El-Ghalban | lib/cloudinary.ts — Cloudinary Upload Utility
// Used in API route for server-side image uploads
// ============================================================

import { v2 as cloudinary } from "cloudinary";

// Configure once — credentials come from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a base64-encoded image or a remote URL to Cloudinary.
 * @param source - base64 data URI or remote image URL
 * @param folder - Cloudinary folder (default: "el-ghalban/products")
 */
export async function uploadToCloudinary(
  source: string,
  folder = "el-ghalban/products"
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(source, {
    folder,
    transformation: [
      { width: 1200, height: 1200, crop: "limit" }, // Cap resolution
      { quality: "auto:good" },                     // Intelligent compression
      { fetch_format: "auto" },                     // WebP where supported
    ],
    resource_type: "image",
  });

  return {
    secure_url: result.secure_url,
    public_id:  result.public_id,
    width:      result.width,
    height:     result.height,
    format:     result.format,
    bytes:      result.bytes,
  };
}

/**
 * Delete an image from Cloudinary by public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export default cloudinary;

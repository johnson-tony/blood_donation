import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { MAX_PROFILE_IMAGE_BYTES, PROFILE_IMAGE_FOLDER } from "@/lib/constants";

/**
 * Cloudinary media storage.
 *
 * The API secret never reaches the browser: uploads run inside a Server Action
 * using the private key, so no unsigned upload preset is required and there is
 * nothing to leak from the client bundle.
 *
 * Folder note: creating folders through the Admin API (`POST /folders`) returns
 * 404 on the Free plan. Cloudinary creates folders implicitly on first upload,
 * so the path below is materialised by the first member who uploads a photo.
 */

/**
 * {@link MAX_PROFILE_IMAGE_BYTES} and {@link PROFILE_IMAGE_FOLDER} live in
 * `lib/constants` so the client and the server cannot disagree about them.
 */
export { MAX_PROFILE_IMAGE_BYTES, PROFILE_IMAGE_FOLDER };

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AllowedImageType = (typeof ALLOWED_CONTENT_TYPES)[number];

let configured = false;

function configure(): void {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Media storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

/**
 * Lets the profile page hide the upload control instead of failing at the
 * moment a member tries to use it.
 */
export function isMediaStorageConfigured(): boolean {
  try {
    configure();
    return true;
  } catch {
    return false;
  }
}

export function isAllowedImageType(
  contentType: string,
): contentType is AllowedImageType {
  return (ALLOWED_CONTENT_TYPES as readonly string[]).includes(contentType);
}

export interface StoredImage {
  /** Written to the database and rendered in the app. */
  url: string;
  /** Needed to delete or replace the asset later. */
  publicId: string;
}

/**
 * Uploads one image into the blood donation folder.
 *
 * `public_id` is the member id, so a member always has exactly one profile
 * photo and re-uploading replaces it instead of accumulating files.
 */
export async function storeProfileImage(
  buffer: Buffer,
  options: { userId: string; contentType: AllowedImageType; bytes: number },
): Promise<StoredImage> {
  const { userId, contentType, bytes } = options;

  if (bytes <= 0) {
    throw new Error("That file is empty.");
  }

  if (bytes > MAX_PROFILE_IMAGE_BYTES) {
    throw new Error(
      `Photos must be smaller than ${MAX_PROFILE_IMAGE_BYTES / (1024 * 1024)} MB.`,
    );
  }

  configure();

  const result = await cloudinary.uploader.upload(
    // Uploaded from memory as a data URI: there is no temporary file to write
    // and nothing to clean up if the request dies halfway.
    `data:${contentType};base64,${buffer.toString("base64")}`,
    {
      folder: PROFILE_IMAGE_FOLDER,
      public_id: userId,
      resource_type: "image",
      // One photo per member, and drop the cached derivative immediately so a
      // replacement is visible without waiting for the CDN to expire.
      overwrite: true,
      invalidate: true,
      transformation: [{ width: 1024, height: 1024, crop: "limit" }],
    },
  );

  return {
    url: deliveryUrl(result.public_id),
    publicId: result.public_id,
  };
}

/**
 * The stored URL delivered at avatar size.
 *
 * A fixed transformation keeps the URL predictable, crops to the face, and lets
 * the CDN serve WebP without a file extension in the path.
 */
export function deliveryUrl(publicId: string): string {
  configure();

  return cloudinary.url(publicId, {
    secure: true,
    width: 256,
    height: 256,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    fetch_format: "webp",
  });
}

/**
 * Deletes a stored asset.
 *
 * Never called with a value that did not come out of our own database, and it
 * only ever removes assets inside the blood donation folder.
 */
export async function removeStoredImage(publicId: string): Promise<void> {
  configure();

  const expectedPrefix = `${PROFILE_IMAGE_FOLDER}/`;

  if (!publicId.startsWith(expectedPrefix)) {
    throw new Error("Refusing to delete an asset outside the media folder.");
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("Failed to remove Cloudinary asset:", error);
  }
}
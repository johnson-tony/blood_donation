import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      // Default is 1 MB, which is below the profile photo limit. The limit
      // covers the raw multipart body, so it sits above the image cap with
      // headroom for boundaries and part headers.
      // Keep in step with MAX_PROFILE_IMAGE_BYTES in `lib/constants.ts`.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
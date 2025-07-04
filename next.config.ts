import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //gpt ver.
  // images: {
    // domains: ['image.mux.com'], 
    // }
  //lecture ver.
  images: {
    remotePatterns: [{
    protocol: "https",
    hostname: "image.mux.com"
    }]
  }
};

export default nextConfig;

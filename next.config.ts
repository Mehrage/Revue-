import type { NextConfig } from "next";
import path from "path";

// Must be the project directory (this app folder), NOT the Desktop or any parent.
// Turbopack looks for node_modules/next inside this path.
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname), // e.g. /Users/merge/Desktop/Cancord
  },
};

export default nextConfig;

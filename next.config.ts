import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // El antiguo borrador de registro ahora vive en /register
      { source: "/register/real", destination: "/register", permanent: false },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// Deshabilitar la verificación SSL (solo para desarrollo)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {
  // Otras configuraciones de Next.js si las tienes
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` genera el sitio estático en `out/` (deploy en Netlify).
  // Implica: sin API Routes, middleware/proxy, Server Actions, rewrites/redirects/headers ni ISR.
  output: "export",

  images: {
    // El loader por defecto de next/image necesita un servidor para optimizar imágenes,
    // lo cual no existe en un static export. Con `unoptimized` el component <Image>
    // se sigue pudiendo usar (lazy loading, width/height, sizes), sirviendo el archivo tal cual.
    unoptimized: true,
  },
};

export default nextConfig;

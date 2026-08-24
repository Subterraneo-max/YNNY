import type { NextConfig } from "next";

/**
 * Las fotos que se suben desde el panel viven en el Storage de Supabase, que es
 * otro dominio. `next/image` no optimiza imágenes de cualquier lado —si lo
 * hiciera, cualquiera podría usar el optimizador del sitio para procesar sus
 * propias imágenes y hacernos pagar el tráfico—, así que hay que autorizar ese
 * dominio explícitamente.
 *
 * El dominio sale de la misma variable de entorno que usa el resto del proyecto,
 * para que no haya dos lugares donde decir cuál es el proyecto de Supabase.
 */
function dominioDeSupabase(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    console.warn("[next.config] NEXT_PUBLIC_SUPABASE_URL no es una URL válida:", url);
    return null;
  }
}

const dominio = dominioDeSupabase();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: dominio
      ? [{ protocol: "https", hostname: dominio, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;

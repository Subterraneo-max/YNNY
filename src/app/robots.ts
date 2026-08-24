import type { MetadataRoute } from "next";
import { sitio } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  // Mientras sea una propuesta, la demo no debe indexarse: no queremos que aparezca
  // en Google compitiendo con el negocio real ni confundiendo a sus clientes.
  if (sitio.esDemo) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // El panel nunca se indexa, ni siquiera en producción. No es una medida de
    // seguridad —quien protege es RLS— pero no tiene ningún sentido que /admin
    // aparezca en Google.
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${sitio.url}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { sitio } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  // Mientras sea una propuesta, la demo no debe indexarse: no queremos que aparezca
  // en Google compitiendo con el negocio real ni confundiendo a sus clientes.
  if (sitio.esDemo) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${sitio.url}/sitemap.xml`,
  };
}

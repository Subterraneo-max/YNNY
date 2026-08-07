import type { MetadataRoute } from "next";
import { sitio } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return [
    { url: sitio.url, lastModified: ahora, changeFrequency: "monthly", priority: 1 },
    // La carta cambia de precios seguido: conviene que Google la revisite a menudo.
    { url: `${sitio.url}/carta`, lastModified: ahora, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${sitio.url}/sucursales`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

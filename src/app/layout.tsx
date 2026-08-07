import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Encabezado } from "@/components/Encabezado";
import { PieDePagina } from "@/components/PieDePagina";
import { sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";
import "./globals.css";

// Una sola familia variable: cubre desde el texto corrido hasta los titulares
// sin sumar descargas, que es justo lo que hoy hace lento al PDF de la carta.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${sitio.nombre} | Panadería en ${sitio.ciudad}`,
    template: `%s | ${sitio.nombreCorto}`,
  },
  description: sitio.descripcion,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: sitio.nombre,
    title: `${sitio.nombre} | Panadería en ${sitio.ciudad}`,
    description: sitio.descripcion,
  },
  // La demo no se indexa: no queremos que compita con el negocio real en Google.
  robots: sitio.esDemo ? { index: false, follow: false } : { index: true, follow: true },
};

/**
 * Datos estructurados de la cadena y sus locales. Es lo que le permite a Google
 * mostrar horarios, dirección y teléfono directamente en los resultados: hoy no
 * puede hacerlo porque toda esa información vive dentro de un PDF y de Linktree.
 */
function datosEstructurados() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: sitio.nombre,
    description: sitio.descripcion,
    url: sitio.url,
    sameAs: [sitio.instagram],
    department: sucursales.map((sucursal) => ({
      "@type": "Bakery",
      name: `${sitio.nombreCorto} ${sucursal.nombre}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: sucursal.direccion,
        addressLocality: sitio.ciudad,
        addressRegion: sitio.provincia,
        addressCountry: "AR",
      },
      geo: { "@type": "GeoCoordinates", latitude: sucursal.lat, longitude: sucursal.lng },
      telephone: `+${sucursal.whatsapp}`,
      servesCuisine: "Panadería y cafetería",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "07:00",
          closes: "21:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "07:30",
          closes: "21:00",
        },
      ],
    })),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={archivo.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Encabezado />
        <main className="flex-1">{children}</main>
        <PieDePagina />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados()) }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { sitio } from "@/lib/sitio";
import "./globals.css";

// Una sola familia variable con eje de ancho: los titulares expandidos del diseño
// salen del mismo archivo que el texto corrido, sin una descarga extra.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-archivo",
  axes: ["wdth"],
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
 * Layout raíz: solo el documento y la tipografía.
 *
 * El encabezado, el pie y el scroll suave viven en `(publico)/layout.tsx`, así
 * `/admin` no los arrastra. Lo único que comparten la web y el panel es la
 * fuente y la hoja de estilos.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={archivo.variable}>
      <head>
        {/*
          El mapa de sucursales trae los tiles de OpenStreetMap. Abrir la conexión
          (DNS + TLS) mientras todavía se está pintando la página ahorra unos 300 ms
          cuando el mapa efectivamente aparece.
        */}
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { sitio } from "@/lib/sitio";

const enlaces = [
  { href: "/carta", texto: "Carta" },
  { href: "/sucursales", texto: "Sucursales" },
];

/**
 * El aviso de demo y la navegación viajan juntos en un mismo contenedor pegajoso:
 * así la aclaración de que esto no es el sitio oficial de YNNY nunca se pierde de
 * vista, por más que la persona scrollee.
 */
export function Encabezado() {
  return (
    <div className="sticky top-0 z-50">
      {sitio.esDemo && (
        <p className="bg-tinta px-4 py-1.5 text-center text-[0.72rem] leading-tight text-crema/85 sm:text-xs">
          <span className="font-semibold text-lima">Propuesta no oficial</span>
          <span className="mx-1.5 text-crema/40">·</span>
          Demo hecha por {sitio.autorDemo}. No pertenece a {sitio.nombreCorto}.
        </p>
      )}

      <header className="border-b border-borde bg-crema/95 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          {/* Un solo "YNNY" visible: el nombre accesible tiene que contener el texto
              que se ve, y repetir el wordmark al lado del isotipo lo rompía. */}
          <Link href="/" className="flex items-center" aria-label={`${sitio.nombreCorto}, inicio`}>
            <Logo conBajada={false} className="w-12 text-[1.7rem]" />
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-tinta-suave transition hover:bg-crema-hondo hover:text-tinta"
              >
                {enlace.texto}
              </Link>
            ))}
            <Link
              href="/sucursales"
              className="rounded-full bg-lima px-4 py-2 text-sm font-bold text-tinta transition hover:bg-lima-hondo hover:text-crema"
            >
              Pedir
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}

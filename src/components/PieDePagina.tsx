import Link from "next/link";
import { Logo } from "@/components/Logo";
import { horarios, sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

export function PieDePagina() {
  return (
    <footer className="mt-24 border-t border-borde bg-crema-hondo">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <Logo className="w-14 text-[2rem]" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-tinta-suave">
            Todo recién hecho, todos los días. {sucursales.length} sucursales en {sitio.ciudad}.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-tinta-suave">Horarios</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {horarios.map((horario) => (
              <li key={horario.dias}>
                <span className="block font-semibold">{horario.dias}</span>
                <span className="text-tinta-suave">{horario.franja}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-tinta-suave">Secciones</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/carta" className="font-semibold underline-offset-4 hover:underline">
                Carta
              </Link>
            </li>
            <li>
              <Link href="/sucursales" className="font-semibold underline-offset-4 hover:underline">
                Sucursales y WhatsApp
              </Link>
            </li>
            <li>
              <a
                href={sitio.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-4 hover:underline"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {sitio.esDemo && (
        <div className="border-t border-borde px-4 py-5">
          <p className="mx-auto max-w-5xl text-xs leading-relaxed text-tinta-suave">
            Sitio de demostración sin fines comerciales, realizado por {sitio.autorDemo} como
            propuesta para {sitio.nombre}. No está afiliado a la empresa ni la representa. Los
            precios y la información provienen de material público publicado por el propio
            negocio y pueden estar desactualizados.
          </p>
        </div>
      )}
    </footer>
  );
}

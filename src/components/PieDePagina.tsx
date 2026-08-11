import Link from "next/link";
import { Logo } from "@/components/Logo";
import { categorias } from "@/data/menu";
import { horarios, sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

export function PieDePagina() {
  return (
    <footer className="bg-cacao text-crema">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="w-16 text-[2.3rem]" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-crema/60">
            Panadería y café en {sitio.ciudad}. Todo recién hecho, todos los días.
          </p>
          <a
            href={sitio.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block py-1.5 text-sm font-semibold text-lima underline-offset-4 hover:underline"
          >
            @ynnycafe
          </a>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-bold tracking-[0.18em] text-crema/70 uppercase">
            Horarios
          </h2>
          <dl className="mt-5 space-y-4">
            {horarios.map((horario) => (
              <div key={horario.dias}>
                <dt className="display-suelto text-xl leading-tight">{horario.dias}</dt>
                <dd className="mt-1 text-sm text-crema/60 tabular-nums">{horario.franja}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-bold tracking-[0.18em] text-crema/70 uppercase">
            Carta
          </h2>
          <ul className="mt-4 text-sm">
            {categorias.map((categoria) => (
              <li key={categoria.slug}>
                <Link
                  href={`/carta#${categoria.slug}`}
                  className="inline-block py-1.5 text-crema/75 underline-offset-4 transition-colors hover:text-lima hover:underline"
                >
                  {categoria.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.7rem] font-bold tracking-[0.18em] text-crema/70 uppercase">
            Sucursales
          </h2>
          <ul className="mt-4 text-sm">
            {sucursales.slice(0, 6).map((sucursal) => (
              <li key={sucursal.id} className="text-crema/75">
                {sucursal.nombre}
              </li>
            ))}
            <li>
              <Link
                href="/sucursales"
                className="inline-block py-1.5 font-semibold text-lima underline-offset-4 hover:underline"
              >
                Ver las {sucursales.length} →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-crema/15">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {sitio.esDemo ? (
            <p className="text-xs leading-relaxed text-crema/65">
              Sitio de demostración sin fines comerciales, realizado por {sitio.autorDemo} como
              propuesta para {sitio.nombre}. No está afiliado a la empresa ni la representa.
              Los precios y la información provienen de material público publicado por el
              propio negocio y pueden estar desactualizados.
            </p>
          ) : (
            <p className="text-xs text-crema/65">
              © {new Date().getFullYear()} {sitio.nombre}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

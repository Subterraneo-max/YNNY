import Link from "next/link";
import { categorias, formatearPrecio } from "@/data/menu";
import { horarios, sucursales } from "@/data/sucursales";
import { MapaSucursales } from "@/components/MapaSucursales";
import { sitio } from "@/lib/sitio";

/** Cuatro anzuelos de la carta: barato, conocido y con el precio a la vista. */
const destacados = [
  { nombre: "Infusión + 2 facturas", precio: 4500, categoria: "Desayunos" },
  { nombre: "Submarino + 2 medialunas", precio: 4800, categoria: "Meriendas" },
  { nombre: "Empanadas", precio: 2400, categoria: "Todas las variedades" },
  { nombre: "Almuerzo del día", precio: 11500, categoria: "Con bebida y postre" },
];

export default function Inicio() {
  return (
    <>
      <section className="border-b border-borde bg-crema-hondo">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lima-hondo">
            Panadería &amp; café · {sitio.ciudad}
          </p>
          <h1 className="titular mt-4 text-5xl sm:text-7xl">
            Todo recién hecho,
            <br />
            <span className="text-lima-hondo">todos los días.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-tinta-suave">
            Desayunos, meriendas y almuerzos en {sucursales.length} sucursales de {sitio.ciudad}.
            Panadería, pastelería y sándwiches para llevar o comer acá.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/carta"
              className="rounded-full bg-tinta px-6 py-3.5 font-bold text-crema transition hover:bg-lima hover:text-tinta"
            >
              Ver la carta
            </Link>
            <Link
              href="/sucursales"
              className="rounded-full border border-tinta px-6 py-3.5 font-bold transition hover:bg-crema"
            >
              Sucursal más cercana
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="titular text-3xl">Para arrancar el día</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((item) => (
            <li
              key={item.nombre}
              className="flex flex-col justify-between rounded-2xl border border-borde p-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-lima-hondo">
                  {item.categoria}
                </p>
                <p className="mt-1.5 font-semibold leading-snug">{item.nombre}</p>
              </div>
              <p className="titular mt-6 text-2xl tabular-nums">
                {formatearPrecio(item.precio)}
              </p>
            </li>
          ))}
        </ul>
        <Link
          href="/carta"
          className="mt-6 inline-block font-bold underline underline-offset-4 hover:text-lima-hondo"
        >
          Ver la carta completa →
        </Link>
      </section>

      <section className="border-y border-borde bg-crema-hondo">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:grid-cols-2">
          <div>
            <h2 className="titular text-3xl">{sucursales.length} sucursales en {sitio.ciudad}</h2>
            <p className="mt-4 leading-relaxed text-tinta-suave">
              Cada local tiene su propio WhatsApp. Te decimos cuál te queda más cerca y te
              abrimos el chat de ese local, no el de otro.
            </p>

            <dl className="mt-6 space-y-1.5 text-sm">
              {horarios.map((horario) => (
                <div key={horario.dias} className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold">{horario.dias}:</dt>
                  <dd className="text-tinta-suave">{horario.franja}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/sucursales"
              className="mt-7 inline-block rounded-full bg-lima px-6 py-3.5 font-bold text-tinta transition hover:bg-lima-hondo hover:text-crema"
            >
              Ver las sucursales
            </Link>
          </div>

          <div className="w-full max-w-xs justify-self-center">
            <MapaSucursales sucursales={sucursales} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="titular text-3xl">Qué vas a encontrar</h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {categorias.map((categoria) => (
            <li key={categoria.slug}>
              <Link
                href={`/carta#${categoria.slug}`}
                className="inline-block rounded-full border border-borde px-4 py-2.5 font-semibold transition hover:border-lima-hondo hover:bg-lima/20"
              >
                {categoria.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

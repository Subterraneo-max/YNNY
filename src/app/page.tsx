import Link from "next/link";
import { CarruselDestacados } from "@/components/CarruselDestacados";
import { FilasCategorias } from "@/components/FilasCategorias";
import { Hero } from "@/components/Hero";
import { IlustracionProducto, TIPO_POR_CATEGORIA } from "@/components/IlustracionProducto";
import { MapaSucursales } from "@/components/MapaSucursales";
import { Marquesina } from "@/components/Marquesina";
import { Revelar } from "@/components/Revelar";
import { TituloRevelado } from "@/components/TituloRevelado";
import { categorias } from "@/data/menu";
import { horarios, sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

const nombresCategorias = categorias.map((categoria) => categoria.nombre.toUpperCase());

export default function Inicio() {
  return (
    <>
      <Hero />

      <Marquesina textos={nombresCategorias} velocidad={30} />

      {/* ---------- Escaparate ---------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto mb-4 max-w-6xl px-4">
          <TituloRevelado
            texto="Nuestra carta"
            como="h2"
            className="display text-[clamp(2.2rem,8vw,5rem)]"
          />
          <Revelar retraso={0.15}>
            <p className="mt-4 max-w-md leading-relaxed text-cacao-suave">
              Lo más barato de cada categoría, para que veas por dónde arranca. Después está
              la carta entera.
            </p>
          </Revelar>
        </div>

        <CarruselDestacados />

        <div className="mx-auto mt-8 max-w-6xl px-4">
          <Revelar>
            <Link
              href="/carta"
              className="group inline-flex items-center gap-3 border-b-2 border-cacao pb-1 text-lg font-bold"
            >
              Ver la carta completa
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </Revelar>
        </div>
      </section>

      {/* ---------- Categorías ---------- */}
      <section className="bg-crema-hondo py-20 sm:py-28">
        <div className="mx-auto mb-10 max-w-6xl px-4">
          <TituloRevelado
            texto="Qué vas a encontrar"
            como="h2"
            className="display text-[clamp(2.2rem,8vw,5rem)]"
          />
        </div>
        <FilasCategorias />
      </section>

      <Marquesina textos={["TODO RECIÉN HECHO", "TODOS LOS DÍAS", `${sucursales.length} SUCURSALES`]} velocidad={24} />

      {/* ---------- Sucursales ----------
          En la referencia acá van reseñas de clientes. No inventamos testimonios:
          este bloque muestra información real y cumple el mismo rol visual. */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <TituloRevelado
              texto={`${sucursales.length} sucursales en ${sitio.ciudad}`}
              como="h2"
              className="display text-[clamp(2rem,7vw,4.2rem)]"
            />
            <Revelar retraso={0.15}>
              <p className="mt-5 max-w-md leading-relaxed text-cacao-suave">
                Cada local tiene su propio WhatsApp. Te decimos cuál te queda más cerca y te
                abrimos el chat de esa sucursal, no el de otra.
              </p>

              <dl className="mt-7 space-y-2">
                {horarios.map((horario) => (
                  <div key={horario.dias} className="flex flex-wrap items-baseline gap-x-3 border-b border-borde pb-2">
                    <dt className="font-semibold">{horario.dias}</dt>
                    <dd className="display ml-auto text-xl tabular-nums">{horario.franja}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/sucursales"
                className="mt-8 inline-block rounded-sm bg-cacao px-7 py-4 font-bold text-crema transition-colors hover:bg-lima hover:text-cacao"
              >
                Ver todas las sucursales
              </Link>
            </Revelar>
          </div>

          <Revelar desde="escala" className="mx-auto w-full max-w-sm">
            <MapaSucursales sucursales={sucursales} />
          </Revelar>
        </div>
      </section>

      {/* ---------- Cierre ---------- */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl bg-crema-hondo">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <TituloRevelado
                texto="Tu próximo desayuno está a un mensaje"
                como="h2"
                className="display text-[clamp(1.9rem,6vw,3.6rem)]"
              />
              <Revelar retraso={0.15}>
                <p className="mt-5 max-w-sm leading-relaxed text-cacao-suave">
                  Escribinos por WhatsApp a la sucursal que te quede más cerca y te lo
                  preparamos.
                </p>
                <Link
                  href="/sucursales"
                  className="mt-7 inline-block rounded-sm bg-lima px-7 py-4 font-bold text-cacao transition-colors hover:bg-cacao hover:text-crema"
                >
                  Elegir sucursal
                </Link>
              </Revelar>
            </div>

            {/* Mosaico, en el lugar de la grilla de fotos de la referencia */}
            <Revelar escalonar className="grid grid-cols-3 gap-2 sm:gap-3">
              {categorias.slice(0, 6).map((categoria) => (
                <div key={categoria.slug} className="aspect-square bg-crema p-2">
                  <IlustracionProducto
                    tipo={TIPO_POR_CATEGORIA[categoria.slug] ?? "plato"}
                    nombre={categoria.nombre}
                    className="size-full"
                  />
                </div>
              ))}
            </Revelar>
          </div>
        </div>
      </section>
    </>
  );
}

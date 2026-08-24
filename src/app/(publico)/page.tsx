import Link from "next/link";
import { CarruselDestacados } from "@/components/CarruselDestacados";
import { FilasCategorias } from "@/components/FilasCategorias";
import { Favoritos } from "@/components/Favoritos";
import { Hero } from "@/components/Hero";
import { FotoCategoria } from "@/components/FotoCategoria";
import { MapaSucursales } from "@/components/MapaSucursales";
import { Marquesina } from "@/components/Marquesina";
import { Revelar } from "@/components/Revelar";
import { TituloRevelado } from "@/components/TituloRevelado";
import { cantidadRedonda, destacadosDe, favoritosDe, leerCarta } from "@/lib/carta";
import { horarios, sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

export default async function Inicio() {
  const carta = await leerCarta();
  const nombresCategorias = carta.categorias.map((categoria) => categoria.nombre.toUpperCase());
  const favoritos = favoritosDe(carta.categorias);

  return (
    <>
      <Hero cantidadRedonda={cantidadRedonda(carta.categorias)} />

      <Marquesina textos={nombresCategorias} velocidad={30} />

      {/* ---------- Favoritos ----------
          Si en el panel no queda ningún producto destacado, la sección entera
          no se renderiza: un título grande sin tarjetas debajo se ve roto. */}
      {favoritos.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto mb-10 max-w-6xl px-4">
            <TituloRevelado
              texto="Los favoritos de YNNY"
              como="h2"
              className="display text-[clamp(2.2rem,8vw,5rem)]"
            />
            <Revelar retraso={0.15}>
              <p className="mt-4 max-w-md leading-relaxed text-cacao-suave">
                Lo que más se pide en el mostrador, todos los días.
              </p>
            </Revelar>
          </div>

          <Favoritos favoritos={favoritos} />
        </section>
      )}

      {/* ---------- Escaparate por categoría ---------- */}
      <section className="bg-crema-hondo py-20 sm:py-28">
        <div className="mx-auto mb-4 max-w-6xl px-4">
          <TituloRevelado
            texto="Nuestra carta"
            como="h2"
            className="display text-[clamp(2.2rem,8vw,5rem)]"
          />
          <Revelar retraso={0.15}>
            <p className="mt-4 max-w-md leading-relaxed text-cacao-suave">
              Ocho categorías, todas recién hechas. Entrá y mirá la carta completa.
            </p>
          </Revelar>
        </div>

        <CarruselDestacados destacados={destacadosDe(carta.categorias)} />

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
      <section className="py-20 sm:py-28">
        <div className="mx-auto mb-10 max-w-6xl px-4">
          <TituloRevelado
            texto="Qué vas a encontrar"
            como="h2"
            className="display text-[clamp(2.2rem,8vw,5rem)]"
          />
        </div>
        <FilasCategorias categorias={carta.categorias} />
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
                Encontrá tu YNNY más cercano y contactá directamente con esa sucursal.
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

          {/*
            Pegado a la derecha y con tope de ancho: el título de al lado es
            una sola palabra larguísima que se desborda de su columna, y si el
            mapa arranca antes se le monta encima en pantallas de 1024 px.
          */}
          <Revelar desde="escala" className="w-full max-w-[22rem] lg:ml-auto">
            <MapaSucursales sucursales={sucursales} className="h-[19rem] sm:h-[22rem]" />
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
                  Elegí tu sucursal y hacé tu pedido por WhatsApp. Lo preparamos al momento.
                </p>
                <Link
                  href="/sucursales"
                  className="mt-7 inline-block rounded-sm bg-lima px-7 py-4 font-bold text-cacao transition-colors hover:bg-cacao hover:text-crema"
                >
                  Elegir sucursal
                </Link>
              </Revelar>
            </div>

            {/*
              Mosaico de cierre, en el lugar de la grilla de fotos de la referencia.
              Van tres y no seis: para cuando se llega acá, estas mismas fotos ya
              se vieron en el carrusel y en las filas de categorías, y repetirlas
              seis veces más recargaba la sección sin agregar nada.
            */}
            <Revelar escalonar className="grid grid-cols-3 gap-2 sm:gap-3">
              {carta.categorias.slice(0, 3).map((categoria) => (
                <div
                  key={categoria.slug}
                  className="relative aspect-square overflow-hidden rounded-xl shadow-[0_10px_24px_-12px_rgb(53_41_31_/_0.4)]"
                >
                  <FotoCategoria
                    slug={categoria.slug}
                    fotoUrl={categoria.fotoUrl}
                    sizes="(min-width: 1024px) 160px, 30vw"
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

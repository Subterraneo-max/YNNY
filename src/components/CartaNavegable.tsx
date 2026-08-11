"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FotoCategoria } from "@/components/FotoCategoria";
import { categorias, formatearPrecio, todosLosProductos } from "@/data/menu";

/** Para que "arabe" encuentre "Árabe" y "cafe" encuentre "café". */
const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

function FilaProducto({
  nombre,
  descripcion,
  precio,
  contexto,
  ocultarPrecio = false,
}: {
  nombre: string;
  descripcion?: string;
  precio: number | null;
  contexto?: string;
  /** Para las categorías donde el precio ya se anunció una sola vez arriba. */
  ocultarPrecio?: boolean;
}) {
  return (
    <li className="group flex items-baseline gap-3 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug transition-colors group-hover:text-lima-hondo">
          {nombre}
        </p>
        {descripcion && (
          <p className="mt-0.5 text-sm leading-snug text-cacao-suave">{descripcion}</p>
        )}
        {contexto && (
          <p className="mt-1 text-xs font-bold tracking-wider text-lima-hondo uppercase">
            {contexto}
          </p>
        )}
      </div>

      {!ocultarPrecio && (
        <>
          {/* La línea punteada es lo que lleva el ojo del plato al precio. */}
          <span
            aria-hidden="true"
            className="mb-1 hidden min-w-6 flex-1 border-b border-dotted border-borde sm:block"
          />
          {precio === null ? (
            <span className="text-sm text-cacao-suave">Consultar</span>
          ) : (
            <span className="display text-lg tabular-nums">{formatearPrecio(precio)}</span>
          )}
        </>
      )}
    </li>
  );
}

/** El hash de la URL es estado del navegador, no de React: se lee suscribiéndose. */
function suscribirAlHash(alCambiar: () => void) {
  window.addEventListener("hashchange", alCambiar);
  return () => window.removeEventListener("hashchange", alCambiar);
}

export function CartaNavegable() {
  const barraBusqueda = useRef<HTMLDivElement>(null);

  /**
   * Publica el alto de la barra de búsqueda para que los anclajes de categoría
   * caigan justo debajo de ella. Cambia con el ancho de pantalla (los chips se
   * acomodan distinto), así que medirlo es más confiable que estimarlo.
   */
  useEffect(() => {
    const medir = () => {
      document.documentElement.style.setProperty(
        "--alto-buscador",
        `${barraBusqueda.current?.offsetHeight ?? 0}px`,
      );
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  // El buscador del hero manda el término por el hash (#q=…) para que esta página
  // siga siendo estática. En el servidor no hay hash, de ahí el tercer argumento.
  const hash = useSyncExternalStore(
    suscribirAlHash,
    () => window.location.hash,
    () => "",
  );

  const [escrito, setEscrito] = useState<string | null>(null);

  // Mientras nadie haya tocado el input manda el hash; después manda lo escrito.
  const busqueda =
    escrito ?? (hash.startsWith("#q=") ? decodeURIComponent(hash.slice(3)) : "");

  const resultados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    if (termino.length < 2) return null;
    return todosLosProductos.filter((producto) =>
      normalizar(
        `${producto.nombre} ${producto.descripcion ?? ""} ${producto.grupoNombre ?? ""} ${producto.categoriaNombre}`,
      ).includes(termino),
    );
  }, [busqueda]);

  return (
    <>
      {/*
        Se apoya justo debajo del encabezado fijo, que cambia de alto: la barra
        de navegación se esconde al bajar y el aviso de demo ocupa una o dos
        líneas según el ancho. `--tope-pegajoso` lo publica el encabezado ya
        medido; el valor de reserva es para el primer render, antes de que corra
        el JavaScript.
      */}
      <div
        ref={barraBusqueda}
        style={{ top: "var(--tope-pegajoso, 5.6rem)" }}
        className="sticky z-30 -mx-4 border-y border-borde bg-crema/95 px-4 py-3 backdrop-blur-md transition-[top] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <label className="sr-only" htmlFor="buscar">
          Buscar en la carta
        </label>
        <input
          id="buscar"
          type="search"
          value={busqueda}
          onChange={(evento) => setEscrito(evento.target.value)}
          placeholder="Buscar: medialunas, palta, empanadas…"
          // Texto de 16 px y alto cómodo: esta página se usa desde un QR en la
          // mesa, y por debajo de 16 px iOS hace zoom solo al tocar el campo.
          className="w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3.5 text-base outline-none transition placeholder:text-cacao-suave/70 focus:border-cacao focus:ring-2 focus:ring-lima"
        />

        {!resultados && (
          <nav
            aria-label="Categorías de la carta"
            className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categorias.map((categoria) => (
              <a
                key={categoria.slug}
                href={`#${categoria.slug}`}
                // min-h-11 son los 44 px que recomienda Apple como área mínima
                // de toque: con el dedo y el celular apoyado en la mesa, los
                // chips finos de antes se erraban seguido.
                className="flex min-h-11 shrink-0 snap-start items-center rounded-sm border border-cacao/25 px-4 text-sm font-semibold transition hover:border-cacao hover:bg-cacao hover:text-crema"
              >
                {categoria.nombre}
              </a>
            ))}
          </nav>
        )}
      </div>

              {resultados ? (
          <section
            className="entra mt-10"
            aria-live="polite"
          >
            <h2 className="display text-2xl">
              {resultados.length === 0
                ? "Sin resultados"
                : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}`}
            </h2>
            {resultados.length === 0 ? (
              <p className="mt-3 text-cacao-suave">
                No encontramos nada con “{busqueda}”. Probá con otra palabra o mirá la carta
                completa borrando la búsqueda.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-borde">
                {resultados.map((producto, indice) => (
                  <FilaProducto
                    key={`${producto.categoriaSlug}-${producto.nombre}-${indice}`}
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio={producto.precio}
                    contexto={
                      producto.grupoNombre
                        ? `${producto.categoriaNombre} · ${producto.grupoNombre}`
                        : producto.categoriaNombre
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        ) : (
          <div>
            {categorias.map((categoria) => (
              <section
                key={categoria.slug}
                id={categoria.slug}
                className="mt-16"
                style={{
                  scrollMarginTop:
                    "calc(var(--tope-completo, 6.5rem) + var(--alto-buscador, 8rem) + 0.75rem)",
                }}
              >
                <div
                  className="flex items-end gap-4 border-b-2 border-cacao pb-3"
                >
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl shadow-[0_10px_22px_-10px_rgb(53_41_31_/_0.4)] sm:size-20">
                    <FotoCategoria
                      slug={categoria.slug}
                      sizes="(min-width: 640px) 80px, 56px"
                    />
                  </div>
                  {/*
                    En celular el precio va debajo del título, no al lado.

                    Compartiendo la fila, el flex le achicaba la caja al título
                    para hacerle lugar al precio, y como los nombres son una sola
                    palabra larga no tenían por dónde cortar: "ALMUERZOS" se salía
                    108 px de su caja y se montaba sobre el precio. En pantalla
                    ancha sobra lugar, así que ahí siguen en la misma línea.
                  */}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    {/* Mismo motivo que en las filas de la home: a 320 px
                        "SÁNDWICHES" no entraba en su caja y quedaba cortado. */}
                    <h2 className="display text-[clamp(1.35rem,6vw,2.8rem)]">
                      {categoria.nombre}
                    </h2>
                    {categoria.precioUnico && (
                      <p className="display text-lg text-lima-hondo sm:shrink-0 sm:pb-1">
                        Todas {formatearPrecio(categoria.precioUnico)}
                      </p>
                    )}
                  </div>
                </div>

                {categoria.nota && (
                  <p className="mt-3 text-sm leading-relaxed text-cacao-suave">
                    {categoria.nota}
                  </p>
                )}

                {categoria.grupos.map((grupo, indice) => (
                  <div key={grupo.nombre ?? indice} className="mt-6">
                    {grupo.nombre && (
                      <h3 className="text-xs font-bold tracking-[0.18em] text-cacao-suave uppercase">
                        {grupo.nombre}
                      </h3>
                    )}
                    <ul className="divide-y divide-borde">
                      {grupo.productos.map((producto) => (
                        <FilaProducto
                          key={producto.nombre}
                          nombre={producto.nombre}
                          descripcion={producto.descripcion}
                          precio={producto.precio}
                          // Si toda la categoría vale lo mismo ya se anunció arriba:
                          // repetirlo en cada renglón sólo agrega ruido.
                          ocultarPrecio={categoria.precioUnico !== undefined}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
    </>
  );
}

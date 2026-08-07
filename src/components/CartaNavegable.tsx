"use client";

import { useMemo, useState } from "react";
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
    <li className="flex items-baseline gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{nombre}</p>
        {descripcion && (
          <p className="mt-0.5 text-sm leading-snug text-tinta-suave">{descripcion}</p>
        )}
        {contexto && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-lima-hondo">
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
            <span className="text-sm text-tinta-suave">Consultar</span>
          ) : (
            <span className="font-bold tabular-nums">{formatearPrecio(precio)}</span>
          )}
        </>
      )}
    </li>
  );
}

export function CartaNavegable() {
  const [busqueda, setBusqueda] = useState("");

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
      <div className="sticky top-[6.5rem] z-30 -mx-4 border-b border-borde bg-crema/95 px-4 py-3 backdrop-blur">
        <label className="sr-only" htmlFor="buscar">
          Buscar en la carta
        </label>
        <input
          id="buscar"
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar: medialunas, palta, empanadas…"
          className="w-full rounded-full border border-borde bg-crema px-4 py-2.5 text-sm outline-none transition placeholder:text-tinta-suave/70 focus:border-lima-hondo focus:ring-2 focus:ring-lima"
        />

        {!resultados && (
          <nav
            aria-label="Categorías de la carta"
            className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categorias.map((categoria) => (
              <a
                key={categoria.slug}
                href={`#${categoria.slug}`}
                className="shrink-0 rounded-full border border-borde px-3.5 py-1.5 text-sm font-semibold transition hover:border-lima-hondo hover:bg-lima/20"
              >
                {categoria.nombre}
              </a>
            ))}
          </nav>
        )}
      </div>

      {resultados ? (
        <section className="mt-8" aria-live="polite">
          <h2 className="titular text-2xl">
            {resultados.length === 0
              ? "Sin resultados"
              : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}`}
          </h2>
          {resultados.length === 0 ? (
            <p className="mt-3 text-tinta-suave">
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
        categorias.map((categoria) => (
          <section key={categoria.slug} id={categoria.slug} className="mt-12 scroll-mt-44">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-tinta pb-2">
              <h2 className="titular text-3xl">{categoria.nombre}</h2>
              {categoria.precioUnico && (
                <p className="text-sm font-bold text-lima-hondo">
                  Todas {formatearPrecio(categoria.precioUnico)}
                </p>
              )}
            </div>

            {categoria.nota && (
              <p className="mt-3 text-sm leading-relaxed text-tinta-suave">{categoria.nota}</p>
            )}

            {categoria.grupos.map((grupo, indice) => (
              <div key={grupo.nombre ?? indice} className="mt-5">
                {grupo.nombre && (
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-tinta-suave">
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
        ))
      )}
    </>
  );
}

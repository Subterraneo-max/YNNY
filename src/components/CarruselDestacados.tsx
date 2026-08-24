"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { FotoCategoria } from "@/components/FotoCategoria";
import { Revelar } from "@/components/Revelar";
import { formatearPrecio } from "@/lib/carta/derivados";
import type { ProductoEscaparate } from "@/lib/carta/derivados";

/**
 * Escaparate horizontal, como la fila de tazas de la referencia.
 *
 * El desplazamiento es scroll nativo con scroll-snap en vez de un carrusel a
 * medida: en el celular se arrastra con el dedo como cualquier lista, funciona
 * con teclado y no hay que reimplementar la inercia. Las flechas solo empujan
 * ese mismo scroll.
 */
export function CarruselDestacados({ destacados }: { destacados: ProductoEscaparate[] }) {
  const pista = useRef<HTMLUListElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);

  function mover(sentido: 1 | -1) {
    const nodo = pista.current;
    if (!nodo) return;
    const paso = nodo.clientWidth * 0.75;
    nodo.scrollBy({ left: paso * sentido, behavior: "smooth" });
  }

  function alScrollear() {
    const nodo = pista.current;
    if (!nodo) return;
    setAlInicio(nodo.scrollLeft < 8);
    setAlFinal(nodo.scrollLeft + nodo.clientWidth >= nodo.scrollWidth - 8);
  }

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2 px-4">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={alInicio}
          aria-label="Ver productos anteriores"
          className="grid size-12 place-items-center rounded-full border border-cacao transition hover:bg-cacao hover:text-crema active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cacao"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={alFinal}
          aria-label="Ver más productos"
          className="grid size-12 place-items-center rounded-full border border-cacao transition hover:bg-cacao hover:text-crema active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cacao"
        >
          →
        </button>
      </div>

      {/* El escalonado cae sobre cada tarjeta, no sobre la lista entera. */}
      <Revelar objetivo="li">
        <ul
          ref={pista}
          onScroll={alScrollear}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pt-20 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {destacados.map((producto) => (
            <li key={producto.id} className="w-64 shrink-0 snap-start sm:w-72">
              {/* La foto mide 128 px y asoma 64 hacia arriba, así que entra 64 dentro
                  de la tarjeta: el pt-20 es lo que evita que el círculo tape la
                  etiqueta de categoría. Si cambia el tamaño de la foto, cambia acá. */}
              <div className="group relative rounded-xl bg-cacao pt-20 pb-5 text-crema transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2.5">
                <div className="absolute -top-16 left-1/2 size-32 -translate-x-1/2 overflow-hidden rounded-full shadow-[0_16px_34px_-10px_rgb(53_41_31_/_0.55)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                  <FotoCategoria
                    slug={producto.categoriaSlug}
                    producto={producto.nombre}
                    fotoUrl={producto.fotoUrl}
                    sizes="128px"
                  />
                </div>

                <div className="px-5">
                  <p className="text-[0.7rem] font-bold tracking-[0.16em] text-lima uppercase">
                    {producto.categoriaNombre}
                  </p>
                  <h3 className="display-suelto mt-2 min-h-14 text-xl leading-tight">
                    {producto.nombre}
                  </h3>
                  <p className="mt-2 text-sm text-crema/60">
                    {producto.cuantosHay} {producto.cuantosHay === 1 ? "opción" : "opciones"} en
                    esta categoría
                  </p>

                  <div className="mt-5 flex items-stretch gap-px bg-crema/20">
                    <p className="display flex-1 bg-cacao-medio px-4 py-3 text-2xl tabular-nums">
                      {producto.precio !== null ? formatearPrecio(producto.precio) : "—"}
                    </p>
                    <Link
                      href={`/carta#${producto.categoriaSlug}`}
                      aria-label={`Ver ${producto.categoriaNombre} en la carta`}
                      className="grid w-14 place-items-center bg-lima text-2xl text-cacao transition hover:bg-crema"
                    >
                      +
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Revelar>
    </div>
  );
}

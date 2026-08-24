"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FotoCategoria } from "@/components/FotoCategoria";
import { cuantosEn, formatearPrecio } from "@/lib/carta/derivados";
import type { CategoriaCarta } from "@/lib/carta/tipos";
import {
  gsap,
  registrarGsap,
  SALIDA,
  ScrollTrigger,
  prefiereMenosMovimiento,
} from "@/lib/animaciones";

/**
 * Filas alternadas ilustración / título, como la sección de tuestes de la
 * referencia. La alternancia solo existe en pantalla ancha: en el celular
 * apilar en zigzag hace que el ojo pierda el hilo.
 */
export function FilasCategorias({ categorias }: { categorias: CategoriaCarta[] }) {
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const nodo = lista.current;
    if (!nodo) return;

    if (prefiereMenosMovimiento()) {
      gsap.set(nodo.querySelectorAll("li"), { opacity: 1, x: 0 });
      return;
    }

    registrarGsap();

    const ctx = gsap.context(() => {
      const filas = Array.from(nodo.querySelectorAll("li"));
      // Cada fila entra desde el lado hacia el que está alineada.
      gsap.set(filas, { opacity: 0, x: (i) => (i % 2 === 1 ? 60 : -60) });

      // Un solo ScrollTrigger para las ocho filas en lugar de ocho: menos
      // observadores que recalcular en cada scroll.
      ScrollTrigger.batch(filas, {
        start: "top 88%",
        once: true,
        onEnter: (lote) =>
          gsap.to(lote, { opacity: 1, x: 0, duration: 0.75, ease: SALIDA, stagger: 0.1 }),
      });
    }, nodo);

    return () => ctx.revert();
  }, []);

  return (
    // overflow-x-clip es obligatorio acá: hasta que cada fila entra en pantalla
    // queda desplazada 60 px hacia el costado, y esos 60 px ensanchan la página
    // entera. Se usa `clip` y no `hidden` porque no crea un contenedor de scroll,
    // así los `sticky` de otras partes del sitio siguen funcionando.
    <ul ref={lista} className="mx-auto max-w-6xl overflow-x-clip px-4">
      {categorias.map((categoria, indice) => {
        const desdeLaDerecha = indice % 2 === 1;
        const cuantos = cuantosEn(categoria);

        return (
          <li key={categoria.slug}>
            <Link
              href={`/carta#${categoria.slug}`}
              className={`group flex items-center gap-5 border-b border-borde py-6 sm:gap-10 sm:py-8 ${
                desdeLaDerecha ? "sm:flex-row-reverse sm:text-right" : ""
              }`}
            >
              {/* El zoom va en la foto y no en el marco: así la imagen crece dentro
                  del recorte en vez de agrandar el bloque y mover la fila entera. */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl shadow-[0_14px_30px_-12px_rgb(53_41_31_/_0.45)] sm:size-40">
                <FotoCategoria
                  slug={categoria.slug}
                  fotoUrl={categoria.fotoUrl}
                  sizes="(min-width: 640px) 160px, 96px"
                  className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
              </div>

              <div className="min-w-0 flex-1">
                {/*
                  El mínimo del clamp es 1.25rem y no 1.6rem por los teléfonos
                  angostos: a 320 px el título tiene 188 px de caja y, a 1,6rem,
                  "SÁNDWICHES" —una sola palabra, sin dónde cortar— pedía 223 y
                  quedaba cortado por el overflow-x-clip de la lista.
                */}
                <h3 className="display text-[clamp(1.25rem,5.5vw,3.5rem)] transition-colors group-hover:text-lima-hondo">
                  {categoria.nombre}
                </h3>
                <p className="mt-1.5 text-sm text-cacao-suave">
                  {cuantos} {cuantos === 1 ? "opción" : "opciones"}
                  {categoria.precioUnico !== null && ` · todas ${formatearPrecio(categoria.precioUnico)}`}
                </p>
              </div>

              <span
                aria-hidden="true"
                className={`hidden shrink-0 text-3xl transition-transform duration-300 sm:block ${
                  desdeLaDerecha ? "group-hover:-translate-x-2" : "group-hover:translate-x-2"
                }`}
              >
                {desdeLaDerecha ? "←" : "→"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

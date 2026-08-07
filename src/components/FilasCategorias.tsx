"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { IlustracionProducto, TIPO_POR_CATEGORIA } from "@/components/IlustracionProducto";
import { categorias, formatearPrecio } from "@/data/menu";
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
export function FilasCategorias() {
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
        const cuantos = categoria.grupos.reduce((total, g) => total + g.productos.length, 0);

        return (
          <li key={categoria.slug}>
            <Link
              href={`/carta#${categoria.slug}`}
              className={`group flex items-center gap-5 border-b border-borde py-6 sm:gap-10 sm:py-8 ${
                desdeLaDerecha ? "sm:flex-row-reverse sm:text-right" : ""
              }`}
            >
              <div
                className={`w-24 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 sm:w-40 ${
                  desdeLaDerecha ? "group-hover:-rotate-6" : "group-hover:rotate-6"
                }`}
              >
                <IlustracionProducto
                  tipo={TIPO_POR_CATEGORIA[categoria.slug] ?? "plato"}
                  nombre={categoria.nombre}
                  className="w-full"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="display text-[clamp(1.6rem,5.5vw,3.5rem)] transition-colors group-hover:text-lima-hondo">
                  {categoria.nombre}
                </h3>
                <p className="mt-1.5 text-sm text-cacao-suave">
                  {cuantos} {cuantos === 1 ? "opción" : "opciones"}
                  {categoria.precioUnico && ` · todas ${formatearPrecio(categoria.precioUnico)}`}
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

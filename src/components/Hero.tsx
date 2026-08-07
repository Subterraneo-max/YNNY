"use client";

import { useEffect, useRef } from "react";
import { BuscadorHero } from "@/components/BuscadorHero";
import { IlustracionProducto } from "@/components/IlustracionProducto";
import { TextoEnLetras } from "@/components/TextoEnLetras";
import { gsap, registrarGsap, prefiereMenosMovimiento } from "@/lib/animaciones";
import { sucursales } from "@/data/sucursales";
import { todosLosProductos } from "@/data/menu";
import { sitio } from "@/lib/sitio";

/**
 * La entrada del hero es CSS (clases `entra` y `entra-letras`): pinta en el
 * primer frame, sin esperar a que baje ni hidrate el JavaScript.
 *
 * GSAP acá se ocupa únicamente del parallax, que por definición no puede
 * ocurrir antes de que la persona scrollee.
 */
export function Hero() {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo || prefiereMenosMovimiento()) return;

    registrarGsap();

    const ctx = gsap.context(() => {
      const parallax = {
        trigger: nodo,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      } as const;

      gsap.to("[data-hero='ilustracion-izq']", {
        yPercent: -34,
        ease: "none",
        scrollTrigger: parallax,
      });
      gsap.to("[data-hero='ilustracion-der']", {
        yPercent: 26,
        ease: "none",
        scrollTrigger: parallax,
      });
      gsap.to("[data-hero='titulo']", {
        yPercent: 12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: parallax,
      });
    }, nodo);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={raiz} className="relative overflow-hidden px-4 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="relative mx-auto max-w-6xl">
        {/*
          Las ilustraciones abrazan el titular como las fotos de la referencia.
          En celular quedan chicas y arrinconadas: a tamaño completo se comen las
          letras y el titular deja de leerse, que es lo único que no puede pasar.
        */}
        <div
          className="entra pointer-events-none absolute -top-4 -left-6 z-0 w-20 sm:top-10 sm:left-0 sm:w-48 lg:w-60"
          style={{ "--d": 140 } as React.CSSProperties}
        >
          <div data-hero="ilustracion-izq">
            <IlustracionProducto
              tipo="factura"
              nombre="medialunas recién horneadas"
              className="w-full drop-shadow-2xl"
            />
          </div>
        </div>

        <div
          className="entra pointer-events-none absolute -right-6 bottom-0 z-0 w-20 sm:top-28 sm:right-0 sm:bottom-auto sm:w-52 lg:w-64"
          style={{ "--d": 240 } as React.CSSProperties}
        >
          <div data-hero="ilustracion-der">
            <IlustracionProducto
              tipo="infusion"
              nombre="café recién hecho"
              className="w-full drop-shadow-2xl"
            />
          </div>
        </div>

        <div data-hero="titulo" className="relative z-10 text-center">
          <h1
            aria-label="Todo recién hecho, todos los días"
            className="entra-letras display text-[clamp(2.5rem,10.5vw,9rem)]"
          >
            <span className="block py-[0.04em]">
              <TextoEnLetras texto="TODO RECIÉN HECHO" />
            </span>
            <span className="block py-[0.04em] text-lima-hondo">
              <TextoEnLetras texto="TODOS LOS DÍAS" />
            </span>
          </h1>
        </div>

        <div className="relative z-10 mt-10 flex flex-col items-center gap-7">
          <p
            className="entra max-w-md text-center leading-relaxed text-cacao-suave"
            style={{ "--d": 300 } as React.CSSProperties}
          >
            Panadería, pastelería y cafetería en {sucursales.length} sucursales de{" "}
            {sitio.ciudad}. {todosLosProductos.length} cosas para desayunar, almorzar o
            merendar.
          </p>

          <div
            className="entra flex w-full justify-center"
            style={{ "--d": 380 } as React.CSSProperties}
          >
            <BuscadorHero />
          </div>

          <ul
            className="entra flex flex-wrap justify-center gap-x-8 gap-y-3"
            style={{ "--d": 460 } as React.CSSProperties}
          >
            {[
              { dato: sucursales.length, etiqueta: "sucursales" },
              { dato: todosLosProductos.length, etiqueta: "productos" },
              { dato: "7 a 21", etiqueta: "todos los días" },
            ].map((item) => (
              <li key={item.etiqueta} className="text-center">
                <p className="display text-3xl">{item.dato}</p>
                <p className="mt-0.5 text-xs font-semibold tracking-widest text-cacao-suave uppercase">
                  {item.etiqueta}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

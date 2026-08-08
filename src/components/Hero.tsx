"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { BuscadorHero } from "@/components/BuscadorHero";
import { TextoEnLetras } from "@/components/TextoEnLetras";
import { gsap, registrarGsap, prefiereMenosMovimiento } from "@/lib/animaciones";
import { sucursales } from "@/data/sucursales";
import { todosLosProductos } from "@/data/menu";
import { sitio } from "@/lib/sitio";
import fotoClose from "@/imagenes/cafe-pasteleria-close.jpg";
import fotoCozy from "@/imagenes/cafe-pasteleria-cozy.jpg";

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
        yPercent: -30,
        ease: "none",
        scrollTrigger: parallax,
      });
      gsap.to("[data-hero='ilustracion-der']", {
        yPercent: 22,
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

        {/*
          Las dos fotos cambian de rol según el ancho.

          En pantalla grande van flotando a los costados del titular, saliéndose
          por el borde, como en la referencia. En celular eso no funciona: a
          cualquier tamaño legible tapan las letras o se comen los números de
          abajo. Ahí pasan a ser un par en el flujo, debajo del titular, donde se
          ven grandes y no pisan nada.

          El `sm:contents` es lo que permite las dos cosas con un solo marcado:
          en pantalla grande el contenedor deja de generar caja y las fotos se
          posicionan contra la sección, no contra él.
        */}
        <div className="mt-8 flex justify-center gap-3 sm:contents">
          <div
            className="entra pointer-events-none w-[43%] sm:absolute sm:top-10 sm:-left-2 sm:z-0 sm:w-48 lg:w-60"
            style={{ "--d": 140 } as React.CSSProperties}
          >
            <div data-hero="ilustracion-izq" className="foto-hero">
              <Image
                src={fotoCozy}
                alt="Cappuccino con espuma dibujada y una medialuna, sobre la barra de madera de un café"
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 192px, 43vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div
            className="entra pointer-events-none w-[43%] sm:absolute sm:top-28 sm:-right-2 sm:z-0 sm:w-52 lg:w-64"
            style={{ "--d": 240 } as React.CSSProperties}
          >
            <div data-hero="ilustracion-der" className="foto-hero">
              <Image
                src={fotoClose}
                alt="Medialuna recién horneada y un café con leche servidos en platos blancos"
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 256px, (min-width: 640px) 208px, 43vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
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

"use client";

import { useEffect, useRef } from "react";
import { gsap, registrarGsap, ScrollTrigger, prefiereMenosMovimiento } from "@/lib/animaciones";

/**
 * Cinta infinita de texto. Se desplaza sola, pero además acelera con el scroll y
 * se da vuelta cuando subís: es el detalle que hace que la banda se sienta viva
 * en lugar de un loop de fondo.
 *
 * El truco del bucle: el contenido va duplicado y el tween corre hasta -50%.
 * Al llegar, la segunda copia está exactamente donde arrancó la primera.
 */
export function Marquesina({
  textos,
  className = "",
  velocidad = 26,
}: {
  textos: string[];
  className?: string;
  /** Segundos que tarda una vuelta completa. Más alto, más lento. */
  velocidad?: number;
}) {
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = pista.current;
    if (!nodo || prefiereMenosMovimiento()) return;
    registrarGsap();

    const cinta = gsap.to(nodo, {
      xPercent: -50,
      duration: velocidad,
      ease: "none",
      repeat: -1,
    });

    // Se suaviza a mano en vez de lanzar un gsap.to() por evento de scroll: esa
    // versión creaba un tween nuevo en cada frame de scroll y era ~100 ms de
    // trabajo extra en el hilo principal, justo mientras la página está cargando.
    let objetivo = 1;
    let actual = 1;

    const disparador = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Bajando va hacia un lado, subiendo hacia el otro.
        // El scroll rápido la empuja hasta 5x; nunca por debajo de su ritmo base.
        objetivo = self.direction * Math.min(5, 1 + Math.abs(self.getVelocity()) / 900);
      },
    });

    const suavizar = () => {
      actual += (objetivo - actual) * 0.08;
      cinta.timeScale(actual);
    };
    gsap.ticker.add(suavizar);

    return () => {
      gsap.ticker.remove(suavizar);
      disparador.kill();
      cinta.kill();
    };
  }, [velocidad]);

  // Duplicado: la primera copia se lee, la segunda tapa el hueco del bucle.
  const contenido = [...textos, ...textos];

  return (
    <div
      className={`w-full overflow-hidden bg-cacao py-4 text-crema select-none ${className}`}
      role="presentation"
    >
      <div ref={pista} className="flex w-max items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
        {contenido.map((texto, indice) => (
          <div key={`${texto}-${indice}`} className="flex shrink-0 items-center gap-8 sm:gap-12">
            <span className="display text-2xl whitespace-nowrap sm:text-4xl">{texto}</span>
            {/* Separador dibujado, no un carácter: un punto sólido se mantiene igual
                en cualquier tipografía y no se lee como un emoji de relleno. */}
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-lima sm:size-2.5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

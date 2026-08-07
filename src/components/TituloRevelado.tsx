"use client";

import { useEffect, useRef } from "react";
import { TextoEnLetras } from "@/components/TextoEnLetras";
import { gsap, registrarGsap, SALIDA, prefiereMenosMovimiento } from "@/lib/animaciones";

/**
 * Titular que entra letra por letra al aparecer en pantalla.
 *
 * Partir el texto en <span> por carácter hace que muchos lectores de pantalla lo
 * deletreen. Por eso el texto real va una sola vez en aria-label y los fragmentos
 * animados quedan ocultos al árbol de accesibilidad.
 */
export function TituloRevelado({
  texto,
  className = "",
  como: Etiqueta = "h2",
  retraso = 0,
}: {
  texto: string;
  className?: string;
  como?: "h1" | "h2" | "h3" | "p";
  retraso?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefiereMenosMovimiento() || !ref.current) return;
    registrarGsap();

    const letras = ref.current.querySelectorAll(".letra");
    const animacion = gsap.fromTo(
      letras,
      { yPercent: 115, opacity: 0, rotate: 4 },
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.85,
        ease: SALIDA,
        stagger: 0.022,
        delay: retraso,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      },
    );

    return () => {
      animacion.scrollTrigger?.kill();
      animacion.kill();
    };
  }, [retraso, texto]);

  return (
    <Etiqueta
      ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement>}
      className={className}
      aria-label={texto}
    >
      <TextoEnLetras texto={texto} />
    </Etiqueta>
  );
}

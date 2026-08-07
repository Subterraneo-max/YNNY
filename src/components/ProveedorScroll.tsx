"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registrarGsap, ScrollTrigger, prefiereMenosMovimiento } from "@/lib/animaciones";

/**
 * Scroll suave con Lenis, manejado por el mismo reloj que GSAP.
 *
 * Si Lenis corriera con su propio requestAnimationFrame, ScrollTrigger leería
 * posiciones de un frame distinto al que se está pintando y las animaciones
 * atadas al scroll temblarían. Por eso se apaga el rAF interno de Lenis y se lo
 * hace avanzar desde el ticker de GSAP.
 */
export function ProveedorScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // A quien pidió menos movimiento no se le secuestra el scroll del navegador.
    if (prefiereMenosMovimiento()) {
      document.documentElement.classList.add("js-sin-animacion");
      return;
    }

    registrarGsap();

    const lenis = new Lenis({
      duration: 1.1,
      // Desaceleración exponencial: arranca rápido y frena largo.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const avanzar = (tiempo: number) => lenis.raf(tiempo * 1000); // GSAP da segundos, Lenis quiere ms
    gsap.ticker.add(avanzar);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(avanzar);
      lenis.destroy();
    };
  }, []);

  // Red de seguridad: si por lo que sea GSAP nunca revela el contenido,
  // a los 2,5 s se muestra todo igual. Nunca una página en blanco.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const ocultos = document.querySelectorAll<HTMLElement>("[data-revelar]");
      const quedanInvisibles = [...ocultos].some(
        (el) => getComputedStyle(el).opacity === "0",
      );
      if (quedanInvisibles) document.documentElement.classList.add("js-sin-animacion");
    }, 2500);
    return () => window.clearTimeout(id);
  }, []);

  return <>{children}</>;
}

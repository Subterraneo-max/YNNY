import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registrado = false;

/** GSAP se queja si se registra el plugin dos veces, y en dev esto corre repetido. */
export function registrarGsap() {
  if (registrado || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registrado = true;
}

export function prefiereMenosMovimiento() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Curva usada en todo el sitio, para que las animaciones se sientan de la misma familia. */
export const SALIDA = "power3.out";

export { gsap, ScrollTrigger };

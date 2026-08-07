"use client";

import { useEffect, useRef } from "react";
import { gsap, registrarGsap, SALIDA, prefiereMenosMovimiento } from "@/lib/animaciones";

type Direccion = "abajo" | "izquierda" | "derecha" | "escala";

const DESDE: Record<Direccion, gsap.TweenVars> = {
  abajo: { y: 48 },
  izquierda: { x: -56 },
  derecha: { x: 56 },
  escala: { scale: 0.88 },
};

/**
 * Envoltorio genérico de entrada por scroll.
 *
 * - `escalonar` anima de a uno en lugar del bloque entero.
 * - `objetivo` es un selector CSS para elegir qué se anima adentro; sirve cuando
 *   los hijos directos no son lo que hay que mover (por ejemplo un <ul> cuyo
 *   escalonado tiene que caer sobre cada <li>).
 */
export function Revelar({
  children,
  className = "",
  desde = "abajo",
  retraso = 0,
  escalonar = false,
  objetivo,
}: {
  children: React.ReactNode;
  className?: string;
  desde?: Direccion;
  retraso?: number;
  escalonar?: boolean;
  objetivo?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    if (prefiereMenosMovimiento()) {
      gsap.set(nodo, { opacity: 1 });
      return;
    }

    registrarGsap();

    const elegidos = objetivo
      ? Array.from(nodo.querySelectorAll(objetivo))
      : escalonar
        ? Array.from(nodo.children)
        : null;

    // El contenedor arranca en opacity 0 por CSS. Cuando lo que se anima son los
    // hijos, hay que devolverle la opacidad al padre o no se ve nada.
    if (elegidos) gsap.set(nodo, { opacity: 1 });

    const animacion = gsap.fromTo(
      elegidos ?? nodo,
      { ...DESDE[desde], opacity: 0 },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: SALIDA,
        delay: retraso,
        stagger: elegidos ? 0.09 : 0,
        scrollTrigger: { trigger: nodo, start: "top 90%", once: true },
      },
    );

    return () => {
      animacion.scrollTrigger?.kill();
      animacion.kill();
    };
  }, [desde, retraso, escalonar, objetivo]);

  return (
    <div ref={ref} data-revelar className={className}>
      {children}
    </div>
  );
}

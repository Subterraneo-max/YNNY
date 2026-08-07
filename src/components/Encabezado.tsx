"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { sitio } from "@/lib/sitio";

const enlaces = [
  { href: "/carta", texto: "Carta" },
  { href: "/sucursales", texto: "Sucursales" },
];

export function Encabezado() {
  const [oculto, setOculto] = useState(false);
  const [despegado, setDespegado] = useState(false);

  useEffect(() => {
    let anterior = window.scrollY;

    const alScrollear = () => {
      const actual = window.scrollY;
      setDespegado(actual > 24);
      // Se esconde al bajar y vuelve al primer gesto hacia arriba, que es lo que
      // espera la mano en el celular. Cerca del tope no se esconde nunca.
      setOculto(actual > anterior && actual > 220);
      anterior = actual;
    };

    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {sitio.esDemo && (
        <p className="bg-cacao px-4 py-1.5 text-center text-[0.72rem] leading-tight text-crema/85 sm:text-xs">
          <span className="font-semibold text-lima">Propuesta no oficial</span>
          <span className="mx-1.5 text-crema/40">·</span>
          Demo hecha por {sitio.autorDemo}. No pertenece a {sitio.nombreCorto}.
        </p>
      )}

      <header
        className={`transition-[transform,background-color,border-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          oculto ? "-translate-y-[130%]" : "translate-y-0"
        } ${despegado ? "border-b border-borde bg-crema/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"}`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center" aria-label={`${sitio.nombreCorto}, inicio`}>
            <Logo conBajada={false} className="w-12 text-[1.7rem]" />
          </Link>

          <div className="hidden items-center gap-8 sm:flex">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="group relative text-sm font-semibold tracking-wide"
              >
                {enlace.texto}
                {/* Subrayado que crece desde la izquierda al pasar por encima. */}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-lima-hondo transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* En celular el rótulo se acorta: "Pedir ahora" junto al logo y al link
              de Carta no entra en 390 px y el botón terminaba cortado. */}
          <div className="flex items-center gap-3">
            <Link href="/carta" className="text-sm font-semibold tracking-wide sm:hidden">
              Carta
            </Link>
            <Link
              href="/sucursales"
              className="inline-block rounded-sm bg-cacao px-4 py-2.5 text-sm font-bold whitespace-nowrap text-crema transition duration-200 hover:scale-105 hover:bg-lima hover:text-cacao active:scale-95 sm:px-5"
            >
              Pedir<span className="hidden sm:inline"> ahora</span>
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}

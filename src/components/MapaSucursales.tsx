"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Sucursal } from "@/data/sucursales";

/**
 * El mapa de sucursales, cargado con cuentagotas.
 *
 * Leaflet y los tiles no tienen por qué descargarse si la persona nunca baja
 * hasta acá, así que el componente real vive en un chunk aparte que se pide
 * recién cuando la sección se asoma en pantalla. Hasta entonces se ve el marco
 * con el mismo alto, que es lo que evita que la página salte cuando aparece.
 *
 * `ssr: false` es obligatorio: Leaflet toca `window` al importarse.
 */
const MapaLeaflet = dynamic(
  () => import("./MapaLeaflet").then((m) => m.MapaLeaflet),
  { ssr: false, loading: () => <Marco /> },
);

function Marco() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-crema-hondo">
      <span className="text-xs font-semibold tracking-[0.18em] text-cacao-suave uppercase">
        Cargando mapa
      </span>
    </div>
  );
}

export function MapaSucursales({
  sucursales,
  destacadaId,
  className = "h-[19rem] sm:h-[24rem]",
}: {
  sucursales: Sucursal[];
  destacadaId?: string;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return;

    let observador: IntersectionObserver | null = null;

    // Los tiles no pueden pelearle ancho de banda al primer pintado: hasta que la
    // página no terminó de cargar, el mapa ni se pide.
    const cuandoCargue = (fn: () => void) => {
      if (document.readyState === "complete") {
        fn();
        return () => {};
      }
      window.addEventListener("load", fn, { once: true });
      return () => window.removeEventListener("load", fn);
    };

    const arrancar = () => {
      // Sin IntersectionObserver (navegadores viejos) se carga y listo: es peor
      // quedarse sin mapa que cargarlo antes de tiempo.
      if (typeof IntersectionObserver === "undefined") {
        setVisible(true);
        return;
      }

      observador = new IntersectionObserver(
        ([entrada]) => {
          if (!entrada.isIntersecting) return;
          setVisible(true);
          observador?.disconnect();
        },
        // Arranca a cargar un poco antes de que se vea, para que llegue a tiempo.
        { rootMargin: "320px" },
      );

      observador.observe(nodo);
    };

    const limpiar = cuandoCargue(arrancar);
    return () => {
      limpiar();
      observador?.disconnect();
    };
  }, []);

  return (
    <div
      ref={caja}
      className={`overflow-hidden border border-borde bg-crema-hondo ${className}`}
    >
      {visible ? (
        <MapaLeaflet sucursales={sucursales} destacadaId={destacadaId} />
      ) : (
        <Marco />
      )}
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { estadoDeApertura, textoDeEstado } from "@/lib/horarios";

/**
 * El reloj es estado externo a React, así que se lee suscribiéndose a él.
 *
 * Importa que esto NO se calcule en el servidor: las páginas son estáticas, así
 * que el estado quedaría congelado en la hora del build y diría "abierto" a las
 * tres de la mañana. Por eso `getServerSnapshot` devuelve null y el badge recién
 * aparece en el cliente.
 *
 * El tick cada 30 s hace que el cartel se dé vuelta solo cuando el local abre o
 * cierra, sin que haya que recargar.
 */
function suscribirAlReloj(alCambiar: () => void) {
  const id = setInterval(alCambiar, 30_000);
  return () => clearInterval(id);
}

export function EstadoSucursal({ className = "" }: { className?: string }) {
  const marca = useSyncExternalStore(
    suscribirAlReloj,
    () => Math.floor(Date.now() / 30_000),
    () => null,
  );

  // Mientras no sepamos la hora, se reserva el alto exacto del badge para que
  // al aparecer no empuje el contenido de abajo.
  if (marca === null) return <p className={`h-5 ${className}`} aria-hidden="true" />;

  const estado = estadoDeApertura();
  const texto = textoDeEstado(estado);

  return (
    <p className={`flex items-center gap-2 text-sm leading-5 ${className}`}>
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full ${
          estado.abierto ? "bg-lima-hondo" : "bg-cacao-suave/50"
        }`}
      />
      <span className={estado.abierto ? "font-semibold text-lima-hondo" : "text-cacao-suave"}>
        {texto}
      </span>
    </p>
  );
}

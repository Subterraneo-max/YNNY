"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Buscador del hero, como el de la referencia.
 *
 * El término viaja en el hash y no como query string a propósito: así la carta
 * sigue siendo una página estática. Con `?q=` Next tendría que renderizarla en
 * cada visita y perderíamos la carga instantánea, que es medio argumento de venta.
 */
export function BuscadorHero() {
  const router = useRouter();
  const [termino, setTermino] = useState("");

  function buscar(evento: React.FormEvent) {
    evento.preventDefault();
    const limpio = termino.trim();
    router.push(limpio ? `/carta#q=${encodeURIComponent(limpio)}` : "/carta");
  }

  return (
    <form onSubmit={buscar} className="flex w-full max-w-md items-stretch bg-crema shadow-sm">
      <label htmlFor="buscar-hero" className="sr-only">
        Buscar en la carta
      </label>
      <input
        id="buscar-hero"
        type="search"
        value={termino}
        onChange={(evento) => setTermino(evento.target.value)}
        placeholder="Buscá medialunas, palta, empanadas…"
        className="min-w-0 flex-1 border border-cacao/25 border-r-0 bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-cacao-suave/70 focus:border-cacao"
      />
      <button
        type="submit"
        className="shrink-0 bg-cacao px-6 py-3.5 text-sm font-bold text-crema transition duration-200 hover:scale-[1.03] hover:bg-lima hover:text-cacao active:scale-[0.97]"
      >
        Buscar
      </button>
    </form>
  );
}

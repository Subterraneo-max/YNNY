import type { Metadata } from "next";
import { CartaNavegable } from "@/components/CartaNavegable";
import { categorias, todosLosProductos } from "@/data/menu";
import { sitio } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Carta",
  // Nombrar las categorías acá es lo que hace que la carta aparezca en Google.
  description: `Carta completa de ${sitio.nombre}: ${categorias
    .map((categoria) => categoria.nombre.toLowerCase())
    .join(", ")}. Precios actualizados.`,
};

export default function PaginaCarta() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lima-hondo">
          Todo recién hecho
        </p>
        <h1 className="titular mt-2 text-4xl sm:text-5xl">Nuestra carta</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-tinta-suave">
          {todosLosProductos.length} productos en {categorias.length} categorías. Buscá lo que
          quieras o tocá una categoría para ir directo.
        </p>
      </header>

      <CartaNavegable />
    </div>
  );
}

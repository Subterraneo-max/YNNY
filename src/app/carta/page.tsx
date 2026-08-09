import type { Metadata } from "next";
import { CartaNavegable } from "@/components/CartaNavegable";
import { Marquesina } from "@/components/Marquesina";
import { TituloEntrada } from "@/components/TituloEntrada";
import { cantidadRedonda, categorias } from "@/data/menu";
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
    <>
      <div className="mx-auto max-w-3xl px-4 pt-32 pb-8 sm:pt-40">
        <p className="text-xs font-bold tracking-[0.2em] text-lima-hondo uppercase">
          Todo recién hecho
        </p>
        <TituloEntrada
          texto="Nuestra carta"
          como="h1"
          className="display mt-3 text-[clamp(2.4rem,9.6vw,6.5rem)]"
        />
        <div className="entra" style={{ "--d": 220 } as React.CSSProperties}>
          <p className="mt-5 max-w-xl leading-relaxed text-cacao-suave">
            Más de {cantidadRedonda} opciones en {categorias.length} categorías, todas
            recién hechas. Buscá lo que quieras o elegí una categoría.
          </p>
        </div>
      </div>

      <Marquesina
        textos={categorias.map((categoria) => categoria.nombre.toUpperCase())}
        velocidad={28}
      />

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <CartaNavegable />
      </div>
    </>
  );
}

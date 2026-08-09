import Image, { type StaticImageData } from "next/image";
import desayunos from "@/imagenes/categorias/desayunos.jpg";
import almuerzos from "@/imagenes/categorias/almuerzos.jpg";
import sandwiches from "@/imagenes/categorias/sandwiches.jpg";
import wraps from "@/imagenes/categorias/wraps.jpg";
import ensaladas from "@/imagenes/categorias/ensaladas.jpg";
import tartas from "@/imagenes/categorias/tartas.jpg";
import empanadas from "@/imagenes/categorias/empanadas.jpg";
import pizzas from "@/imagenes/categorias/pizzas.jpg";

/**
 * Una foto por categoría de la carta.
 *
 * Todas están recortadas en cuadrado y elegidas con el mismo criterio —luz
 * cálida, fondo de madera o cerámica, producto llenando el encuadre— para que
 * puestas una al lado de la otra parezcan de la misma sesión y no ocho fotos
 * sueltas de un banco de imágenes.
 *
 * Son de un local genérico, no de YNNY. Al cerrar el trabajo se reemplazan por
 * fotos del cliente: mismo nombre de archivo, misma carpeta, nada más que tocar.
 */
const FOTOS: Record<string, StaticImageData> = {
  desayunos,
  almuerzos,
  sandwiches,
  wraps,
  ensaladas,
  tartas,
  empanadas,
  pizzas,
};

/** Descripciones para lectores de pantalla, no reaprovechables del nombre de la categoría. */
const TEXTOS: Record<string, string> = {
  desayunos: "Medialunas recién horneadas, doradas y hojaldradas",
  almuerzos: "Milanesa con papas y limón servida en un plato blanco",
  sandwiches: "Tostado de jamón y queso cortado en dos, sobre una mesa de madera",
  wraps: "Wrap relleno de palta y verdes frescos, sobre una tabla de madera",
  ensaladas: "Ensalada fresca con palta, tomates cherry, garbanzos y hojas verdes",
  tartas: "Tarta salada recién horneada en su molde, sobre una mesa de madera",
  empanadas: "Empanadas horneadas con repulgue, servidas en una fuente",
  pizzas: "Pizza muzzarella con albahaca fresca y borde bien cocido",
};

export function FotoCategoria({
  slug,
  className = "",
  sizes,
  prioridad = false,
}: {
  slug: string;
  className?: string;
  /** Anchos reales de render, para que el navegador no baje una imagen más grande de la necesaria. */
  sizes: string;
  prioridad?: boolean;
}) {
  const foto = FOTOS[slug];
  if (!foto) return null;

  return (
    <Image
      src={foto}
      alt={TEXTOS[slug] ?? ""}
      placeholder="blur"
      loading={prioridad ? undefined : "lazy"}
      priority={prioridad}
      sizes={sizes}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

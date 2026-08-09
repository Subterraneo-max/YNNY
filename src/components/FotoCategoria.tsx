import Image, { type StaticImageData } from "next/image";
import desayunos from "@/imagenes/categorias/desayunos.jpg";
import almuerzos from "@/imagenes/categorias/almuerzos.jpg";
import sandwiches from "@/imagenes/categorias/sandwiches.jpg";
import wraps from "@/imagenes/categorias/wraps.jpg";
import ensaladas from "@/imagenes/categorias/ensaladas.jpg";
import tartas from "@/imagenes/categorias/tartas.jpg";
import empanadas from "@/imagenes/categorias/empanadas.jpg";
import pizzas from "@/imagenes/categorias/pizzas.jpg";
import canelones from "@/imagenes/productos/canelones.jpg";

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

/**
 * Fotos de un plato puntual.
 *
 * El carrusel de la home no anuncia una categoría sino un producto concreto, así
 * que la foto de la categoría no siempre sirve: "Almuerzos" se representa bien
 * con una milanesa, pero el plato destacado son canelones, y mostrar una
 * milanesa debajo de la palabra "canelones" es directamente un error.
 *
 * Cuando el destacado de una categoría cambie, revisar si hace falta sumar acá
 * la foto del plato nuevo.
 */
const FOTOS_PRODUCTO: Record<string, StaticImageData> = {
  "Canelones de carne y verdura con salsa tuco": canelones,
};

const TEXTOS_PRODUCTO: Record<string, string> = {
  "Canelones de carne y verdura con salsa tuco":
    "Canelones con salsa de tomate y queso rallado, servidos en un plato hondo",
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
  producto,
  className = "",
  sizes,
  prioridad = false,
}: {
  slug: string;
  /** Nombre del plato, cuando lo que se anuncia es un producto y no la categoría. */
  producto?: string;
  className?: string;
  /** Anchos reales de render, para que el navegador no baje una imagen más grande de la necesaria. */
  sizes: string;
  prioridad?: boolean;
}) {
  // La foto del plato manda sobre la de la categoría; si no hay, cae en la genérica.
  const foto = (producto && FOTOS_PRODUCTO[producto]) ?? FOTOS[slug];
  const texto = (producto && TEXTOS_PRODUCTO[producto]) ?? TEXTOS[slug] ?? "";
  if (!foto) return null;

  return (
    <Image
      src={foto}
      alt={texto}
      placeholder="blur"
      loading={prioridad ? undefined : "lazy"}
      priority={prioridad}
      sizes={sizes}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

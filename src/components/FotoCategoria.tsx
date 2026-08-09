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
import wrapCarne from "@/imagenes/productos/wrap-carne.jpg";
import submarino from "@/imagenes/productos/submarino.jpg";
import torta from "@/imagenes/productos/torta.jpg";

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
// La clave lleva la categoría adelante porque hay nombres genéricos —"Carne",
// "Pollo", "Jamón y queso"— que se repiten en más de una categoría.
const FOTOS_PRODUCTO: Record<string, StaticImageData> = {
  "almuerzos/Canelones de carne y verdura con salsa tuco": canelones,
  "wraps/Carne": wrapCarne,
  "desayunos/Submarino + 2 medialunas": submarino,
  "desayunos/Infusión + medio tostado + vaso de jugo": sandwiches,
  "desayunos/Infusión + porción de torta + vaso de jugo": torta,
};

const TEXTOS_PRODUCTO: Record<string, string> = {
  "almuerzos/Canelones de carne y verdura con salsa tuco":
    "Canelones con salsa de tomate y queso rallado, servidos en un plato hondo",
  "wraps/Carne": "Wrap de carne cortado al medio, con tomate y verdes a la vista",
  "desayunos/Submarino + 2 medialunas":
    "Taza de submarino bien caliente con medialunas de fondo",
  "desayunos/Infusión + medio tostado + vaso de jugo":
    "Tostado de jamón y queso cortado en dos, sobre una mesa de madera",
  "desayunos/Infusión + porción de torta + vaso de jugo":
    "Porción de torta con crema y frutilla servida en un plato",
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
  const clave = producto ? `${slug}/${producto}` : null;
  const foto = (clave && FOTOS_PRODUCTO[clave]) ?? FOTOS[slug];
  const texto = (clave && TEXTOS_PRODUCTO[clave]) ?? TEXTOS[slug] ?? "";
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

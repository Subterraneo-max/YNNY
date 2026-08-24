import type { CategoriaCarta, ProductoUbicado } from "./tipos";

/**
 * Todo lo que se calcula a partir de la carta y antes vivía como constante en
 * `src/data/menu.ts`. Ahora son funciones porque la carta cambia sin recompilar.
 */

export const formatearPrecio = (precio: number) => "$" + precio.toLocaleString("es-AR");

/** Todos los productos aplanados, con el contexto de dónde están. Para el buscador. */
export function aplanarProductos(categorias: CategoriaCarta[]): ProductoUbicado[] {
  return categorias.flatMap((categoria) =>
    categoria.grupos.flatMap((grupo) =>
      grupo.productos.map((producto) => ({
        ...producto,
        categoriaId: categoria.id,
        categoriaSlug: categoria.slug,
        categoriaNombre: categoria.nombre,
        grupoNombre: grupo.nombre,
      })),
    ),
  );
}

/**
 * Para los textos de la web: "más de 70" se lee mejor que un número exacto y,
 * sobre todo, no queda raro cada vez que se suma o se saca un producto.
 */
export function cantidadRedonda(categorias: CategoriaCarta[]): number {
  return Math.floor(aplanarProductos(categorias).length / 10) * 10;
}

/**
 * "Los favoritos de YNNY": los que están marcados como destacados en el panel.
 *
 * Se cortan en cuatro porque la grilla de la home es de cuatro tarjetas. Si en
 * el panel marcan más, entran los cuatro primeros por orden; el panel avisa.
 */
export const CUANTOS_FAVORITOS = 4;

export function favoritosDe(categorias: CategoriaCarta[]): ProductoUbicado[] {
  return aplanarProductos(categorias)
    .filter((producto) => producto.destacado)
    .slice(0, CUANTOS_FAVORITOS);
}

export type ProductoEscaparate = ProductoUbicado & { cuantosHay: number };

/**
 * Selección para el carrusel de la home: un producto por categoría, el más
 * barato de cada una, para que el escaparate arranque por el precio de entrada.
 *
 * No se edita desde el panel a propósito: se calcula de los precios, así que no
 * puede quedar contradiciendo a la carta.
 */
export function destacadosDe(categorias: CategoriaCarta[]): ProductoEscaparate[] {
  return categorias
    .map((categoria): ProductoEscaparate | null => {
      const productos = categoria.grupos.flatMap((grupo) => grupo.productos);
      if (productos.length === 0) return null;

      const masBarato = productos.reduce((menor, actual) =>
        (actual.precio ?? Infinity) < (menor.precio ?? Infinity) ? actual : menor,
      );

      return {
        ...masBarato,
        categoriaId: categoria.id,
        categoriaSlug: categoria.slug,
        categoriaNombre: categoria.nombre,
        grupoNombre: null,
        cuantosHay: productos.length,
      };
    })
    .filter((producto): producto is ProductoEscaparate => producto !== null);
}

/** Cuántos productos tiene una categoría. Para el "8 opciones" de las filas. */
export function cuantosEn(categoria: CategoriaCarta): number {
  return categoria.grupos.reduce((total, grupo) => total + grupo.productos.length, 0);
}

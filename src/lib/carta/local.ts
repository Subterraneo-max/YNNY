import { categorias as categoriasLocales } from "@/data/menu";
import type { Carta, CategoriaCarta, OrigenCarta } from "./tipos";

/**
 * La carta del archivo local, con la forma que esperan las vistas.
 *
 * `src/data/menu.ts` sigue siendo la transcripción original del PDF y cumple dos
 * papeles: es la semilla con la que se carga Supabase y es el respaldo que se
 * sirve si Supabase no está configurado o falla. Mientras exista este archivo,
 * la web pública compila y funciona aunque no haya base de datos.
 *
 * Es de solo lectura: los ids son sintéticos y nunca se escriben.
 */

/** Los cuatro de "Los favoritos de YNNY". Igual que la semilla de Supabase. */
const FAVORITOS = new Set([
  "Infusión + 2 facturas",
  "Submarino + 2 medialunas",
  "Infusión + medio tostado + vaso de jugo",
  "Infusión + porción de torta + vaso de jugo",
]);

function armarCategorias(): CategoriaCarta[] {
  return categoriasLocales.map((categoria) => ({
    id: `local:${categoria.slug}`,
    slug: categoria.slug,
    nombre: categoria.nombre,
    precioUnico: categoria.precioUnico ?? null,
    nota: categoria.nota ?? null,
    fotoUrl: null,
    grupos: categoria.grupos.map((grupo, indiceGrupo) => ({
      id: `local:${categoria.slug}:${indiceGrupo}`,
      nombre: grupo.nombre ?? null,
      productos: grupo.productos.map((producto, indiceProducto) => ({
        id: `local:${categoria.slug}:${indiceGrupo}:${indiceProducto}`,
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? null,
        precio: producto.precio,
        disponible: true,
        destacado: FAVORITOS.has(producto.nombre),
        fotoUrl: null,
      })),
    })),
  }));
}

export function cartaLocal(origen: OrigenCarta, motivo?: string): Carta {
  return { categorias: armarCategorias(), origen, motivo };
}

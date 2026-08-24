import "server-only";

import { CLAVE_PUBLICA, ETIQUETA_CARTA, URL_SUPABASE } from "@/lib/supabase/entorno";
import type { Carta, CategoriaCarta } from "./tipos";

/**
 * La carta leída de Supabase.
 *
 * Va con `fetch` crudo contra PostgREST (la API REST que Supabase expone sobre
 * la base) en vez de con el cliente `supabase-js`. El motivo es el caché: así
 * puedo marcar la respuesta con `cache: "force-cache"` y una etiqueta, que es
 * lo que permite que /carta y / se sigan sirviendo estáticas desde el CDN y que
 * al guardar en el panel se invaliden solas, sin deploy.
 *
 * Una sola consulta trae todo: categorías con sus grupos y sus productos.
 */

type FilaGrupo = {
  id: string;
  nombre: string | null;
  orden: number;
};

type FilaProducto = {
  id: string;
  grupo_id: string | null;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  disponible: boolean;
  destacado: boolean;
  activo: boolean;
  orden: number;
  foto_url: string | null;
};

type FilaCategoria = {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
  precio_unico: number | null;
  nota: string | null;
  foto_url: string | null;
  activa: boolean;
  grupos: FilaGrupo[];
  productos: FilaProducto[];
};

const CAMPOS = [
  "id",
  "slug",
  "nombre",
  "orden",
  "precio_unico",
  "nota",
  "foto_url",
  "activa",
  "grupos(id,nombre,orden)",
  "productos(id,grupo_id,nombre,descripcion,precio,disponible,destacado,activo,orden,foto_url)",
].join(",");

const porOrden = <T extends { orden: number }>(a: T, b: T) => a.orden - b.orden;

const grupoConocido = (id: string | null, grupos: FilaGrupo[]) =>
  id !== null && grupos.some((grupo) => grupo.id === id);

function armar(filas: FilaCategoria[]): CategoriaCarta[] {
  return filas
    .filter((categoria) => categoria.activa)
    .sort(porOrden)
    .map((categoria) => {
      const activos = categoria.productos.filter((producto) => producto.activo).sort(porOrden);

      const grupos = [...categoria.grupos].sort(porOrden).map((grupo) => ({
        id: grupo.id,
        nombre: grupo.nombre,
        productos: activos
          .filter((producto) => producto.grupo_id === grupo.id)
          .map((producto) => ({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            disponible: producto.disponible,
            destacado: producto.destacado,
            fotoUrl: producto.foto_url,
          })),
      }));

      // Un producto sin grupo (o cuyo grupo se borró) no puede desaparecer de la
      // carta en silencio: va a un bloque sin título al final.
      const huerfanos = activos.filter(
        (producto) => !grupoConocido(producto.grupo_id, categoria.grupos),
      );

      if (huerfanos.length > 0) {
        grupos.push({
          id: `${categoria.id}:sin-grupo`,
          nombre: null,
          productos: huerfanos.map((producto) => ({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            disponible: producto.disponible,
            destacado: producto.destacado,
            fotoUrl: producto.foto_url,
          })),
        });
      }

      return {
        id: categoria.id,
        slug: categoria.slug,
        nombre: categoria.nombre,
        precioUnico: categoria.precio_unico,
        nota: categoria.nota,
        fotoUrl: categoria.foto_url,
        // Un grupo vacío se ve como un subtítulo suelto sin nada debajo.
        grupos: grupos.filter((grupo) => grupo.productos.length > 0),
      };
    })
    .filter((categoria) => categoria.grupos.length > 0);
}

export async function cartaDeSupabase(): Promise<Carta> {
  const url =
    `${URL_SUPABASE}/rest/v1/categorias` +
    `?select=${encodeURIComponent(CAMPOS)}` +
    `&order=orden.asc`;

  const respuesta = await fetch(url, {
    headers: {
      apikey: CLAVE_PUBLICA,
      Authorization: `Bearer ${CLAVE_PUBLICA}`,
      Accept: "application/json",
    },
    // Se cachea sin vencimiento y se invalida a mano desde el panel. Es lo que
    // mantiene las páginas públicas estáticas: sin esto, cada visita pegaría
    // contra Supabase y la web dejaría de servirse desde el CDN.
    cache: "force-cache",
    next: { tags: [ETIQUETA_CARTA] },
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "");
    throw new Error(
      `Supabase respondió ${respuesta.status} al pedir la carta. ${detalle.slice(0, 300)}`,
    );
  }

  const filas = (await respuesta.json()) as FilaCategoria[];
  return { categorias: armar(filas), origen: "supabase" };
}

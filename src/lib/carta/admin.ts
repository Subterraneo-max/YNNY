import "server-only";

import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Lectura de la carta para el panel.
 *
 * Es distinta de la lectura pública en dos cosas y por buenos motivos:
 *
 *  1. **No se cachea.** El encargado tiene que ver lo que acaba de guardar.
 *  2. **Trae lo desactivado.** Un producto dado de baja tiene que seguir siendo
 *     visible en el panel para poder volver a activarlo; en la web no aparece.
 *
 * Va con el cliente que lleva la sesión, así que RLS le deja ver todo solo si
 * quien pregunta es administrador.
 */

export type GrupoAdmin = {
  id: string;
  categoria_id: string;
  nombre: string | null;
  orden: number;
};

export type CategoriaAdmin = {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
  precio_unico: number | null;
  nota: string | null;
  foto_url: string | null;
  activa: boolean;
};

export type ProductoAdmin = {
  id: string;
  categoria_id: string;
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

export type CartaAdmin = {
  categorias: CategoriaAdmin[];
  grupos: GrupoAdmin[];
  productos: ProductoAdmin[];
};

export async function leerCartaAdmin(): Promise<CartaAdmin> {
  const supabase = await clienteServidor();

  const [categorias, grupos, productos] = await Promise.all([
    supabase.from("categorias").select("*").order("orden"),
    supabase.from("grupos").select("*").order("orden"),
    supabase.from("productos").select("*").order("orden"),
  ]);

  const error = categorias.error ?? grupos.error ?? productos.error;
  if (error) {
    throw new Error(`No se pudo leer la carta desde Supabase: ${error.message}`);
  }

  return {
    categorias: (categorias.data ?? []) as CategoriaAdmin[],
    grupos: (grupos.data ?? []) as GrupoAdmin[],
    productos: (productos.data ?? []) as ProductoAdmin[],
  };
}

export async function leerProducto(id: string): Promise<ProductoAdmin | null> {
  const supabase = await clienteServidor();
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`No se pudo leer el producto: ${error.message}`);
  return (data as ProductoAdmin | null) ?? null;
}

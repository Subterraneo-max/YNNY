"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ETIQUETA_CARTA } from "@/lib/supabase/entorno";
import { clienteServidor, esAdministrador } from "@/lib/supabase/servidor";

/**
 * Todo lo que el panel escribe pasa por acá.
 *
 * Son Server Actions: corren en el servidor de Vercel, nunca en el navegador.
 * El navegador manda el formulario y recibe el resultado; la clave, la sesión y
 * la consulta a la base quedan siempre del lado del servidor.
 *
 * Cada acción hace lo mismo en el mismo orden:
 *
 *   1. confirma que quien escribe es administrador;
 *   2. valida y limpia lo que llegó del formulario;
 *   3. escribe en Supabase;
 *   4. invalida el caché de la web pública.
 *
 * El paso 1 está de más desde el punto de vista de la seguridad —RLS ya lo
 * impide del lado de la base— pero permite devolver "no tenés permiso" en vez
 * de un error críptico de Postgres. La seguridad de verdad está en la base.
 */

export type Resultado = { ok: true; mensaje: string } | { ok: false; error: string };

/**
 * Lo que hace que el cambio aparezca en la web sin deploy.
 *
 * `updateTag` vence el caché de la consulta a Supabase en el acto: el próximo
 * visitante ya ve el precio nuevo, no una versión vieja. `revalidatePath` tira
 * abajo el HTML guardado de las dos páginas que muestran la carta.
 */
function refrescarWebPublica() {
  updateTag(ETIQUETA_CARTA);
  revalidatePath("/");
  revalidatePath("/carta");
}

async function exigirAdmin(): Promise<string | null> {
  if (!(await esAdministrador())) {
    return "No tenés permiso para editar la carta. Iniciá sesión con la cuenta de YNNY.";
  }
  return null;
}

// -----------------------------------------------------------------------------
//  Lectura de formularios
// -----------------------------------------------------------------------------

const texto = (form: FormData, campo: string): string =>
  String(form.get(campo) ?? "").trim();

/** Los campos opcionales van como null y no como cadena vacía. */
const textoOpcional = (form: FormData, campo: string): string | null => {
  const valor = texto(form, campo);
  return valor.length > 0 ? valor : null;
};

const casilla = (form: FormData, campo: string): boolean => form.get(campo) === "on";

const entero = (form: FormData, campo: string): number => {
  const valor = Number.parseInt(texto(form, campo), 10);
  return Number.isFinite(valor) ? valor : 0;
};

/**
 * Precio en pesos enteros.
 *
 * Acepta lo que un encargado escribe de verdad: "4.500", "$ 4500", "4500 ".
 * Vacío significa "sin precio" y la web muestra "Consultar".
 */
function precio(form: FormData, campo: string): number | null | "invalido" {
  const crudo = texto(form, campo).replace(/[$\s.]/g, "").replace(",", ".");
  if (crudo.length === 0) return null;
  const valor = Number(crudo);
  if (!Number.isFinite(valor) || valor < 0) return "invalido";
  return Math.round(valor);
}

// -----------------------------------------------------------------------------
//  Productos
// -----------------------------------------------------------------------------

export async function guardarProducto(
  _anterior: Resultado | null,
  form: FormData,
): Promise<Resultado> {
  const noPermitido = await exigirAdmin();
  if (noPermitido) return { ok: false, error: noPermitido };

  const id = textoOpcional(form, "id");
  const nombre = texto(form, "nombre");
  if (nombre.length === 0) {
    return { ok: false, error: "El producto necesita un nombre." };
  }

  const categoriaId = texto(form, "categoria_id");
  if (categoriaId.length === 0) {
    return { ok: false, error: "Elegí una categoría." };
  }

  const valorPrecio = precio(form, "precio");
  if (valorPrecio === "invalido") {
    return { ok: false, error: "El precio tiene que ser un número. Por ejemplo: 4500." };
  }

  const fila = {
    categoria_id: categoriaId,
    grupo_id: textoOpcional(form, "grupo_id"),
    nombre,
    descripcion: textoOpcional(form, "descripcion"),
    precio: valorPrecio,
    disponible: casilla(form, "disponible"),
    destacado: casilla(form, "destacado"),
    activo: casilla(form, "activo"),
    orden: entero(form, "orden"),
    foto_url: textoOpcional(form, "foto_url"),
  };

  const supabase = await clienteServidor();

  const { error } = id
    ? await supabase.from("productos").update(fila).eq("id", id)
    : await supabase.from("productos").insert(fila);

  if (error) return { ok: false, error: error.message };

  refrescarWebPublica();
  revalidatePath("/admin");

  if (!id) redirect("/admin?guardado=1");

  return { ok: true, mensaje: "Guardado. Ya se ve en la web." };
}

/**
 * Cambios de un solo campo desde la lista, sin abrir el formulario.
 * Es lo que hace que marcar "agotado" sea un clic y no cuatro.
 */
export async function alternarCampo(form: FormData): Promise<void> {
  if (await exigirAdmin()) return;

  const id = texto(form, "id");
  const campo = texto(form, "campo");
  const valor = texto(form, "valor") === "true";

  // Lista blanca: el nombre de la columna nunca sale directo de un formulario.
  if (!["disponible", "destacado", "activo"].includes(campo)) return;

  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("productos")
    .update({ [campo]: valor })
    .eq("id", id);

  if (error) {
    console.error("[admin] No se pudo alternar el campo", campo, error.message);
    return;
  }

  refrescarWebPublica();
  revalidatePath("/admin");
}

export async function eliminarProducto(form: FormData): Promise<void> {
  if (await exigirAdmin()) return;

  const id = texto(form, "id");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    console.error("[admin] No se pudo eliminar el producto", error.message);
    return;
  }

  refrescarWebPublica();
  revalidatePath("/admin");
  redirect("/admin?eliminado=1");
}

// -----------------------------------------------------------------------------
//  Categorías
// -----------------------------------------------------------------------------

export async function guardarCategoria(
  _anterior: Resultado | null,
  form: FormData,
): Promise<Resultado> {
  const noPermitido = await exigirAdmin();
  if (noPermitido) return { ok: false, error: noPermitido };

  const id = texto(form, "id");
  if (id.length === 0) return { ok: false, error: "Falta el identificador de la categoría." };

  const nombre = texto(form, "nombre");
  if (nombre.length === 0) return { ok: false, error: "La categoría necesita un nombre." };

  const valorPrecio = precio(form, "precio_unico");
  if (valorPrecio === "invalido") {
    return { ok: false, error: "El precio único tiene que ser un número, o quedar vacío." };
  }

  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("categorias")
    .update({
      nombre,
      orden: entero(form, "orden"),
      precio_unico: valorPrecio,
      nota: textoOpcional(form, "nota"),
      foto_url: textoOpcional(form, "foto_url"),
      activa: casilla(form, "activa"),
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  refrescarWebPublica();
  revalidatePath("/admin/categorias");

  return { ok: true, mensaje: "Categoría guardada." };
}

// -----------------------------------------------------------------------------
//  Sesión
// -----------------------------------------------------------------------------

export async function cerrarSesion(): Promise<void> {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Las dos variables de entorno que necesita Supabase, en un solo lugar.
 *
 * Las dos son públicas a propósito (`NEXT_PUBLIC_`): viajan al navegador y eso
 * está bien. La clave anónima no da permisos por sí sola — lo único que decide
 * quién puede escribir son las políticas RLS de la base. Por eso acá no hay ni
 * puede haber una `service_role`: esa sí es secreta y saltea RLS, y este
 * proyecto no la usa en ningún lado.
 */

export const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const CLAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/** ¿Hay configuración suficiente para hablar con Supabase? */
export function haySupabase(): boolean {
  return URL_SUPABASE.length > 0 && CLAVE_PUBLICA.length > 0;
}

/**
 * Igual que arriba pero explota si falta algo. Se usa donde Supabase no es
 * opcional (el panel), para que el error sea claro en vez de un 500 raro.
 */
export function exigirSupabase(): { url: string; clave: string } {
  if (!haySupabase()) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Ver supabase/README.md para saber de dónde sacarlas.",
    );
  }
  return { url: URL_SUPABASE, clave: CLAVE_PUBLICA };
}

/** Etiqueta de caché de la carta. Al guardar en el panel se invalida esta sola. */
export const ETIQUETA_CARTA = "carta";

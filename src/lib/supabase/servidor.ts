import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { exigirSupabase } from "./entorno";

/**
 * Cliente de Supabase para el servidor, atado a las cookies de la request.
 *
 * De acá sale la sesión del administrador. La sesión vive en cookies `httpOnly`
 * que el navegador manda sola: el token nunca queda accesible desde JavaScript
 * de la página, que es lo que evita que un XSS se lo lleve.
 *
 * Se usa SOLO en el panel. La web pública lee con `fetch` cacheado y sin
 * cookies (ver `src/lib/carta/remota.ts`): si leyera con este cliente, cada
 * visita sería dinámica y las páginas dejarían de servirse desde el CDN.
 */
export async function clienteServidor() {
  const { url, clave } = exigirSupabase();
  const almacen = await cookies();

  return createServerClient(url, clave, {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(cookiesNuevas) {
        try {
          for (const { name, value, options } of cookiesNuevas) {
            almacen.set(name, value, options);
          }
        } catch {
          // Los Server Components no pueden escribir cookies. No es un problema:
          // el refresco del token lo hace `proxy.ts`, que sí puede.
        }
      },
    },
  });
}

/**
 * Quién está usando el panel, o `null`.
 *
 * Va con `getUser()` y no con `getSession()` a propósito: `getSession()` se cree
 * lo que diga la cookie, y una cookie se puede falsificar. `getUser()` le
 * pregunta a Supabase si el token es válido de verdad.
 */
export async function usuarioActual() {
  const supabase = await clienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * ¿Está además habilitado a editar? Ser usuario no alcanza: tiene que estar en
 * la tabla `administradores`. Es la misma condición que aplica RLS del lado de
 * la base, chequeada acá para poder mostrar un mensaje claro en vez de que las
 * escrituras fallen sin explicación.
 */
export async function esAdministrador(): Promise<boolean> {
  const supabase = await clienteServidor();
  const { data, error } = await supabase.rpc("es_administrador");
  if (error) return false;
  return data === true;
}

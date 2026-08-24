import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresco de la sesión del panel.
 *
 * (En Next 16 esto antes se llamaba `middleware`. Se renombró a `proxy`.)
 *
 * El token de Supabase dura una hora. Sin esto, el encargado dejaría el panel
 * abierto, volvería a la tarde y se encontraría deslogueado en medio de una
 * edición. Acá se renueva en cada visita y la cookie nueva viaja en la respuesta.
 *
 * **Solo corre en `/admin`.** Es a propósito: si corriera en todas las rutas,
 * cada visita a la home o a la carta pasaría por una función de servidor y las
 * páginas dejarían de servirse directo desde el CDN. La web pública no tiene
 * sesión ni la necesita.
 *
 * Esto NO es la seguridad del panel. Es comodidad. Quien protege de verdad es
 * el layout de `/admin` (que valida el usuario contra Supabase) y, sobre todo,
 * las políticas RLS de la base.
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sin configurar, el panel muestra sus propias instrucciones. Acá no hay nada
  // que hacer y no hay que romper la request.
  if (!url || !clave) return respuesta;

  const supabase = createServerClient(url, clave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesNuevas) {
        for (const { name, value } of cookiesNuevas) {
          request.cookies.set(name, value);
        }
        respuesta = NextResponse.next({ request });
        for (const { name, value, options } of cookiesNuevas) {
          respuesta.cookies.set(name, value, options);
        }
      },
    },
  });

  // Este `getUser()` es lo que dispara el refresco del token. No se usa el
  // resultado acá: la decisión de dejar pasar o no la toma el layout.
  await supabase.auth.getUser();

  return respuesta;
}

export const config = {
  matcher: ["/admin/:path*"],
};

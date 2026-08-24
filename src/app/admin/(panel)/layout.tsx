import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { haySupabase } from "@/lib/supabase/entorno";
import { esAdministrador, usuarioActual } from "@/lib/supabase/servidor";
import { cerrarSesion } from "../acciones";
import { SinConfigurar } from "../componentes/SinConfigurar";

/**
 * El panel depende de quién esté logueado, así que no se pregenera: se arma en
 * cada visita. Es lo contrario de lo que queremos para la web pública, y está
 * bien que así sea — acá lo que importa es ver el dato correcto, no el CDN.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

/**
 * La puerta del panel.
 *
 * Todo lo que cuelga de acá exige sesión iniciada Y estar en la tabla
 * `administradores`. Son dos cosas distintas: cualquiera podría llegar a tener
 * un usuario en el proyecto de Supabase; solo los que están en esa tabla pueden
 * tocar la carta.
 *
 * Ojo con qué es esto y qué no: **esto no es la seguridad del sistema**. Es la
 * puerta de la interfaz. Si alguien la saltea con una petición hecha a mano, se
 * choca igual contra las políticas RLS de la base, que son las que de verdad no
 * lo dejan escribir. Esconder `/admin` nunca fue una defensa.
 *
 * `(panel)` entre paréntesis agrupa estas rutas sin aparecer en la URL: `/admin`
 * sigue siendo `/admin`. Está separado de `/admin/login` justamente para que el
 * login quede afuera de este control y no haya un bucle de redirecciones.
 */
export default async function LayoutPanel({ children }: { children: React.ReactNode }) {
  if (!haySupabase()) return <SinConfigurar />;

  const usuario = await usuarioActual();
  if (!usuario) redirect("/admin/login");

  if (!(await esAdministrador())) {
    return (
      <main className="mx-auto max-w-lg px-5 py-20">
        <h1 className="display text-3xl">Cuenta sin permiso</h1>
        <p className="mt-4 leading-relaxed text-cacao-suave">
          Entraste como <strong className="text-cacao">{usuario.email}</strong>, pero esa
          cuenta no está habilitada para editar la carta.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-cacao-suave">
          Para habilitarla hay que agregarla a la tabla <code>administradores</code> desde
          el panel de Supabase. Está explicado en <code>supabase/README.md</code>.
        </p>
        <form action={cerrarSesion} className="mt-8">
          <button
            type="submit"
            className="rounded-sm border border-cacao px-5 py-3 text-sm font-semibold transition hover:bg-cacao hover:text-crema"
          >
            Salir
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 border-b border-borde bg-crema/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link href="/admin" className="display text-lg">
            Carta YNNY
          </Link>

          <nav className="flex gap-1 text-sm">
            <Link
              href="/admin"
              className="flex min-h-11 items-center rounded-sm px-3 font-semibold transition hover:bg-crema-hondo"
            >
              Productos
            </Link>
            <Link
              href="/admin/categorias"
              className="flex min-h-11 items-center rounded-sm px-3 font-semibold transition hover:bg-crema-hondo"
            >
              Categorías
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 text-sm">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-11 items-center rounded-sm px-3 font-semibold text-cacao-suave transition hover:text-cacao"
            >
              Ver la web ↗
            </Link>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="flex min-h-11 items-center rounded-sm border border-cacao/25 px-3 font-semibold transition hover:border-cacao hover:bg-cacao hover:text-crema"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-borde px-4 py-5">
        <p className="mx-auto max-w-5xl text-xs text-cacao-suave">
          Los cambios que guardes acá se ven en la web al instante. Sesión: {usuario.email}
        </p>
      </footer>
    </div>
  );
}

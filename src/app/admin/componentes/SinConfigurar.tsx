/**
 * Lo que se ve en /admin cuando todavía no están cargadas las variables de
 * entorno de Supabase.
 *
 * Existe para que el panel no explote con un error de servidor: si falta la
 * configuración, lo correcto es explicar qué falta, no mostrar un 500.
 */
export function SinConfigurar() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="display text-[clamp(1.8rem,7vw,3rem)]">Falta conectar Supabase</h1>

      <p className="mt-5 leading-relaxed text-cacao-suave">
        El panel está listo, pero todavía no sabe con qué base de datos hablar. La web
        pública mientras tanto funciona igual: está mostrando la carta de respaldo que
        vive en el código.
      </p>

      <div className="mt-8 border border-borde bg-crema-hondo p-5">
        <h2 className="text-xs font-bold tracking-[0.18em] text-cacao-suave uppercase">
          Lo que falta
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <code className="rounded-sm bg-cacao px-2 py-1 font-mono text-xs text-crema">
              NEXT_PUBLIC_SUPABASE_URL
            </code>
          </li>
          <li>
            <code className="rounded-sm bg-cacao px-2 py-1 font-mono text-xs text-crema">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
          </li>
        </ul>
      </div>

      <p className="mt-8 leading-relaxed text-cacao-suave">
        El paso a paso completo —dónde entrar, qué botón tocar y dónde pegar cada dato—
        está en el archivo <code className="font-mono text-sm">supabase/README.md</code> del
        proyecto.
      </p>
    </main>
  );
}

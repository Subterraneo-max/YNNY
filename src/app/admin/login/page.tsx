import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { haySupabase } from "@/lib/supabase/entorno";
import { usuarioActual } from "@/lib/supabase/servidor";
import { SinConfigurar } from "../componentes/SinConfigurar";
import { FormularioLogin } from "./FormularioLogin";

// Depende de si ya hay sesión, así que tampoco se pregenera.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar al panel",
  robots: { index: false, follow: false },
};

export default async function PaginaLogin() {
  if (!haySupabase()) return <SinConfigurar />;

  // Si ya hay sesión no tiene sentido pedir el mail de nuevo.
  if (await usuarioActual()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Logo className="w-14 text-[2rem]" />

        <h1 className="display mt-8 text-[clamp(1.9rem,8vw,2.8rem)]">Panel de la carta</h1>
        <p className="mt-3 text-sm leading-relaxed text-cacao-suave">
          Entrá para cambiar precios, agregar productos o marcar algo como agotado.
        </p>

        <FormularioLogin />

        <p className="mt-8 border-t border-borde pt-5 text-xs leading-relaxed text-cacao-suave">
          Esta parte del sitio es privada. Si perdiste la contraseña, se recupera desde el
          panel de Supabase del proyecto.
        </p>
      </div>
    </main>
  );
}

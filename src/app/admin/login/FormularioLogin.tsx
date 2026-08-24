"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clienteNavegador } from "@/lib/supabase/navegador";

/**
 * Login del panel.
 *
 * Habla con Supabase Auth desde el navegador. Si el mail y la contraseña son
 * correctos, Supabase deja la sesión en cookies y el servidor la ve en la
 * siguiente navegación; de ahí el `router.refresh()`.
 *
 * La contraseña nunca pasa por el servidor de Vercel: va directo del navegador
 * a Supabase, por HTTPS.
 */

/**
 * Los errores de Supabase vienen en inglés y de técnico. Detrás del mostrador
 * eso no ayuda a nadie: acá se convierten en algo que se pueda actuar.
 */
function traducir(mensaje: string): string {
  const texto = mensaje.toLowerCase();

  if (texto.includes("invalid login") || texto.includes("invalid credentials")) {
    return "El mail o la contraseña no coinciden.";
  }
  if (texto.includes("email not confirmed")) {
    return "La cuenta existe pero falta confirmar el mail. Revisá la casilla.";
  }
  if (texto.includes("failed to fetch") || texto.includes("networkerror")) {
    return "No se pudo conectar con el servidor. Revisá la conexión a internet.";
  }
  if (texto.includes("rate limit") || texto.includes("too many")) {
    return "Demasiados intentos seguidos. Esperá un minuto y probá de nuevo.";
  }
  return `No se pudo entrar: ${mensaje}`;
}

export function FormularioLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const datos = new FormData(evento.currentTarget);
    const email = String(datos.get("email") ?? "").trim();
    const contrasena = String(datos.get("contrasena") ?? "");

    try {
      const supabase = clienteNavegador();
      const { error: fallo } = await supabase.auth.signInWithPassword({
        email,
        password: contrasena,
      });

      if (fallo) {
        setError(traducir(fallo.message));
        setEnviando(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (fallo) {
      setError(fallo instanceof Error ? traducir(fallo.message) : "No se pudo entrar.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={entrar} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          // 16 px: por debajo de eso, iOS hace zoom solo al tocar el campo.
          className="mt-2 w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3.5 text-base outline-none transition focus:border-cacao focus:ring-2 focus:ring-lima"
        />
      </div>

      <div>
        <label htmlFor="contrasena" className="block text-sm font-semibold">
          Contraseña
        </label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3.5 text-base outline-none transition focus:border-cacao focus:ring-2 focus:ring-lima"
        />
      </div>

      {error && (
        <p role="alert" className="border-l-4 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-sm bg-cacao px-6 py-4 font-bold text-crema transition hover:bg-lima hover:text-cacao disabled:opacity-60"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

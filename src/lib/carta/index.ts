import "server-only";

import { haySupabase } from "@/lib/supabase/entorno";
import { cartaLocal } from "./local";
import { cartaDeSupabase } from "./remota";
import type { Carta } from "./tipos";

export type {
  Carta,
  CategoriaCarta,
  GrupoCarta,
  OrigenCarta,
  ProductoCarta,
  ProductoUbicado,
} from "./tipos";

export * from "./derivados";

/**
 * La carta que se muestra en la web pública. Única puerta de entrada a los datos.
 *
 * Tiene una regla por encima de todas: **nunca deja caer la web**. Si Supabase
 * no está configurado, si está caído o si devuelve una carta vacía, se sirve la
 * transcripción local del PDF. Para el visitante la diferencia es que puede
 * estar viendo precios viejos; la alternativa era una pantalla de error, que es
 * peor para un negocio que lo único que quiere es mostrar cuánto sale el café.
 *
 * El panel avisa cuándo está pasando esto, así que no queda escondido.
 */
export async function leerCarta(): Promise<Carta> {
  if (!haySupabase()) {
    return cartaLocal("local-sin-configurar");
  }

  try {
    const carta = await cartaDeSupabase();

    // Una carta vacía casi siempre significa "el esquema está pero la semilla no
    // se corrió". Mostrar una página en blanco sería peor que mostrar el respaldo.
    if (carta.categorias.length === 0) {
      return cartaLocal(
        "local-por-error",
        "Supabase respondió sin categorías activas. ¿Se corrió supabase/02-semilla.sql?",
      );
    }

    return carta;
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    // Queda en los logs de Vercel, que es donde se mira cuando algo no cuadra.
    console.error("[carta] No se pudo leer de Supabase, se usa el respaldo local.", motivo);
    return cartaLocal("local-por-error", motivo);
  }
}

"use client";

import { createBrowserClient } from "@supabase/ssr";
import { exigirSupabase } from "./entorno";

/**
 * Cliente de Supabase para el navegador.
 *
 * Se usa en dos lugares y nada más:
 *  - el formulario de login, que necesita hablar con Supabase Auth;
 *  - la subida de fotos al Storage, que manda el archivo directo desde el
 *    navegador sin pasarlo por el servidor de Vercel.
 *
 * Todo el resto —leer y escribir la carta— pasa por Server Actions.
 */
export function clienteNavegador() {
  const { url, clave } = exigirSupabase();
  return createBrowserClient(url, clave);
}

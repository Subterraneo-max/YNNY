"use client";

import { useState } from "react";
import { clienteNavegador } from "@/lib/supabase/navegador";

/**
 * Cambiar la foto de un producto o de una categoría.
 *
 * El archivo va del navegador directo al Storage de Supabase, sin pasar por el
 * servidor de Vercel. Dos motivos: no hay límite de tamaño de request que
 * esquivar, y una función de servidor que recibe archivos de 3 MB cuesta plata
 * y tiempo para no aportar nada.
 *
 * Lo que se guarda en la base es solo la dirección de la foto. Mientras esté
 * vacía se usa la imagen local de siempre, así que las fotos se pueden ir
 * reemplazando de a una.
 */

const PESO_MAXIMO = 5 * 1024 * 1024;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function SubirFoto({
  nombre = "foto_url",
  valorInicial,
  carpeta,
  descripcionRespaldo,
}: {
  nombre?: string;
  valorInicial: string | null;
  /** Subcarpeta dentro del bucket: "productos" o "categorias". */
  carpeta: "productos" | "categorias";
  /** Qué se usa si no hay foto propia, para explicarlo en pantalla. */
  descripcionRespaldo: string;
}) {
  const [url, setUrl] = useState<string | null>(valorInicial);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subir(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    setError(null);

    if (!TIPOS.includes(archivo.type)) {
      setError("Tiene que ser una imagen JPG, PNG, WebP o AVIF.");
      return;
    }
    if (archivo.size > PESO_MAXIMO) {
      setError(
        `La foto pesa ${(archivo.size / 1024 / 1024).toFixed(1)} MB y el máximo son 5 MB. ` +
          "Probá sacarla con menos calidad o achicarla.",
      );
      return;
    }

    setSubiendo(true);

    try {
      const supabase = clienteNavegador();
      const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
      // El nombre lleva la fecha para que reemplazar una foto no quede pisado por
      // el caché del navegador ni del CDN.
      const ruta = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error: fallo } = await supabase.storage
        .from("carta")
        .upload(ruta, archivo, { cacheControl: "31536000", upsert: false });

      if (fallo) throw new Error(fallo.message);

      const { data } = supabase.storage.from("carta").getPublicUrl(ruta);
      setUrl(data.publicUrl);
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? `No se pudo subir la foto: ${fallo.message}`
          : "No se pudo subir la foto.",
      );
    } finally {
      setSubiendo(false);
      // Para que elegir el mismo archivo otra vez vuelva a disparar el evento.
      evento.target.value = "";
    }
  }

  return (
    <div>
      <span className="block text-sm font-semibold">Foto</span>

      <input type="hidden" name={nombre} value={url ?? ""} />

      <div className="mt-2 flex items-start gap-4">
        <div className="size-24 shrink-0 overflow-hidden rounded-sm border border-borde bg-crema-hondo">
          {url ? (
            // Es una vista previa del panel, no una foto de la web pública:
            // <img> alcanza y evita configurar el optimizador para esto.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Vista previa de la foto" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center px-2 text-center text-[0.65rem] leading-tight text-cacao-suave">
              Sin foto propia
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-cacao/25 px-4 text-sm font-semibold transition hover:border-cacao hover:bg-cacao hover:text-crema">
            {subiendo ? "Subiendo…" : url ? "Cambiar foto" : "Subir una foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={subir}
              disabled={subiendo}
              className="sr-only"
            />
          </label>

          {url && (
            <button
              type="button"
              onClick={() => setUrl(null)}
              className="ml-2 inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-semibold text-cacao-suave underline-offset-4 transition hover:text-cacao hover:underline"
            >
              Quitar
            </button>
          )}

          <p className="mt-2 text-xs leading-relaxed text-cacao-suave">
            {url
              ? "Esta foto se ve en la web. Si la quitás, vuelve la de siempre."
              : `Sin foto propia se usa ${descripcionRespaldo}.`}
          </p>

          {error && (
            <p role="alert" className="mt-2 text-xs font-semibold text-red-800">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

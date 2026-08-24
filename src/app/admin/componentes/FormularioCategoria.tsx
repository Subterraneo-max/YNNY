"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { CategoriaAdmin } from "@/lib/carta/admin";
import { guardarCategoria, type Resultado } from "../acciones";
import { CampoArea, CampoCasilla, CampoTexto } from "./campos";
import { SubirFoto } from "./SubirFoto";

/**
 * Una categoría por bloque, plegado.
 *
 * Son ocho y se editan poco: mostrar los ocho formularios abiertos a la vez
 * sería una pared. Se abre el que se quiere tocar.
 *
 * El `slug` no se edita a propósito: es lo que forma los enlaces `/carta#wraps`
 * que ya están compartidos por ahí. Cambiarlo rompería esos enlaces sin que se
 * note hasta que alguien los use.
 */
export function FormularioCategoria({
  categoria,
  cuantosProductos,
}: {
  categoria: CategoriaAdmin;
  cuantosProductos: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const [resultado, enviar] = useActionState<Resultado | null, FormData>(
    guardarCategoria,
    null,
  );

  return (
    <li className={`border border-borde ${categoria.activa ? "" : "opacity-60"}`}>
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        aria-expanded={abierto}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-crema-hondo"
      >
        <span className="min-w-0 flex-1">
          <span className="display block text-lg">{categoria.nombre}</span>
          <span className="mt-0.5 block text-xs text-cacao-suave">
            {cuantosProductos} {cuantosProductos === 1 ? "producto" : "productos"}
            {categoria.precio_unico !== null && ` · todos a $${categoria.precio_unico}`}
            {!categoria.activa && " · oculta en la web"}
          </span>
        </span>
        <span aria-hidden="true" className="text-xl text-cacao-suave">
          {abierto ? "−" : "+"}
        </span>
      </button>

      {abierto && (
        <form action={enviar} className="space-y-5 border-t border-borde px-4 py-5">
          <input type="hidden" name="id" value={categoria.id} />

          <CampoTexto etiqueta="Nombre" nombre={`nombre`} valor={categoria.nombre} requerido />

          <CampoTexto
            etiqueta="Orden"
            nombre="orden"
            valor={categoria.orden}
            modoEntrada="numeric"
            ayuda="Más chico aparece más arriba, tanto en la carta como en la portada."
          />

          <CampoTexto
            etiqueta="Precio único"
            nombre="precio_unico"
            valor={categoria.precio_unico}
            modoEntrada="numeric"
            ayuda="Solo si toda la categoría vale lo mismo, como los almuerzos. Si no, dejalo vacío."
          />

          <CampoArea
            etiqueta="Nota"
            nombre="nota"
            valor={categoria.nota}
            ayuda="Una línea que aparece debajo del título en la carta. Opcional."
          />

          <SubirFoto
            valorInicial={categoria.foto_url}
            carpeta="categorias"
            descripcionRespaldo="la foto que ya trae el sitio para esta categoría"
          />

          <CampoCasilla
            etiqueta="Visible en la web"
            nombre="activa"
            valor={categoria.activa}
            ayuda="Si la destildás, la categoría entera y todos sus productos desaparecen de la web."
          />

          {resultado && (
            <p
              role="alert"
              className={`border-l-4 px-4 py-3 text-sm ${
                resultado.ok
                  ? "border-lima-hondo bg-crema-hondo"
                  : "border-red-700 bg-red-50 text-red-900"
              }`}
            >
              {resultado.ok ? resultado.mensaje : resultado.error}
            </p>
          )}

          <Guardar />
        </form>
      )}
    </li>
  );
}

function Guardar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 items-center rounded-sm bg-cacao px-6 font-bold text-crema transition hover:bg-lima hover:text-cacao disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar categoría"}
    </button>
  );
}

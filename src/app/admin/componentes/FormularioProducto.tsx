"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import type { CategoriaAdmin, GrupoAdmin, ProductoAdmin } from "@/lib/carta/admin";
import { eliminarProducto, guardarProducto, type Resultado } from "../acciones";
import { CampoArea, CampoCasilla, CampoSelect, CampoTexto } from "./campos";
import { SubirFoto } from "./SubirFoto";

/**
 * Alta y edición de un producto, con el mismo formulario para las dos cosas.
 * Lo único que cambia es si viaja o no el campo oculto `id`.
 *
 * Guarda con una Server Action: el navegador manda el formulario y la escritura
 * ocurre en el servidor. Funciona incluso sin JavaScript; con JavaScript, además,
 * muestra el estado de "guardando" y el mensaje de resultado sin recargar.
 */
export function FormularioProducto({
  producto,
  categorias,
  grupos,
}: {
  /** `null` cuando se está creando uno nuevo. */
  producto: ProductoAdmin | null;
  categorias: CategoriaAdmin[];
  grupos: GrupoAdmin[];
}) {
  const [resultado, enviar] = useActionState<Resultado | null, FormData>(
    guardarProducto,
    null,
  );

  // El desplegable de grupos depende de la categoría elegida, así que la
  // categoría tiene que ser estado y no solo un valor por defecto.
  const [categoriaId, setCategoriaId] = useState(
    producto?.categoria_id ?? categorias[0]?.id ?? "",
  );

  const gruposDeLaCategoria = useMemo(
    () => grupos.filter((grupo) => grupo.categoria_id === categoriaId),
    [grupos, categoriaId],
  );

  const categoriaElegida = categorias.find((categoria) => categoria.id === categoriaId);

  return (
    <form action={enviar} className="space-y-6">
      {producto && <input type="hidden" name="id" value={producto.id} />}

      <CampoTexto
        etiqueta="Nombre"
        nombre="nombre"
        valor={producto?.nombre}
        requerido
        ayuda="Como aparece en la carta. Por ejemplo: Infusión + 2 facturas."
      />

      <CampoArea
        etiqueta="Descripción"
        nombre="descripcion"
        valor={producto?.descripcion}
        ayuda="Opcional. Lo que lleva adentro: “Jamón, queso, lechuga, tomate y huevo”."
      />

      <CampoTexto
        etiqueta="Precio"
        nombre="precio"
        valor={producto?.precio}
        modoEntrada="numeric"
        ayuda={
          categoriaElegida?.precio_unico != null
            ? `Esta categoría tiene un precio único de $${categoriaElegida.precio_unico}, así que en la carta este número no se muestra. Igual conviene dejarlo cargado.`
            : "Solo el número, en pesos. Dejalo vacío si el precio se consulta en el mostrador."
        }
      />

      <div>
        <label htmlFor="categoria_id" className="block text-sm font-semibold">
          Categoría
        </label>
        <select
          id="categoria_id"
          name="categoria_id"
          value={categoriaId}
          onChange={(evento) => setCategoriaId(evento.target.value)}
          className="mt-2 w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3 text-base outline-none transition focus:border-cacao focus:ring-2 focus:ring-lima"
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <CampoSelect
        etiqueta="Subtítulo dentro de la categoría"
        nombre="grupo_id"
        valor={producto?.grupo_id}
        opciones={[
          { valor: "", texto: "Sin subtítulo" },
          ...gruposDeLaCategoria.map((grupo) => ({
            valor: grupo.id,
            texto: grupo.nombre ?? "Bloque principal",
          })),
        ]}
        ayuda="Los bloques dentro de una categoría, como “Bagel” o “Árabe” en Sándwiches."
      />

      <SubirFoto
        valorInicial={producto?.foto_url ?? null}
        carpeta="productos"
        descripcionRespaldo="la foto de la categoría"
      />

      <CampoTexto
        etiqueta="Orden"
        nombre="orden"
        valor={producto?.orden ?? 0}
        modoEntrada="numeric"
        ayuda="Más chico aparece más arriba. Si hay dudas, dejá 0."
      />

      <div className="space-y-3">
        <CampoCasilla
          etiqueta="Disponible"
          nombre="disponible"
          valor={producto?.disponible ?? true}
          ayuda="Si lo destildás, sigue apareciendo en la carta pero marcado como agotado."
        />
        <CampoCasilla
          etiqueta="Favorito de YNNY"
          nombre="destacado"
          valor={producto?.destacado ?? false}
          ayuda="Aparece con foto grande en la portada. Entran cuatro."
        />
        <CampoCasilla
          etiqueta="Visible en la web"
          nombre="activo"
          valor={producto?.activo ?? true}
          ayuda="Si lo destildás desaparece de la web, pero queda guardado acá por si lo querés recuperar."
        />
      </div>

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

      <div className="flex flex-wrap items-center gap-3 border-t border-borde pt-6">
        <BotonGuardar />

        <Link
          href="/admin"
          className="flex min-h-11 items-center rounded-sm px-4 text-sm font-semibold text-cacao-suave underline-offset-4 transition hover:text-cacao hover:underline"
        >
          Volver sin guardar
        </Link>

        {producto && <BotonEliminar nombre={producto.nombre} />}
      </div>
    </form>
  );
}

/**
 * `useFormStatus` tiene que vivir en un hijo del formulario: desde el mismo
 * componente que lo renderiza siempre devolvería `pending: false`.
 */
function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 items-center rounded-sm bg-cacao px-6 font-bold text-crema transition hover:bg-lima hover:text-cacao disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

/**
 * Va con `formAction` y no dentro de su propio `<form>`: el HTML no permite
 * anidar formularios y el navegador se comería el de adentro. Así, el mismo
 * formulario se manda a otra accion segun el boton que se apriete, y la accion
 * de borrar lee el `id` del campo oculto que ya viaja arriba.
 */
function BotonEliminar({ nombre }: { nombre: string }) {
  return (
    <button
      type="submit"
      formAction={eliminarProducto}
      // Sin esto, el navegador validaría los campos obligatorios del formulario
      // antes de dejar borrar, que no tiene sentido: se está eliminando la fila.
      formNoValidate
      onClick={(evento) => {
        // Borrar es lo único que no tiene vuelta atrás, así que se pregunta.
        // Para sacarlo de la web sin perderlo está "Visible en la web".
        const seguro = confirm(
          `¿Eliminar "${nombre}" para siempre?\n\n` +
            "Si solo lo querés sacar de la web por un tiempo, cerrá esto y destildá " +
            "“Visible en la web”: así lo podés recuperar después.",
        );
        if (!seguro) evento.preventDefault();
      }}
      className="ml-auto flex min-h-11 items-center rounded-sm border border-red-800/40 px-4 text-sm font-semibold text-red-800 transition hover:bg-red-800 hover:text-crema"
    >
      Eliminar
    </button>
  );
}

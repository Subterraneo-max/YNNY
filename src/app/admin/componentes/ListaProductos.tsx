"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoriaAdmin, ProductoAdmin } from "@/lib/carta/admin";
import { formatearPrecio } from "@/lib/carta/derivados";
import { alternarCampo } from "../acciones";

/** Para que "arabe" encuentre "Árabe" y "cafe" encuentre "café". */
const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/**
 * La lista de productos del panel: buscador, filtro por categoría y una fila
 * por producto.
 *
 * El filtrado es en el navegador y no contra la base. Son 72 productos: pedirle
 * a Supabase en cada tecla sería más lento y más caro que filtrar un array.
 */
export function ListaProductos({
  productos,
  categorias,
}: {
  productos: ProductoAdmin[];
  categorias: CategoriaAdmin[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  const nombreDeCategoria = useMemo(
    () => new Map(categorias.map((categoria) => [categoria.id, categoria.nombre])),
    [categorias],
  );

  const visibles = useMemo(() => {
    const termino = normalizar(busqueda.trim());

    return productos.filter((producto) => {
      if (filtroCategoria !== "todas" && producto.categoria_id !== filtroCategoria) {
        return false;
      }
      if (termino.length === 0) return true;
      return normalizar(`${producto.nombre} ${producto.descripcion ?? ""}`).includes(termino);
    });
  }, [productos, busqueda, filtroCategoria]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="buscar-admin" className="sr-only">
            Buscar un producto
          </label>
          <input
            id="buscar-admin"
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar un producto…"
            className="w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3 text-base outline-none transition focus:border-cacao focus:ring-2 focus:ring-lima"
          />
        </div>

        <div>
          <label htmlFor="filtro-categoria" className="sr-only">
            Filtrar por categoría
          </label>
          <select
            id="filtro-categoria"
            value={filtroCategoria}
            onChange={(evento) => setFiltroCategoria(evento.target.value)}
            className="w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3 text-base outline-none transition focus:border-cacao focus:ring-2 focus:ring-lima sm:w-56"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
                {categoria.activa ? "" : " (oculta)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-cacao-suave" role="status" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
        {busqueda.trim().length > 0 && ` con “${busqueda.trim()}”`}
      </p>

      {visibles.length === 0 ? (
        <p className="mt-8 border border-dashed border-borde px-5 py-10 text-center text-cacao-suave">
          No hay ningún producto con esa búsqueda.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-borde border-y border-borde">
          {visibles.map((producto) => (
            <li
              key={producto.id}
              className={`flex flex-wrap items-center gap-x-4 gap-y-3 py-4 ${
                producto.activo ? "" : "opacity-55"
              }`}
            >
              <div className="min-w-0 flex-1 basis-full sm:basis-0">
                <p className="font-semibold leading-snug">
                  {producto.nombre}
                  {!producto.activo && (
                    <span className="ml-2 rounded-sm border border-cacao/30 px-1.5 py-0.5 align-middle text-[0.65rem] font-bold tracking-wide uppercase">
                      Oculto
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-cacao-suave">
                  {nombreDeCategoria.get(producto.categoria_id) ?? "Sin categoría"}
                </p>
              </div>

              <p className="display w-24 text-lg tabular-nums">
                {producto.precio === null ? (
                  <span className="text-sm font-normal text-cacao-suave">Consultar</span>
                ) : (
                  formatearPrecio(producto.precio)
                )}
              </p>

              {/*
                Los interruptores son formularios y no botones con JavaScript:
                así funcionan también si el navegador del local es viejo o la
                conexión se corta a la mitad.
              */}
              <Interruptor
                id={producto.id}
                campo="disponible"
                valor={producto.disponible}
                encendido="Disponible"
                apagado="Agotado"
              />

              <Interruptor
                id={producto.id}
                campo="destacado"
                valor={producto.destacado}
                encendido="★ Favorito"
                apagado="☆ Favorito"
              />

              <Link
                href={`/admin/producto/${producto.id}`}
                className="flex min-h-11 items-center rounded-sm border border-cacao/25 px-4 text-sm font-semibold transition hover:border-cacao hover:bg-cacao hover:text-crema"
              >
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Interruptor({
  id,
  campo,
  valor,
  encendido,
  apagado,
}: {
  id: string;
  campo: "disponible" | "destacado" | "activo";
  valor: boolean;
  encendido: string;
  apagado: string;
}) {
  return (
    <form action={alternarCampo}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="campo" value={campo} />
      <input type="hidden" name="valor" value={String(!valor)} />
      <button
        type="submit"
        aria-pressed={valor}
        className={`flex min-h-11 items-center rounded-sm border px-3 text-xs font-bold tracking-wide uppercase transition ${
          valor
            ? "border-lima-hondo bg-lima text-cacao"
            : "border-cacao/20 bg-transparent text-cacao-suave hover:border-cacao"
        }`}
      >
        {valor ? encendido : apagado}
      </button>
    </form>
  );
}

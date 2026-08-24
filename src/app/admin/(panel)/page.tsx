import Link from "next/link";
import { leerCartaAdmin } from "@/lib/carta/admin";
import { CUANTOS_FAVORITOS } from "@/lib/carta/derivados";
import { ListaProductos } from "../componentes/ListaProductos";

export default async function PaginaProductos() {
  const { categorias, productos } = await leerCartaAdmin();

  const destacados = productos.filter((producto) => producto.destacado && producto.activo);
  const agotados = productos.filter((producto) => !producto.disponible && producto.activo);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(1.8rem,7vw,2.8rem)]">Productos</h1>
          <p className="mt-2 text-sm text-cacao-suave">
            {productos.length} en total · {agotados.length} marcados como agotados
          </p>
        </div>

        <Link
          href="/admin/producto/nuevo"
          className="flex min-h-11 items-center rounded-sm bg-cacao px-5 font-bold text-crema transition hover:bg-lima hover:text-cacao"
        >
          + Agregar producto
        </Link>
      </div>

      {/*
        Aviso, no error. La home tiene lugar para cuatro tarjetas: si hay más
        marcados, entran los cuatro primeros y el resto no se ve. Vale la pena
        decirlo acá antes de que alguien se pregunte por qué su favorito no sale.
      */}
      {destacados.length > CUANTOS_FAVORITOS && (
        <p className="mt-6 border-l-4 border-lima-hondo bg-crema-hondo px-4 py-3 text-sm">
          Tenés {destacados.length} productos marcados como favoritos y en la home entran{" "}
          {CUANTOS_FAVORITOS}. Se muestran los {CUANTOS_FAVORITOS} primeros por orden.
        </p>
      )}

      {destacados.length === 0 && (
        <p className="mt-6 border-l-4 border-borde bg-crema-hondo px-4 py-3 text-sm">
          No hay ningún producto marcado como favorito, así que la sección “Los favoritos de
          YNNY” no aparece en la home. Marcá alguno con la estrella para que vuelva.
        </p>
      )}

      <div className="mt-8">
        <ListaProductos productos={productos} categorias={categorias} />
      </div>
    </>
  );
}

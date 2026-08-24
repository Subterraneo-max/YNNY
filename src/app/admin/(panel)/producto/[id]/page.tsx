import Link from "next/link";
import { notFound } from "next/navigation";
import { leerCartaAdmin, leerProducto } from "@/lib/carta/admin";
import { FormularioProducto } from "../../../componentes/FormularioProducto";

/**
 * En Next 16 los parámetros de ruta llegan como promesa: hay que esperarlos.
 */
export default async function PaginaEditarProducto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [producto, { categorias, grupos }] = await Promise.all([
    leerProducto(id),
    leerCartaAdmin(),
  ]);

  if (!producto) notFound();

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-cacao-suave underline-offset-4 hover:text-cacao hover:underline"
      >
        ← Volver a productos
      </Link>

      <h1 className="display mt-3 text-[clamp(1.6rem,6vw,2.6rem)]">{producto.nombre}</h1>

      <div className="mt-8 max-w-xl">
        <FormularioProducto producto={producto} categorias={categorias} grupos={grupos} />
      </div>
    </>
  );
}

import Link from "next/link";
import { leerCartaAdmin } from "@/lib/carta/admin";
import { FormularioProducto } from "../../../componentes/FormularioProducto";

export default async function PaginaNuevoProducto() {
  const { categorias, grupos } = await leerCartaAdmin();

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-cacao-suave underline-offset-4 hover:text-cacao hover:underline"
      >
        ← Volver a productos
      </Link>

      <h1 className="display mt-3 text-[clamp(1.8rem,7vw,2.8rem)]">Agregar producto</h1>
      <p className="mt-2 text-sm text-cacao-suave">
        Apenas lo guardes aparece en la carta de la web.
      </p>

      <div className="mt-8 max-w-xl">
        <FormularioProducto producto={null} categorias={categorias} grupos={grupos} />
      </div>
    </>
  );
}

import { leerCartaAdmin } from "@/lib/carta/admin";
import { FormularioCategoria } from "../../componentes/FormularioCategoria";

export default async function PaginaCategorias() {
  const { categorias, productos } = await leerCartaAdmin();

  const cuantosPorCategoria = new Map<string, number>();
  for (const producto of productos) {
    if (!producto.activo) continue;
    cuantosPorCategoria.set(
      producto.categoria_id,
      (cuantosPorCategoria.get(producto.categoria_id) ?? 0) + 1,
    );
  }

  return (
    <>
      <h1 className="display text-[clamp(1.8rem,7vw,2.8rem)]">Categorías</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-cacao-suave">
        Tocá una para cambiarle el nombre, el orden, la foto o esconderla. Para crear o
        borrar categorías enteras hay que avisarnos: cambian la estructura de la carta y de
        los enlaces.
      </p>

      <ul className="mt-8 max-w-2xl space-y-3">
        {categorias.map((categoria) => (
          <FormularioCategoria
            key={categoria.id}
            categoria={categoria}
            cuantosProductos={cuantosPorCategoria.get(categoria.id) ?? 0}
          />
        ))}
      </ul>
    </>
  );
}

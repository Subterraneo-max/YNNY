import Link from "next/link";
import { FotoCategoria } from "@/components/FotoCategoria";
import { Revelar } from "@/components/Revelar";
import { formatearPrecio } from "@/lib/carta/derivados";
import type { ProductoUbicado } from "@/lib/carta/tipos";

/**
 * "Los favoritos de YNNY": cuatro productos con foto grande, nombre y precio.
 *
 * Los cuatro salen de la carta real (ver `favoritos` en src/data/menu.ts) y el
 * precio se lee de ahí, así que nunca puede contradecir lo que dice /carta.
 */
export function Favoritos({ favoritos }: { favoritos: ProductoUbicado[] }) {
  // Si en el panel destildan los cuatro no queda una grilla vacía: no se
  // renderiza la lista y la sección de la home se salta sola.
  if (favoritos.length === 0) return null;

  return (
    <Revelar objetivo="li">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:gap-6 lg:grid-cols-4">
        {favoritos.map((producto) => (
          <li key={producto.id}>
            <Link
              href={`/carta#${producto.categoriaSlug}`}
              className="group flex h-full flex-col"
            >
              <div className="overflow-hidden rounded-2xl shadow-[0_18px_40px_-16px_rgb(53_41_31_/_0.45)]">
                <div className="relative aspect-[4/5]">
                  <FotoCategoria
                    slug={producto.categoriaSlug}
                    producto={producto.nombre}
                    fotoUrl={producto.fotoUrl}
                    sizes="(min-width: 1024px) 280px, 45vw"
                    className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Sin etiqueta de categoría: los cuatro favoritos caen en la misma
                  y repetirla cuatro veces no aporta nada, solo ensucia. */}
              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="display-suelto flex-1 text-lg leading-tight transition-colors group-hover:text-lima-hondo sm:text-xl">
                  {producto.nombre}
                </h3>
                {producto.precio !== null && (
                  <p className="display mt-3 text-2xl tabular-nums sm:text-3xl">
                    {formatearPrecio(producto.precio)}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Revelar>
  );
}

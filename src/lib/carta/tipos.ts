/**
 * La forma de la carta tal como la consumen las páginas y los componentes.
 *
 * Es deliberadamente independiente de cómo esté guardada: hoy puede venir de
 * Supabase o del archivo local de respaldo, y ninguna vista se entera de cuál
 * de las dos fue.
 */

export type ProductoCarta = {
  id: string;
  nombre: string;
  descripcion: string | null;
  /** En pesos. `null` cuando la carta no lo aclara: la web muestra "Consultar". */
  precio: number | null;
  /** En false se muestra igual, pero marcado como agotado. */
  disponible: boolean;
  /** Aparece en "Los favoritos de YNNY" en la home. */
  destacado: boolean;
  /** Foto propia subida desde el panel. `null` = se usa la imagen local de la categoría. */
  fotoUrl: string | null;
};

export type GrupoCarta = {
  id: string;
  /** Subtítulo dentro de la categoría. `null` en las que tienen un solo bloque. */
  nombre: string | null;
  productos: ProductoCarta[];
};

export type CategoriaCarta = {
  id: string;
  slug: string;
  nombre: string;
  /** Precio común a toda la categoría, cuando la carta la presenta así. */
  precioUnico: number | null;
  nota: string | null;
  fotoUrl: string | null;
  grupos: GrupoCarta[];
};

/** De dónde salieron los datos que se están mostrando. */
export type OrigenCarta =
  | "supabase"
  /** Todavía no hay variables de entorno configuradas. */
  | "local-sin-configurar"
  /** Supabase está configurado pero falló o vino vacío. La web sigue en pie. */
  | "local-por-error";

export type Carta = {
  categorias: CategoriaCarta[];
  origen: OrigenCarta;
  /** Qué salió mal, cuando el origen es `local-por-error`. */
  motivo?: string;
};

/** Producto con el contexto de dónde vive, para el buscador y las tarjetas. */
export type ProductoUbicado = ProductoCarta & {
  categoriaId: string;
  categoriaSlug: string;
  categoriaNombre: string;
  grupoNombre: string | null;
};

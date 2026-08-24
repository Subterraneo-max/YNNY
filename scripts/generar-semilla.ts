/**
 * Genera `supabase/02-semilla.sql` a partir de `src/data/menu.ts`.
 *
 * La carta se transcribió una sola vez desde el PDF y ese archivo es la fuente.
 * Escribir el SQL a mano sería copiar 72 precios de nuevo, que es exactamente
 * donde se cuelan los errores. Se genera:
 *
 *     npx tsx scripts/generar-semilla.ts
 *
 * El SQL resultante no pisa nada: si la tabla `categorias` ya tiene filas, no
 * hace absolutamente nada. Correrlo dos veces es seguro.
 */
import { writeFileSync } from "node:fs";
import { categorias } from "../src/data/menu";

/** Los cuatro que hoy salen en "Los favoritos de YNNY" (ver src/data/menu.ts). */
const FAVORITOS = [
  "Infusión + 2 facturas",
  "Submarino + 2 medialunas",
  "Infusión + medio tostado + vaso de jugo",
  "Infusión + porción de torta + vaso de jugo",
];

/** Literal SQL. Las comillas simples se duplican, que es como se escapan en SQL. */
const txt = (valor: string | undefined | null) =>
  valor == null ? "null" : `'${valor.replace(/'/g, "''")}'`;

const num = (valor: number | undefined | null) => (valor == null ? "null" : String(valor));

const lineas: string[] = [
  "-- =============================================================================",
  "--  YNNY · Semilla de la carta",
  "--",
  "--  GENERADO AUTOMÁTICAMENTE desde src/data/menu.ts.",
  "--  No editar a mano: correr `npx tsx scripts/generar-semilla.ts`.",
  "--",
  "--  Pegar en Supabase → SQL Editor → New query → Run, DESPUÉS de 01-esquema.sql.",
  "--",
  "--  Si la tabla `categorias` ya tiene filas, este script no hace nada. Está",
  "--  pensado así a propósito: una vez que YNNY empiece a editar precios desde el",
  "--  panel, volver a correrlo no puede pisarle el trabajo.",
  "-- =============================================================================",
  "",
  "do $semilla$",
  "declare",
  "  cat_id uuid;",
  "  grp_id uuid;",
  "begin",
  "  if exists (select 1 from public.categorias) then",
  "    raise notice 'La carta ya tiene datos cargados. No se modificó nada.';",
  "    return;",
  "  end if;",
  "",
];

let totalProductos = 0;

categorias.forEach((categoria, ordenCategoria) => {
  lineas.push(`  -- ${"-".repeat(72)}`);
  lineas.push(`  -- ${categoria.nombre}`);
  lineas.push(`  -- ${"-".repeat(72)}`);
  lineas.push("  insert into public.categorias (slug, nombre, orden, precio_unico, nota)");
  lineas.push(
    `  values (${txt(categoria.slug)}, ${txt(categoria.nombre)}, ${ordenCategoria}, ` +
      `${num(categoria.precioUnico)}, ${txt(categoria.nota)})`,
  );
  lineas.push("  returning id into cat_id;");
  lineas.push("");

  categoria.grupos.forEach((grupo, ordenGrupo) => {
    lineas.push("  insert into public.grupos (categoria_id, nombre, orden)");
    lineas.push(`  values (cat_id, ${txt(grupo.nombre)}, ${ordenGrupo})`);
    lineas.push("  returning id into grp_id;");
    lineas.push("");

    lineas.push(
      "  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values",
    );

    const filas = grupo.productos.map((producto, ordenProducto) => {
      totalProductos += 1;
      const destacado = FAVORITOS.includes(producto.nombre);
      return (
        `    (cat_id, grp_id, ${txt(producto.nombre)}, ${txt(producto.descripcion)}, ` +
        `${num(producto.precio)}, ${destacado}, ${ordenProducto})`
      );
    });

    lineas.push(filas.join(",\n") + ";");
    lineas.push("");
  });
});

const totalGrupos = categorias.reduce((total, c) => total + c.grupos.length, 0);
const totalFavoritos = categorias
  .flatMap((c) => c.grupos.flatMap((g) => g.productos))
  .filter((p) => FAVORITOS.includes(p.nombre)).length;

if (totalFavoritos !== FAVORITOS.length) {
  throw new Error(
    `Se esperaban ${FAVORITOS.length} favoritos y se marcaron ${totalFavoritos}. ` +
      "Alguno de los nombres de FAVORITOS ya no existe en la carta.",
  );
}

lineas.push(
  `  raise notice 'Carta cargada: ${categorias.length} categorías, ${totalGrupos} grupos, ${totalProductos} productos.';`,
);
lineas.push("end");
lineas.push("$semilla$;");
lineas.push("");

const destino = new URL("../supabase/02-semilla.sql", import.meta.url);
writeFileSync(destino, lineas.join("\n"), "utf8");

console.log(`Escrito ${destino.pathname}`);
console.log(
  `  ${categorias.length} categorías · ${totalGrupos} grupos · ${totalProductos} productos · ${totalFavoritos} destacados`,
);

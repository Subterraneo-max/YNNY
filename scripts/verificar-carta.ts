/**
 * Compara la carta que devuelve Supabase con la del archivo local, producto por
 * producto y precio por precio.
 *
 *     npx tsx scripts/verificar-carta.ts
 *
 * Es el control de la migración: sirve para confirmar que la semilla cargó todo
 * bien antes de empezar a confiar en la base. Después de que YNNY empiece a
 * editar precios va a marcar diferencias, y eso está perfecto — a partir de ahí
 * la verdad es Supabase y este script deja de tener sentido.
 *
 * No escribe nada. Solo lee y compara.
 */
import { readFileSync } from "node:fs";
import { categorias as locales } from "../src/data/menu";

/** Lee .env.local a mano: este script corre fuera de Next. */
function cargarEntorno() {
  try {
    const texto = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const linea of texto.split("\n")) {
      const limpia = linea.trim();
      if (limpia.length === 0 || limpia.startsWith("#")) continue;
      const corte = limpia.indexOf("=");
      if (corte === -1) continue;
      const clave = limpia.slice(0, corte).trim();
      const valor = limpia.slice(corte + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[clave]) process.env[clave] = valor;
    }
  } catch {
    // Sin .env.local se usan las variables del sistema, si las hay.
  }
}

cargarEntorno();

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL_SUPABASE || !CLAVE) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "Cargalas en .env.local. Ver supabase/README.md.",
  );
  process.exit(1);
}

type FilaProducto = {
  nombre: string;
  precio: number | null;
  descripcion: string | null;
  activo: boolean;
};

type FilaCategoria = {
  slug: string;
  nombre: string;
  precio_unico: number | null;
  activa: boolean;
  productos: FilaProducto[];
};

const consulta =
  `${URL_SUPABASE}/rest/v1/categorias` +
  `?select=${encodeURIComponent("slug,nombre,precio_unico,activa,productos(nombre,precio,descripcion,activo)")}`;

const respuesta = await fetch(consulta, {
  headers: { apikey: CLAVE, Authorization: `Bearer ${CLAVE}` },
});

if (!respuesta.ok) {
  console.error(`Supabase respondió ${respuesta.status}:`, await respuesta.text());
  process.exit(1);
}

const remotas = (await respuesta.json()) as FilaCategoria[];

const problemas: string[] = [];

// --- categorías ---
const slugsLocales = new Set(locales.map((c) => c.slug));
const slugsRemotos = new Set(remotas.map((c) => c.slug));

for (const slug of slugsLocales) {
  if (!slugsRemotos.has(slug)) problemas.push(`Falta la categoría "${slug}" en Supabase.`);
}
for (const slug of slugsRemotos) {
  if (!slugsLocales.has(slug)) problemas.push(`Sobra la categoría "${slug}" en Supabase.`);
}

// --- productos y precios ---
let comparados = 0;

for (const local of locales) {
  const remota = remotas.find((c) => c.slug === local.slug);
  if (!remota) continue;

  if ((local.precioUnico ?? null) !== remota.precio_unico) {
    problemas.push(
      `"${local.slug}": precio único local ${local.precioUnico ?? "null"} ` +
        `vs Supabase ${remota.precio_unico ?? "null"}.`,
    );
  }

  const productosLocales = local.grupos.flatMap((g) => g.productos);

  for (const producto of productosLocales) {
    comparados += 1;
    const enSupabase = remota.productos.filter((p) => p.nombre === producto.nombre);

    if (enSupabase.length === 0) {
      problemas.push(`"${local.slug}" · falta el producto "${producto.nombre}".`);
      continue;
    }

    // Puede haber nombres repetidos dentro de una categoría (por ejemplo "Carne"
    // en dos grupos distintos): alcanza con que alguno coincida en precio.
    if (!enSupabase.some((p) => p.precio === producto.precio)) {
      problemas.push(
        `"${local.slug}" · "${producto.nombre}": precio local ${producto.precio ?? "null"} ` +
          `vs Supabase ${enSupabase.map((p) => p.precio ?? "null").join(" / ")}.`,
      );
    }
  }

  const cuantosRemotos = remota.productos.length;
  if (cuantosRemotos !== productosLocales.length) {
    problemas.push(
      `"${local.slug}": ${productosLocales.length} productos locales vs ${cuantosRemotos} en Supabase.`,
    );
  }
}

console.log(
  `Comparados ${comparados} productos en ${locales.length} categorías contra Supabase.\n`,
);

if (problemas.length === 0) {
  console.log("Sin diferencias: Supabase devuelve exactamente la misma carta.");
  process.exit(0);
}

console.log(`${problemas.length} diferencia(s):\n`);
for (const problema of problemas) console.log("  · " + problema);
console.log(
  "\nSi YNNY ya empezó a editar desde el panel, las diferencias son esperables.\n" +
    "Si esto es la verificación de la migración inicial, algo no cargó bien.",
);
process.exit(1);

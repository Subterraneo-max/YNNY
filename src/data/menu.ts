/**
 * Carta de YNNY, transcrita del PDF "CARTA YNNY" (9 páginas, Canva, 4,26 MB)
 * que hoy está publicado en Google Drive desde el Linktree.
 *
 * Los precios se emparejaron con cada producto por su posición en la página, no por
 * orden de lectura: en el PDF están en una columna aparte y leerlos de corrido los
 * desalinea. Ningún precio de acá está inventado ni interpolado.
 *
 * Al reemplazar el PDF por estos datos, cambiar un precio pasa a ser editar un número
 * en vez de rehacer el diseño y volver a subirlo.
 */

export type Producto = {
  nombre: string;
  descripcion?: string;
  /** En pesos. `null` cuando la carta no lo aclara. */
  precio: number | null;
};

export type Grupo = {
  /** Subtítulo dentro de la categoría, tal como aparece en la carta. */
  nombre?: string;
  productos: Producto[];
};

export type Categoria = {
  slug: string;
  nombre: string;
  /** Precio común a toda la categoría, cuando la carta lo presenta así. */
  precioUnico?: number;
  nota?: string;
  grupos: Grupo[];
};

export const categorias: Categoria[] = [
  {
    slug: "desayunos",
    nombre: "Desayunos y meriendas",
    grupos: [
      {
        productos: [
          { nombre: "Infusión + 2 facturas", precio: 4500 },
          { nombre: "Infusión + 2 tostadas queso y mermelada", precio: 6000 },
          { nombre: "Infusión + 3 chipás", precio: 6000 },
          { nombre: "Infusión + 2 churros", precio: 5200 },
          { nombre: "Infusión + tostón huevo y palta", precio: 9200 },
          { nombre: "Infusión con waffles", precio: 8600 },
          { nombre: "Infusión + porción de torta + vaso de jugo", precio: 8500 },
          { nombre: "Infusión + porción de budín + vaso de jugo", precio: 8200 },
          { nombre: "Infusión + sin TACC", precio: 7200 },
          { nombre: "Infusión + medialunas jamón y queso", precio: 8400 },
          { nombre: "Submarino + 2 medialunas", precio: 4800 },
          { nombre: "Infusión + medio tostado + vaso de jugo", precio: 8800 },
        ],
      },
    ],
  },

  {
    slug: "almuerzos",
    nombre: "Almuerzos",
    precioUnico: 11500,
    nota: "Sugerencia del día. Todos incluyen bebida y postre o café.",
    grupos: [
      {
        productos: [
          { nombre: "Canelones de carne y verdura con salsa tuco", precio: 11500 },
          { nombre: "Arroz con pollo", precio: 11500 },
          { nombre: "Chopsuey de arroz", precio: 11500 },
          { nombre: "Milanesa o suprema con ensalada o papas", precio: 11500 },
          { nombre: "Lasagna de carne y verdura", precio: 11500 },
        ],
      },
    ],
  },

  {
    slug: "sandwiches",
    nombre: "Sándwiches",
    grupos: [
      {
        nombre: "Bagel",
        productos: [{ nombre: "Jamón crudo y queso", precio: 8300 }],
      },
      {
        nombre: "Árabe",
        productos: [
          {
            nombre: "Árabe de pollo",
            descripcion: "Ketchup, queso cheddar, tomate y pollo",
            precio: 7500,
          },
          {
            nombre: "Árabe primavera",
            descripcion: "Jamón, queso, lechuga, tomate y huevo",
            precio: 7500,
          },
        ],
      },
      {
        nombre: "Sándwich de milanesa",
        productos: [
          {
            nombre: "Milanesa",
            descripcion: "Milanesa, jamón cocido, queso, lechuga y tomate",
            precio: 7000,
          },
        ],
      },
      {
        nombre: "Sándwich de chipá",
        productos: [
          { nombre: "Jamón y queso", precio: 7200 },
          { nombre: "Jamón crudo y queso", precio: 8800 },
          {
            nombre: "Primavera",
            descripcion: "Jamón, queso, lechuga, tomate y huevo",
            precio: 8200,
          },
        ],
      },
      {
        nombre: "Sándwich de lomo",
        productos: [
          {
            nombre: "Lomito ahumado",
            descripcion: "Pan brioche, mostaza, huevo, queso, cheddar y lomito ahumado",
            precio: 7400,
          },
        ],
      },
      {
        nombre: "Focaccia",
        productos: [{ nombre: "Jamón y queso", precio: 7200 }],
      },
      {
        nombre: "Tostado o carlitos",
        productos: [
          // El PDF dice $13000. Es el precio más alto de toda la carta y queda raro
          // frente a un tostado de miga a $5400: conviene confirmarlo con el local.
          { nombre: "Jamón y queso", precio: 13000 },
        ],
      },
      {
        nombre: "Sándwiches lactales",
        productos: [
          {
            nombre: "Primavera",
            descripcion: "Jamón, queso, lechuga, tomate y huevo",
            precio: 6800,
          },
          {
            nombre: "Pollo",
            descripcion: "Rúcula, queso, tomate, huevo y pollo",
            precio: 6800,
          },
          {
            nombre: "Palta",
            descripcion: "Queso, lechuga, zanahoria y palta",
            precio: 7900,
          },
        ],
      },
      {
        nombre: "Pan de miga",
        productos: [
          { nombre: "Miga de jamón y queso", precio: 5400 },
          {
            nombre: "Miga de carne",
            descripcion: "Ketchup, jamón, queso, huevo y peceto",
            precio: 7200,
          },
          {
            nombre: "Miga de pollo",
            descripcion: "Ketchup, jamón, queso, huevo y pollo",
            precio: 7200,
          },
          {
            nombre: "Miga de atún",
            descripcion: "Mayonesa, lechuga, queso y atún",
            precio: 7200,
          },
          {
            nombre: "Triple miga vegetariano",
            descripcion: "Pan de miga negro, queso crema con ciboulette, queso barra y huevo",
            precio: 6700,
          },
          { nombre: "Miga crudo y queso", precio: 7200 },
          {
            nombre: "Bandeja triples",
            descripcion: "Mayonesa, lechuga, tomate, huevo, jamón cocido y queso tybo",
            precio: 9800,
          },
        ],
      },
      {
        nombre: "Pebetes",
        productos: [
          { nombre: "Jamón y queso", precio: 5500 },
          { nombre: "Salame y queso", precio: 5500 },
          {
            nombre: "Primavera",
            descripcion: "Jamón, queso y huevo",
            precio: 5500,
          },
        ],
      },
    ],
  },

  {
    slug: "wraps",
    nombre: "Wraps",
    precioUnico: 7600,
    grupos: [
      {
        productos: [
          {
            nombre: "Carne",
            descripcion: "Peceto, queso, tomate y rúcula",
            precio: 7600,
          },
          {
            nombre: "Pollo",
            descripcion: "Pollo, queso, tomate y lechuga",
            precio: 7600,
          },
          {
            nombre: "Vegetariano",
            descripcion: "Queso, huevo, zanahoria, tomate y lechuga",
            precio: 7600,
          },
          {
            nombre: "Roquefort",
            descripcion: "Queso crema, ciboulette, huevo y roquefort",
            precio: 7600,
          },
          {
            nombre: "Carne y cheddar",
            descripcion: "Barbacoa, jamón, queso, huevo, carne y cheddar",
            precio: 7600,
          },
        ],
      },
    ],
  },

  {
    slug: "ensaladas",
    nombre: "Ensaladas",
    grupos: [
      {
        productos: [
          {
            nombre: "César",
            descripcion: "Pollo, parmesano, croutones y lechuga",
            precio: 6800,
          },
          {
            nombre: "Atún",
            descripcion: "Arroz, atún, tomates cherry, queso y olivas negras",
            precio: 6800,
          },
          {
            nombre: "Litto",
            descripcion: "Rúcula, parmesano, lentejas, tomates cherry y huevo",
            precio: 6500,
          },
          {
            nombre: "Chipre",
            descripcion: "Lentejas, rúcula, choclo, tomates cherry y zanahoria",
            precio: 6800,
          },
          {
            nombre: "Ensalada tibia",
            descripcion: "Zanahoria, lentejas, garbanzos, arroz, papa y remolacha",
            precio: 6800,
          },
        ],
      },
      {
        nombre: "Ensaladas VIP",
        productos: [
          {
            nombre: "Crudo",
            descripcion: "Rúcula, queso, aceitunas, tomates cherry y jamón crudo",
            precio: 7500,
          },
          {
            nombre: "Kanikama",
            descripcion: "Kanikama, lechuga, queso, zanahoria y salsa golf",
            precio: 7500,
          },
          {
            nombre: "Lisboa",
            descripcion: "Choclo, zanahoria, jamón y queso",
            precio: 7500,
          },
          {
            nombre: "París",
            descripcion: "Lechuga, repollo morado, tomates cherry, palta y champignones",
            precio: 7500,
          },
        ],
      },
    ],
  },

  {
    slug: "tartas",
    nombre: "Tartas",
    precioUnico: 5200,
    grupos: [
      {
        productos: [
          { nombre: "Pollo", precio: 5200 },
          { nombre: "Pollo y verdura", precio: 5200 },
          { nombre: "Jamón y queso", precio: 5200 },
          { nombre: "Calabaza y queso", precio: 5200 },
          // En el PDF esta línea dice "Acelga y Queso, Brócoli". No queda claro si es
          // un sabor o dos: se deja tal cual está impreso hasta confirmarlo con ellos.
          { nombre: "Acelga y queso, brócoli", precio: 5200 },
          { nombre: "Zapallito", precio: 5200 },
          { nombre: "Calabaza y verdura", precio: 5200 },
        ],
      },
    ],
  },

  {
    slug: "empanadas",
    nombre: "Empanadas",
    precioUnico: 2400,
    grupos: [
      {
        productos: [
          { nombre: "Jamón y queso", precio: 2400 },
          { nombre: "Verdura", precio: 2400 },
          { nombre: "Capresse", precio: 2400 },
          { nombre: "Carne dulce", precio: 2400 },
          { nombre: "Carne salada", precio: 2400 },
          { nombre: "Pollo", precio: 2400 },
          { nombre: "Soja", precio: 2400 },
        ],
      },
    ],
  },

  {
    slug: "pizzas",
    nombre: "Pizzas",
    grupos: [
      {
        productos: [
          { nombre: "Especial", precio: 8700 },
          { nombre: "Fugazza", precio: 8700 },
          { nombre: "Muzzarella", precio: 8700 },
          { nombre: "4 quesos", precio: 8800 },
        ],
      },
    ],
  },
];

/** Todos los productos aplanados, para el buscador. */
export const todosLosProductos = categorias.flatMap((categoria) =>
  categoria.grupos.flatMap((grupo) =>
    grupo.productos.map((producto) => ({
      ...producto,
      categoriaSlug: categoria.slug,
      categoriaNombre: categoria.nombre,
      grupoNombre: grupo.nombre,
    })),
  ),
);

export const formatearPrecio = (precio: number) =>
  "$" + precio.toLocaleString("es-AR");

/**
 * Para los textos de la web: "más de 70" se lee mejor que un número exacto y,
 * sobre todo, no queda desactualizado cada vez que se suma o saca un producto.
 */
export const cantidadRedonda = Math.floor(todosLosProductos.length / 10) * 10;

/**
 * Los cuatro que se muestran en "Los favoritos de YNNY": un café con facturas,
 * un submarino con medialunas, un tostado y algo de pastelería.
 *
 * Acá van solo los nombres. El precio se busca en la carta, así que no puede
 * quedar desactualizado ni contradecir lo que dice la página de carta. Si algún
 * nombre deja de existir, el build falla en vez de mostrar una tarjeta vacía.
 */
const NOMBRES_FAVORITOS = [
  "Infusión + 2 facturas",
  "Submarino + 2 medialunas",
  "Infusión + medio tostado + vaso de jugo",
  "Infusión + porción de torta + vaso de jugo",
] as const;

export const favoritos = NOMBRES_FAVORITOS.map((nombre) => {
  const producto = todosLosProductos.find((p) => p.nombre === nombre);
  if (!producto) {
    throw new Error(
      `El favorito "${nombre}" no existe en la carta. Revisá NOMBRES_FAVORITOS en src/data/menu.ts.`,
    );
  }
  return producto;
});

/**
 * Selección para el carrusel de la home: un producto por categoría, eligiendo el
 * más barato de cada una para que el escaparate arranque por el precio de entrada.
 * Los precios salen de `categorias`, nunca se escriben dos veces.
 */
export const destacados = categorias.map((categoria) => {
  const productos = categoria.grupos.flatMap((grupo) => grupo.productos);
  const masBarato = productos.reduce((menor, actual) =>
    (actual.precio ?? Infinity) < (menor.precio ?? Infinity) ? actual : menor,
  );

  return {
    ...masBarato,
    categoriaSlug: categoria.slug,
    categoriaNombre: categoria.nombre,
    cuantosHay: productos.length,
  };
});

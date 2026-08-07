/**
 * Configuración del sitio. Al pasar de demo a producción hay que tocar solo esto:
 * poner el dominio definitivo del cliente y bajar `esDemo` a false.
 */
export const sitio = {
  nombre: "YNNY Panadería & Café",
  nombreCorto: "YNNY",
  descripcion:
    "Panadería y café en Rosario. Todo recién hecho, todos los días. Desayunos, meriendas, almuerzos, sándwiches y pastelería en 10 sucursales.",
  ciudad: "Rosario",
  provincia: "Santa Fe",
  instagram: "https://www.instagram.com/ynnycafe/",

  /**
   * Dominio de la demo. NO es un dominio parecido al de YNNY a propósito: esto es una
   * propuesta, no una suplantación. Al cerrar el trabajo se reemplaza por el dominio
   * definitivo, que debe quedar registrado a nombre del cliente.
   */
  url: "https://ynny-propuesta.vercel.app",

  /** Con esto en true el sitio se marca como propuesta y se excluye de los buscadores. */
  esDemo: true,
  autorDemo: "Tobías",
} as const;

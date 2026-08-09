/**
 * Las 10 sucursales de YNNY.
 *
 * Origen de los datos:
 *  - Nombres y teléfonos: linktr.ee/ynnycafe (los botones de WhatsApp del link de bio).
 *  - Coordenadas: cruces de calles calculados sobre la geometría de OpenStreetMap.
 *    Son precisas a nivel esquina, pero NO distinguen en qué ochava está el local:
 *    hay que verificarlas una por una en Google Maps antes de presentar esto.
 *  - Horarios: bio de Instagram (@ynnycafe).
 *
 * Dos números del Linktree están mal escritos y quedaron corregidos acá abajo.
 * Ver la constante `erroresDetectados` al final del archivo.
 */

export type Sucursal = {
  id: string;
  /** Como la nombra YNNY en su propio Linktree. */
  nombre: string;
  /** Dirección para mostrar y para buscar en Google Maps. */
  direccion: string;
  lat: number;
  lng: number;
  /** Formato internacional, solo dígitos. */
  whatsapp: string;
};

export const sucursales: Sucursal[] = [
  {
    id: "buenos-aires-886",
    nombre: "Buenos Aires 886",
    direccion: "Buenos Aires 886",
    lat: -32.948557,
    lng: -60.63303,
    whatsapp: "543416251816",
  },
  {
    id: "espana-san-juan",
    nombre: "España y San Juan",
    direccion: "España y San Juan",
    lat: -32.948671,
    lng: -60.647421,
    whatsapp: "543415004441",
  },
  {
    id: "urquiza-moreno",
    nombre: "Urquiza y Moreno",
    direccion: "Urquiza y Moreno",
    lat: -32.940729,
    lng: -60.649726,
    whatsapp: "543412008696",
  },
  {
    id: "san-martin-9-de-julio",
    nombre: "San Martín y 9 de Julio",
    direccion: "San Martín y 9 de Julio",
    lat: -32.954147,
    lng: -60.638549,
    whatsapp: "543417849121",
  },
  {
    id: "mendoza-entre-rios",
    nombre: "Mendoza y Entre Ríos",
    direccion: "Mendoza y Entre Ríos",
    lat: -32.951013,
    lng: -60.642192,
    // El Linktree tiene "+5403413432595": ese 0 después del 54 invalida el link.
    whatsapp: "543413432595",
  },
  {
    id: "buenos-aires-montevideo",
    nombre: "Bs. As. y Montevideo",
    direccion: "Buenos Aires y Montevideo",
    lat: -32.957098,
    lng: -60.63513,
    whatsapp: "543417799814",
  },
  {
    id: "montevideo-paraguay",
    nombre: "Montevideo y Paraguay",
    direccion: "Montevideo y Paraguay",
    lat: -32.955139,
    lng: -60.646171,
    whatsapp: "543417501884",
  },
  {
    id: "brown-dorrego",
    nombre: "Brown y Dorrego",
    direccion: "Almirante Brown y Manuel Dorrego",
    lat: -32.935141,
    lng: -60.646819,
    whatsapp: "543417184263",
  },
  {
    id: "3-de-febrero-santiago",
    nombre: "3 de Febrero y Santiago",
    direccion: "3 de Febrero y Santiago",
    lat: -32.949608,
    lng: -60.657619,
    whatsapp: "543412662552",
  },
  {
    id: "salta-entre-rios",
    nombre: "Salta y Entre Ríos",
    direccion: "Salta y Entre Ríos",
    lat: -32.938972,
    lng: -60.639182,
    whatsapp: "543417492983",
  },
];

export type Horario = {
  /** Cómo se muestra en pantalla. */
  dias: string;
  franja: string;
  /** Días que cubre, con 0 = domingo (igual que Date.getDay()). */
  diasSemana: number[];
  /** En formato 24 h, para poder comparar contra la hora actual. */
  abre: string;
  cierra: string;
};

/**
 * Horarios tal como los publica YNNY en su bio de Instagram. Los campos de texto
 * y los numéricos dicen exactamente lo mismo: los primeros son para mostrar y los
 * segundos para calcular si está abierto.
 *
 * Ojo con "feriados": no hay calendario de feriados cargado, así que un feriado
 * que caiga entre semana se va a calcular con el horario de lunes a sábados. Para
 * resolverlo bien haría falta la lista de feriados argentinos, que se agrega
 * cuando el cliente confirme si abren distinto esos días.
 */
export const horarios: Horario[] = [
  {
    dias: "Lunes a sábados",
    franja: "7:00 a 21:00",
    diasSemana: [1, 2, 3, 4, 5, 6],
    abre: "07:00",
    cierra: "21:00",
  },
  {
    dias: "Domingos y feriados",
    franja: "7:30 a 21:00",
    diasSemana: [0],
    abre: "07:30",
    cierra: "21:00",
  },
];

/**
 * Fallas concretas encontradas en el link de bio actual. Sirven para la charla
 * con el cliente: son verificables tocando los botones desde un celular.
 */
export const erroresDetectados = [
  {
    sucursal: "Mendoza y Entre Ríos",
    problema:
      'El link es wa.me/+5403413432595. El "0" después del código de país no va en un número internacional, así que el botón no abre el chat.',
  },
  {
    sucursal: "Brown y Dorrego",
    problema:
      'El link dice "?tex=" en lugar de "?text=", así que ese local es el único que recibe los mensajes sin el texto prellenado.',
  },
];

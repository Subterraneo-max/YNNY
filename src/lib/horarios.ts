import { horarios, type Horario } from "@/data/sucursales";

/**
 * Rosario no tiene horario de verano, pero igual se calcula todo contra la zona
 * horaria de Argentina y no contra el reloj del visitante: alguien que abra la
 * página desde España tiene que ver si el local está abierto *allá*, no acá.
 */
const ZONA = "America/Argentina/Buenos_Aires";

const DIAS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Día de la semana y minutos desde medianoche, en hora de Rosario. */
function relojDeRosario(instante: Date) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA,
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instante);

  const buscar = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((p) => p.type === tipo)?.value ?? "";

  // En hora 24 la medianoche puede venir como "24"; se normaliza a 0.
  const hora = Number(buscar("hour")) % 24;

  return {
    diaSemana: DIAS[buscar("weekday")] ?? 0,
    minutos: hora * 60 + Number(buscar("minute")),
  };
}

const aMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "07:00" se muestra como "7:00", que es como lo escribe el negocio. */
const paraMostrar = (hhmm: string) => hhmm.replace(/^0/, "");

const horarioDe = (diaSemana: number): Horario | undefined =>
  horarios.find((h) => h.diasSemana.includes(diaSemana));

export type EstadoApertura =
  | { abierto: true; cierraA: string }
  /** `cuando` en null es un día más adelante que mañana: no se nombra. */
  | { abierto: false; abreA: string; cuando: "hoy" | "mañana" | null }
  /** Por si algún día los horarios dejaran de cubrir los siete días. */
  | { abierto: false; abreA: null; cuando: null };

export function estadoDeApertura(instante: Date = new Date()): EstadoApertura {
  const { diaSemana, minutos } = relojDeRosario(instante);
  const hoy = horarioDe(diaSemana);

  if (hoy) {
    const abre = aMinutos(hoy.abre);
    const cierra = aMinutos(hoy.cierra);

    if (minutos >= abre && minutos < cierra) {
      return { abierto: true, cierraA: paraMostrar(hoy.cierra) };
    }
    // Todavía no abrió: el próximo horario es el de hoy mismo.
    if (minutos < abre) {
      return { abierto: false, abreA: paraMostrar(hoy.abre), cuando: "hoy" };
    }
  }

  // Ya cerró (o hoy no abre): se busca el primer día siguiente con horario.
  // Con los horarios actuales siempre cae en el día siguiente; el resto del
  // recorrido está por si alguna vez dejan de abrir todos los días.
  for (let salto = 1; salto <= 7; salto++) {
    const siguiente = horarioDe((diaSemana + salto) % 7);
    if (siguiente) {
      return {
        abierto: false,
        abreA: paraMostrar(siguiente.abre),
        cuando: salto === 1 ? "mañana" : null,
      };
    }
  }

  return { abierto: false, abreA: null, cuando: null };
}

/** El texto que se muestra al lado del punto verde o gris. */
export function textoDeEstado(estado: EstadoApertura): string {
  if (estado.abierto) return `Abierto ahora · Cierra a las ${estado.cierraA}`;
  if (estado.abreA === null) return "Cerrado";
  if (estado.cuando === null) return `Cerrado · Abre a las ${estado.abreA}`;
  return `Cerrado · Abre ${estado.cuando} a las ${estado.abreA}`;
}

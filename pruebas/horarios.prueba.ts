/**
 * Casos límite de "abierto / cerrado".
 *
 * Se corre con `npx tsx pruebas/horarios.prueba.ts`. No es parte del build.
 *
 * Todas las fechas se escriben en UTC y se esperan resultados en hora de
 * Rosario (UTC-3): así el test comprueba de verdad la conversión de zona y no
 * el reloj de la máquina donde corre.
 */
import { estadoDeApertura, textoDeEstado } from "../src/lib/horarios";

let fallas = 0;

function verificar(descripcion: string, iso: string, esperado: string) {
  const obtenido = textoDeEstado(estadoDeApertura(new Date(iso)));
  const bien = obtenido === esperado;
  if (!bien) fallas++;
  console.log(
    `${bien ? "ok  " : "FALLA"} ${descripcion.padEnd(46)} ${bien ? obtenido : `\n       esperado: ${esperado}\n       obtenido: ${obtenido}`}`,
  );
}

// 2026-08-10 es lunes; 2026-08-09, domingo; 2026-08-15, sábado.
console.log("— Lunes a sábados: 7:00 a 21:00 —");
verificar("lunes 06:59 (un minuto antes de abrir)", "2026-08-10T09:59:00Z", "Cerrado · Abre hoy a las 7:00");
verificar("lunes 07:00 (justo al abrir)", "2026-08-10T10:00:00Z", "Abierto ahora · Cierra a las 21:00");
verificar("lunes 13:30 (media tarde)", "2026-08-10T16:30:00Z", "Abierto ahora · Cierra a las 21:00");
verificar("lunes 20:59 (un minuto antes de cerrar)", "2026-08-10T23:59:00Z", "Abierto ahora · Cierra a las 21:00");
verificar("lunes 21:00 (justo al cerrar)", "2026-08-11T00:00:00Z", "Cerrado · Abre mañana a las 7:00");
verificar("lunes 23:30 (de noche)", "2026-08-11T02:30:00Z", "Cerrado · Abre mañana a las 7:00");
verificar("martes 02:00 (madrugada)", "2026-08-11T05:00:00Z", "Cerrado · Abre hoy a las 7:00");

console.log("\n— Domingos: 7:30 a 21:00 —");
verificar("domingo 07:15 (antes de abrir)", "2026-08-09T10:15:00Z", "Cerrado · Abre hoy a las 7:30");
verificar("domingo 07:30 (justo al abrir)", "2026-08-09T10:30:00Z", "Abierto ahora · Cierra a las 21:00");
verificar("domingo 21:00 (ya cerrado)", "2026-08-10T00:00:00Z", "Cerrado · Abre mañana a las 7:00");

console.log("\n— El sábado abre a las 7:00, no a las 7:30 —");
verificar("sábado 07:10", "2026-08-15T10:10:00Z", "Abierto ahora · Cierra a las 21:00");
verificar("sábado 22:00 (cierra, abre domingo 7:30)", "2026-08-16T01:00:00Z", "Cerrado · Abre mañana a las 7:30");

console.log(
  `\n${fallas === 0 ? "Todos los casos pasan." : `${fallas} caso(s) fallando.`}`,
);
process.exit(fallas === 0 ? 0 : 1);

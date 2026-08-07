import type { Sucursal } from "@/data/sucursales";

const RADIO_TIERRA_KM = 6371;
const aRadianes = (grados: number) => (grados * Math.PI) / 180;

/** Distancia en línea recta entre dos puntos, en kilómetros. */
export function distanciaKm(
  desde: { lat: number; lng: number },
  hasta: { lat: number; lng: number },
): number {
  const dLat = aRadianes(hasta.lat - desde.lat);
  const dLng = aRadianes(hasta.lng - desde.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(desde.lat)) *
      Math.cos(aRadianes(hasta.lat)) *
      Math.sin(dLng / 2) ** 2;
  return RADIO_TIERRA_KM * 2 * Math.asin(Math.sqrt(a));
}

export function ordenarPorCercania(
  sucursales: Sucursal[],
  posicion: { lat: number; lng: number },
): (Sucursal & { distanciaKm: number })[] {
  return sucursales
    .map((sucursal) => ({ ...sucursal, distanciaKm: distanciaKm(posicion, sucursal) }))
    .sort((a, b) => a.distanciaKm - b.distanciaKm);
}

/** "350 m" o "1,2 km", que es como lo diría una persona. */
export function formatearDistancia(km: number): string {
  if (km < 1) return `${Math.round((km * 1000) / 10) * 10} m`;
  return `${km.toLocaleString("es-AR", { maximumFractionDigits: 1 })} km`;
}

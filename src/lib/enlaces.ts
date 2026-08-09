import type { Sucursal } from "@/data/sucursales";

/**
 * Link de WhatsApp con el mensaje ya escrito. El texto arranca nombrando la sucursal
 * para que en el mostrador sepan de dónde viene la consulta sin tener que preguntarlo.
 */
export function linkWhatsApp(sucursal: Sucursal, mensaje?: string): string {
  const texto = mensaje ?? `¡Hola YNNY ${sucursal.nombre}! Quería hacerles una consulta.`;
  return `https://wa.me/${sucursal.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/**
 * Cómo llegar hasta la sucursal.
 *
 * Va con las coordenadas como destino y sin origen: Maps lo resuelve con la
 * ubicación del dispositivo, así que el link funciona igual aunque la persona
 * no le haya dado permiso de ubicación a la web. En el celular abre la app de
 * Maps y en la computadora, el sitio.
 */
export function linkComoLlegar(sucursal: Sucursal): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${sucursal.lat},${sucursal.lng}`;
}

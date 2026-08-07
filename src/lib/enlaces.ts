import type { Sucursal } from "@/data/sucursales";

/**
 * Link de WhatsApp con el mensaje ya escrito. El texto arranca nombrando la sucursal
 * para que en el mostrador sepan de dónde viene la consulta sin tener que preguntarlo.
 */
export function linkWhatsApp(sucursal: Sucursal, mensaje?: string): string {
  const texto = mensaje ?? `¡Hola YNNY ${sucursal.nombre}! Quería hacerles una consulta.`;
  return `https://wa.me/${sucursal.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/** Abre la app de mapas del celular apuntando a la sucursal. */
export function linkMapa(sucursal: Sucursal): string {
  const destino = `${sucursal.direccion}, Rosario, Santa Fe`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`;
}

/** Cómo llegar desde donde esté la persona. */
export function linkComoLlegar(sucursal: Sucursal): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${sucursal.lat},${sucursal.lng}`;
}

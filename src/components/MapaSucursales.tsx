import type { Sucursal } from "@/data/sucursales";

/**
 * Esquema de las sucursales en la ciudad, dibujado en SVG a partir de las coordenadas
 * reales. No es un mapa navegable a propósito: embeber Google Maps costaría medio
 * segundo de carga y varios cientos de kilobytes, y lo que la persona necesita
 * —ver de un vistazo dónde caen los locales y abrir el que le sirve— se resuelve así.
 */
export function MapaSucursales({
  sucursales,
  destacadaId,
}: {
  sucursales: Sucursal[];
  destacadaId?: string;
}) {
  const lats = sucursales.map((s) => s.lat);
  const lngs = sucursales.map((s) => s.lng);
  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);

  // Un grado de longitud es más corto que uno de latitud, y a la altura de Rosario
  // esa diferencia ronda el 16%. Sin corregirla el plano sale estirado a lo ancho.
  const factorLng = Math.cos((((latMin + latMax) / 2) * Math.PI) / 180);

  const ancho = (lngMax - lngMin) * factorLng;
  const alto = latMax - latMin;
  const escala = 100 / Math.max(ancho, alto);
  const margen = 12;

  const posicion = (s: Sucursal) => ({
    x: margen + (s.lng - lngMin) * factorLng * escala,
    y: margen + (latMax - s.lat) * escala,
  });

  const anchoVista = ancho * escala + margen * 2;
  const altoVista = alto * escala + margen * 2;

  return (
    <svg
      viewBox={`0 0 ${anchoVista} ${altoVista}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Ubicación relativa de las ${sucursales.length} sucursales en Rosario`}
    >
      <defs>
        <pattern id="trama" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M8 0H0V8" fill="none" stroke="var(--color-borde)" strokeWidth="0.6" />
        </pattern>
      </defs>

      <rect width={anchoVista} height={altoVista} fill="url(#trama)" rx="3" />

      {sucursales.map((sucursal) => {
        const { x, y } = posicion(sucursal);
        const destacada = sucursal.id === destacadaId;
        return (
          <g key={sucursal.id}>
            {destacada && (
              <circle cx={x} cy={y} r="7" fill="var(--color-lima)" opacity="0.3">
                <animate
                  attributeName="r"
                  values="5;9;5"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={destacada ? 3.6 : 2.4}
              fill={destacada ? "var(--color-lima-hondo)" : "var(--color-tinta)"}
              stroke="var(--color-crema)"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  );
}

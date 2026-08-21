"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Sucursal } from "@/data/sucursales";
import { linkComoLlegar } from "@/lib/enlaces";

/**
 * El mapa de verdad, con las 10 sucursales marcadas sobre las mismas coordenadas
 * que usan los botones de "Cómo llegar".
 *
 * Va con tiles de OpenStreetMap y no con Google Maps embebido: no necesita clave
 * de API, no pone cookies de terceros y no arrastra el iframe de ~900 KB que
 * mete Google. Leaflet suma unos 45 KB y se carga en un chunk aparte, recién
 * cuando la sección entra en pantalla (ver `MapaSucursales`).
 *
 * Si esto pasa a producción con tráfico real conviene mover los tiles a un
 * proveedor con plan (MapTiler, Carto, Stadia): la política de uso de los
 * servidores de OSM es para volumen bajo.
 */

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATRIBUCION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

function icono(destacada: boolean) {
  const clase = destacada ? "pin-sucursal pin-sucursal--destacada" : "pin-sucursal";
  return L.divIcon({
    className: "pin-envoltorio",
    html: `<span class="${clase}"></span>`,
    iconSize: destacada ? [26, 26] : [18, 18],
    iconAnchor: destacada ? [13, 13] : [9, 9],
    popupAnchor: [0, destacada ? -14 : -10],
  });
}

function contenidoPopup(sucursal: Sucursal) {
  const nodo = document.createElement("div");
  nodo.className = "popup-sucursal";

  const titulo = document.createElement("strong");
  titulo.textContent = sucursal.nombre;

  const direccion = document.createElement("span");
  direccion.textContent = sucursal.direccion;

  const enlace = document.createElement("a");
  enlace.href = linkComoLlegar(sucursal);
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.textContent = "Cómo llegar";

  nodo.append(titulo, direccion, enlace);
  return nodo;
}

export function MapaLeaflet({
  sucursales,
  destacadaId,
}: {
  sucursales: Sucursal[];
  destacadaId?: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef(new Map<string, L.Marker>());

  // Monta el mapa una sola vez. `destacadaId` a propósito NO está en las
  // dependencias: si estuviera, elegir "usar mi ubicación" desmontaría y volvería
  // a construir el mapa entero. De eso se ocupa el efecto de abajo.
  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    // Copia local del Map de marcadores para la limpieza: el ref puede apuntar a
    // otro objeto para cuando corra, y el linter tiene razón en avisarlo.
    const registro = marcadores.current;

    const m = L.map(contenedor.current, {
      // El scroll del mouse mueve la página, no el zoom: si no, la rueda queda
      // atrapada al pasar por arriba del mapa. El zoom está en los botones.
      scrollWheelZoom: false,
      // En celular, arrastrar con un dedo tiene que scrollear la página. El pinch
      // para acercar sigue funcionando.
      dragging: !L.Browser.mobile,
      touchZoom: true,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(TILES, { attribution: ATRIBUCION, maxZoom: 19 }).addTo(m);

    for (const sucursal of sucursales) {
      const marcador = L.marker([sucursal.lat, sucursal.lng], {
        icon: icono(false),
        title: sucursal.nombre,
        alt: `Sucursal ${sucursal.nombre}`,
        riseOnHover: true,
      })
        .addTo(m)
        .bindPopup(contenidoPopup(sucursal), {
          closeButton: true,
          maxWidth: 220,
          // En pantallas de 320 px el globo mide casi lo mismo que el mapa: sin
          // este margen se le monta al borde y queda cortado.
          autoPanPadding: [12, 12],
        });

      registro.set(sucursal.id, marcador);
    }

    m.fitBounds(
      L.latLngBounds(sucursales.map((s) => [s.lat, s.lng] as [number, number])),
      { padding: [34, 34], maxZoom: 15 },
    );

    mapa.current = m;

    // El contenedor cambia de alto con los breakpoints y Leaflet no se entera solo.
    const observador = new ResizeObserver(() => m.invalidateSize());
    observador.observe(contenedor.current);

    return () => {
      observador.disconnect();
      m.remove();
      mapa.current = null;
      registro.clear();
    };
  }, [sucursales]);

  // Cuando la persona da su ubicación, el pin de la sucursal más cercana cambia
  // de estilo y el mapa se acerca a ella.
  useEffect(() => {
    const m = mapa.current;
    if (!m) return;

    for (const [id, marcador] of marcadores.current) {
      marcador.setIcon(icono(id === destacadaId));
    }

    if (!destacadaId) return;
    const marcador = marcadores.current.get(destacadaId);
    if (marcador) m.flyTo(marcador.getLatLng(), 15, { duration: 0.9 });
  }, [destacadaId]);

  return (
    <div
      ref={contenedor}
      className="mapa-sucursales h-full w-full"
      role="region"
      aria-label={`Mapa con las ${sucursales.length} sucursales de YNNY en Rosario`}
    />
  );
}

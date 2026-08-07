"use client";

import { useState } from "react";
import { MapaSucursales } from "@/components/MapaSucursales";
import type { Sucursal } from "@/data/sucursales";
import { formatearDistancia, ordenarPorCercania } from "@/lib/distancia";
import { linkComoLlegar, linkMapa, linkWhatsApp } from "@/lib/enlaces";

type Estado = "inicial" | "buscando" | "ubicado" | "sin-permiso" | "error";

const MENSAJES: Record<Exclude<Estado, "inicial" | "ubicado">, string> = {
  buscando: "Buscando tu ubicación…",
  "sin-permiso":
    "No nos diste permiso para usar tu ubicación. No hay problema: abajo están las 10 sucursales.",
  error: "No pudimos obtener tu ubicación. Abajo están las 10 sucursales.",
};

/** `distanciaKm` en null significa que todavía no sabemos dónde está la persona. */
type SucursalConDistancia = Sucursal & { distanciaKm: number | null };

export function ListaSucursales({ sucursales }: { sucursales: Sucursal[] }) {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [posicion, setPosicion] = useState<{ lat: number; lng: number } | null>(null);

  const ordenadas: SucursalConDistancia[] = posicion
    ? ordenarPorCercania(sucursales, posicion)
    : sucursales.map((sucursal) => ({ ...sucursal, distanciaKm: null }));

  const masCercana = posicion ? ordenadas[0] : undefined;

  function buscarCercana() {
    if (!("geolocation" in navigator)) {
      setEstado("error");
      return;
    }
    setEstado("buscando");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosicion({ lat: coords.latitude, lng: coords.longitude });
        setEstado("ubicado");
      },
      (error) => {
        setEstado(error.code === error.PERMISSION_DENIED ? "sin-permiso" : "error");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  return (
    <>
      <div className="rounded-3xl border border-borde bg-crema-hondo p-5 sm:p-7">
        <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <h2 className="titular text-2xl">¿Cuál te queda más cerca?</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-tinta-suave">
              Te ordenamos las sucursales por distancia y te abrimos el WhatsApp de esa misma
              sucursal, no el de otra.
            </p>

            {estado === "inicial" && (
              <button
                type="button"
                onClick={buscarCercana}
                className="mt-4 rounded-full bg-tinta px-5 py-3 text-sm font-bold text-crema transition hover:bg-lima hover:text-tinta"
              >
                Usar mi ubicación
              </button>
            )}

            {estado !== "inicial" && estado !== "ubicado" && (
              <p
                className="mt-4 text-sm font-medium text-tinta-suave"
                role="status"
                aria-live="polite"
              >
                {MENSAJES[estado]}
              </p>
            )}

            {estado === "ubicado" && masCercana && (
              <p className="mt-4 text-sm font-medium" role="status" aria-live="polite">
                La más cercana es{" "}
                <strong className="font-bold">{masCercana.nombre}</strong>
                {masCercana.distanciaKm !== null && `, a ${formatearDistancia(masCercana.distanciaKm)}`}.
              </p>
            )}
          </div>

          <div className="w-full max-w-[15rem] justify-self-center sm:justify-self-end">
            <MapaSucursales sucursales={sucursales} destacadaId={masCercana?.id} />
          </div>
        </div>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {ordenadas.map((sucursal) => {
          const distancia = sucursal.distanciaKm;
          const esLaMasCercana = sucursal.id === masCercana?.id;

          return (
            <li
              key={sucursal.id}
              className={`flex flex-col rounded-2xl border bg-crema p-5 transition ${
                esLaMasCercana ? "border-lima-hondo ring-2 ring-lima" : "border-borde"
              }`}
            >
              {esLaMasCercana && (
                <span className="mb-2 w-fit rounded-full bg-lima px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-tinta">
                  La más cercana
                </span>
              )}

              <h3 className="titular text-xl">{sucursal.nombre}</h3>
              <p className="mt-1 text-sm text-tinta-suave">
                {sucursal.direccion}
                {distancia !== null && (
                  <span className="font-semibold text-tinta">
                    {" · "}
                    {formatearDistancia(distancia)}
                  </span>
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={linkWhatsApp(sucursal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-lima px-4 py-2 text-sm font-bold text-tinta transition hover:bg-lima-hondo hover:text-crema"
                >
                  WhatsApp
                </a>
                <a
                  href={posicion ? linkComoLlegar(sucursal) : linkMapa(sucursal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-borde px-4 py-2 text-sm font-semibold transition hover:bg-crema-hondo"
                >
                  {posicion ? "Cómo llegar" : "Ver en el mapa"}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

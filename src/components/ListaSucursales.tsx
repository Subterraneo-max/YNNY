"use client";

import { useState } from "react";
import { EstadoSucursal } from "@/components/EstadoSucursal";
import { MapaSucursales } from "@/components/MapaSucursales";
import type { Sucursal } from "@/data/sucursales";
import { formatearDistancia, ordenarPorCercania } from "@/lib/distancia";
import { linkComoLlegar, linkWhatsApp } from "@/lib/enlaces";

type Estado = "inicial" | "buscando" | "ubicado" | "sin-permiso" | "error";

const MENSAJES: Record<Exclude<Estado, "inicial" | "ubicado">, string> = {
  buscando: "Buscando tu ubicación…",
  "sin-permiso":
    "No nos diste permiso para usar tu ubicación. Abajo están todas las sucursales.",
  error: "No pudimos obtener tu ubicación. Abajo están todas las sucursales.",
};

/** `distanciaKm` en null significa que todavía no sabemos dónde está la persona. */
type SucursalConDistancia = Sucursal & { distanciaKm: number | null };

function BotonesSucursal({ sucursal }: { sucursal: Sucursal }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <a
        href={linkWhatsApp(sucursal)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm bg-lima px-4 py-3 text-sm font-bold text-cacao transition-colors hover:bg-cacao hover:text-crema"
      >
        WhatsApp
      </a>
      {/*
        Va siempre, con o sin permiso de ubicación: el link lleva las coordenadas
        del local como destino y Maps resuelve el origen solo. En el celular abre
        la app de Maps; en la computadora, el sitio.
      */}
      <a
        href={linkComoLlegar(sucursal)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-sm border border-cacao/25 px-4 py-3 text-sm font-semibold transition-colors hover:border-cacao hover:bg-cacao hover:text-crema"
      >
        Cómo llegar
      </a>
    </div>
  );
}

export function ListaSucursales({ sucursales }: { sucursales: Sucursal[] }) {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [posicion, setPosicion] = useState<{ lat: number; lng: number } | null>(null);

  const ordenadas: SucursalConDistancia[] = posicion
    ? ordenarPorCercania(sucursales, posicion)
    : sucursales.map((sucursal) => ({ ...sucursal, distanciaKm: null }));

  const masCercana = posicion ? ordenadas[0] : undefined;
  // La destacada ya se muestra arriba en grande, así que no se repite en la grilla.
  const resto = masCercana ? ordenadas.slice(1) : ordenadas;

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
        // Si se niega el permiso no pasa nada: la lista completa sigue abajo.
        setEstado(error.code === error.PERMISSION_DENIED ? "sin-permiso" : "error");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  return (
    <>
      <div className="bg-crema-hondo p-6 sm:p-9">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="display text-[clamp(1.5rem,5vw,2.4rem)]">
              ¿Cuál te queda más cerca?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cacao-suave">
              Encontrá tu YNNY más cercano y contactá directamente con esa sucursal.
            </p>

            {estado === "inicial" && (
              <button
                type="button"
                onClick={buscarCercana}
                className="mt-5 rounded-sm bg-cacao px-6 py-3.5 text-sm font-bold text-crema transition duration-200 hover:scale-[1.04] hover:bg-lima hover:text-cacao active:scale-[0.97]"
              >
                Usar mi ubicación
              </button>
            )}

            {estado !== "inicial" && estado !== "ubicado" && (
              <p
                className="mt-5 text-sm font-medium text-cacao-suave"
                role="status"
                aria-live="polite"
              >
                {MENSAJES[estado]}
              </p>
            )}
          </div>

          {/*
            El mapa marca las 10 sucursales y, en cuanto la persona comparte su
            ubicación, resalta la más cercana y vuela hasta ella.
          */}
          <MapaSucursales
            sucursales={sucursales}
            destacadaId={masCercana?.id}
            className="h-[20rem] sm:h-[24rem]"
          />
        </div>
      </div>

      {/* La más cercana, en grande y con las dos acciones a mano. */}
      {masCercana && (
        <div
          className="entra mt-6 border-2 border-lima-hondo bg-crema p-6 sm:p-8"
          role="status"
          aria-live="polite"
        >
          <span className="mb-3 inline-block bg-lima px-3 py-1 text-[0.7rem] font-bold tracking-wide text-cacao uppercase">
            Tu YNNY más cercano
          </span>
          <h3 className="display text-[clamp(1.6rem,6vw,2.6rem)]">{masCercana.nombre}</h3>
          <p className="mt-2 text-cacao-suave">
            {masCercana.direccion}
            {masCercana.distanciaKm !== null && (
              <span className="font-semibold text-cacao">
                {" · a "}
                {formatearDistancia(masCercana.distanciaKm)}
              </span>
            )}
          </p>
          <EstadoSucursal className="mt-2" />
          <BotonesSucursal sucursal={masCercana} />
        </div>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {resto.map((sucursal) => (
          <li key={sucursal.id} className="entra flex flex-col border border-borde bg-crema p-5">
            <h3 className="display text-xl">{sucursal.nombre}</h3>
            <p className="mt-1 text-sm text-cacao-suave">
              {sucursal.direccion}
              {sucursal.distanciaKm !== null && (
                <span className="font-semibold text-cacao">
                  {" · a "}
                  {formatearDistancia(sucursal.distanciaKm)}
                </span>
              )}
            </p>
            <EstadoSucursal className="mt-2" />
            <BotonesSucursal sucursal={sucursal} />
          </li>
        ))}
      </ul>
    </>
  );
}

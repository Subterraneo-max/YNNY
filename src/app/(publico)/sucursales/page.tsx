import type { Metadata } from "next";
import { ListaSucursales } from "@/components/ListaSucursales";
import { Marquesina } from "@/components/Marquesina";
import { TituloEntrada } from "@/components/TituloEntrada";
import { horarios, sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Sucursales",
  description: `Las ${sucursales.length} sucursales de ${sitio.nombre} en ${sitio.ciudad}: dirección, horarios y WhatsApp de cada local.`,
};

export default function PaginaSucursales() {
  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-32 pb-8 sm:pt-40">
        <p className="text-xs font-bold tracking-[0.2em] text-lima-hondo uppercase">
          {sitio.ciudad}
        </p>
        <TituloEntrada
          texto={`${sucursales.length} sucursales`}
          como="h1"
          className="display mt-3 text-[clamp(2.4rem,9.6vw,6.5rem)]"
        />
        <div className="entra" style={{ "--d": 220 } as React.CSSProperties}>
          <p className="mt-5 max-w-xl leading-relaxed text-cacao-suave">
            {horarios.map((horario) => `${horario.dias}, de ${horario.franja}`).join(". ")}.
          </p>
        </div>
      </div>

      <Marquesina
        textos={sucursales.map((sucursal) => sucursal.nombre.toUpperCase())}
        velocidad={34}
      />

      <div className="mx-auto max-w-5xl px-4 pt-12 pb-24">
        <ListaSucursales sucursales={sucursales} />
      </div>
    </>
  );
}

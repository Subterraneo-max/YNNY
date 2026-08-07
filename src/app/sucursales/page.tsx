import type { Metadata } from "next";
import { ListaSucursales } from "@/components/ListaSucursales";
import { horarios, sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Sucursales",
  description: `Las ${sucursales.length} sucursales de ${sitio.nombre} en ${sitio.ciudad}: dirección, horarios y WhatsApp de cada local.`,
};

export default function PaginaSucursales() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lima-hondo">
          {sitio.ciudad}
        </p>
        <h1 className="titular mt-2 text-4xl sm:text-5xl">
          {sucursales.length} sucursales
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-tinta-suave">
          {horarios.map((h) => `${h.dias}, de ${h.franja}`).join(". ")}.
        </p>
      </header>

      <ListaSucursales sucursales={sucursales} />
    </div>
  );
}

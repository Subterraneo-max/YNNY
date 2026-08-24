/**
 * Los ladrillos de los formularios del panel.
 *
 * Todos comparten tres cosas: etiqueta visible siempre (nunca un placeholder
 * haciendo de etiqueta, que desaparece al escribir), texto de ayuda en
 * castellano llano, y 44 px de alto mínimo para que se pueda usar con el dedo
 * detrás del mostrador.
 */

const CLASES_CAMPO =
  "mt-2 w-full rounded-sm border border-cacao/25 bg-crema px-4 py-3 text-base outline-none transition focus:border-cacao focus:ring-2 focus:ring-lima";

export function Campo({
  etiqueta,
  nombre,
  ayuda,
  children,
}: {
  etiqueta: string;
  nombre: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={nombre} className="block text-sm font-semibold">
        {etiqueta}
      </label>
      {children}
      {ayuda && <p className="mt-1.5 text-xs leading-relaxed text-cacao-suave">{ayuda}</p>}
    </div>
  );
}

export function CampoTexto({
  etiqueta,
  nombre,
  ayuda,
  valor,
  requerido = false,
  tipo = "text",
  modoEntrada,
}: {
  etiqueta: string;
  nombre: string;
  ayuda?: string;
  valor?: string | number | null;
  requerido?: boolean;
  tipo?: string;
  modoEntrada?: "text" | "numeric" | "decimal";
}) {
  return (
    <Campo etiqueta={etiqueta} nombre={nombre} ayuda={ayuda}>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        inputMode={modoEntrada}
        required={requerido}
        defaultValue={valor ?? ""}
        className={CLASES_CAMPO}
      />
    </Campo>
  );
}

export function CampoArea({
  etiqueta,
  nombre,
  ayuda,
  valor,
}: {
  etiqueta: string;
  nombre: string;
  ayuda?: string;
  valor?: string | null;
}) {
  return (
    <Campo etiqueta={etiqueta} nombre={nombre} ayuda={ayuda}>
      <textarea
        id={nombre}
        name={nombre}
        rows={3}
        defaultValue={valor ?? ""}
        className={`${CLASES_CAMPO} resize-y`}
      />
    </Campo>
  );
}

export function CampoSelect({
  etiqueta,
  nombre,
  ayuda,
  valor,
  opciones,
}: {
  etiqueta: string;
  nombre: string;
  ayuda?: string;
  valor?: string | null;
  opciones: { valor: string; texto: string }[];
}) {
  return (
    <Campo etiqueta={etiqueta} nombre={nombre} ayuda={ayuda}>
      <select id={nombre} name={nombre} defaultValue={valor ?? ""} className={CLASES_CAMPO}>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    </Campo>
  );
}

/** Casilla con el texto al lado y toda la fila clicable. */
export function CampoCasilla({
  etiqueta,
  nombre,
  ayuda,
  valor = false,
}: {
  etiqueta: string;
  nombre: string;
  ayuda?: string;
  valor?: boolean;
}) {
  return (
    <label
      htmlFor={nombre}
      className="flex cursor-pointer items-start gap-3 rounded-sm border border-borde px-4 py-3.5 transition hover:border-cacao/40"
    >
      <input
        id={nombre}
        name={nombre}
        type="checkbox"
        defaultChecked={valor}
        className="mt-0.5 size-5 shrink-0 accent-lima-hondo"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{etiqueta}</span>
        {ayuda && <span className="mt-0.5 block text-xs leading-relaxed text-cacao-suave">{ayuda}</span>}
      </span>
    </label>
  );
}

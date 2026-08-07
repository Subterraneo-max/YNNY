export function Logo({
  className = "",
  /**
   * La bajada "PANADERÍA & CAFÉ" solo se lee a tamaños grandes. Además, dentro de un
   * enlace obliga a que el nombre accesible la incluya palabra por palabra, así que
   * en el encabezado va apagada.
   */
  conBajada = true,
}: {
  className?: string;
  conBajada?: boolean;
}) {
  return (
    <span
      className={`inline-flex aspect-square items-center justify-center rounded-full bg-tinta text-crema ${className}`}
    >
      <span className="flex flex-col items-center leading-none">
        <span className="titular text-[0.62em] tracking-tight">YNNY</span>
        {conBajada && (
          <span
            aria-hidden="true"
            className="mt-[0.12em] text-[0.14em] font-medium tracking-[0.18em] text-crema/70"
          >
            PANADERÍA &amp; CAFÉ
          </span>
        )}
      </span>
    </span>
  );
}

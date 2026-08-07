/**
 * Ilustraciones cenitales de producto, en SVG.
 *
 * La referencia de diseño se apoya en fotografía de producto en casi todas sus
 * secciones. Como todavía no tenemos fotos de YNNY, estas ilustraciones ocupan
 * exactamente ese lugar: mismo encuadre circular, mismo tamaño, misma posición.
 * Cuando lleguen las fotos reales se reemplaza este componente por un <Image>
 * y el layout no se entera.
 *
 * Cuestan 0 bytes de red (van en el HTML), escalan sin pixelarse y nunca
 * aparecen rotas, que es más de lo que puede decir una foto hotlinkeada.
 */

export type TipoIlustracion =
  | "infusion"
  | "factura"
  | "sandwich"
  | "wrap"
  | "ensalada"
  | "tarta"
  | "empanada"
  | "pizza"
  | "plato";

/** Cada categoría de la carta tiene su dibujo. */
export const TIPO_POR_CATEGORIA: Record<string, TipoIlustracion> = {
  desayunos: "infusion",
  almuerzos: "plato",
  sandwiches: "sandwich",
  wraps: "wrap",
  ensaladas: "ensalada",
  tartas: "tarta",
  empanadas: "empanada",
  pizzas: "pizza",
};

/** Hash estable: el mismo producto siempre se dibuja igual, en cliente y en servidor. */
function semilla(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 100000;
  return h;
}

const MASA = "#d9a441";
const MASA_OSCURA = "#b07c26";
const MIGA = "#f2e2c2";
const VERDE = "#7d9b3c";
const TOMATE = "#b4472e";
const CAFE = "#4a3020";
const CREMA_CAFE = "#c9a06a";
const PORCELANA = "#f7f2e7";

function Infusion() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      <circle cx="100" cy="100" r="72" fill={PORCELANA} />
      <circle cx="100" cy="100" r="62" fill={CAFE} />
      {/* Hoja de latte art */}
      <path
        d="M100 55c14 16 20 30 20 42 0 14-9 24-20 24s-20-10-20-24c0-12 6-26 20-42z"
        fill={CREMA_CAFE}
        opacity="0.92"
      />
      <path d="M100 62v72" stroke={CAFE} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path
        d="M100 92c-9 4-15 10-18 18M100 92c9 4 15 10 18 18M100 110c-7 4-11 9-13 15M100 110c7 4 11 9 13 15"
        stroke={CAFE}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
    </>
  );
}

function Factura() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      {/* Media luna: arco exterior y arco interior cerrando la punta */}
      <path
        d="M40 128c-6-38 18-72 56-78 20-3 38 3 50 15-16-4-34-2-48 6-20 11-30 32-26 54 2 12 9 22 19 28-24 4-47-9-51-25z"
        fill={MASA}
        stroke={MASA_OSCURA}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M62 74c8 10 12 24 10 38M84 62c6 12 8 26 4 40M108 60c2 12 2 24-2 34"
        stroke={MASA_OSCURA}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </>
  );
}

function Sandwich() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      {/* Mitad de atrás */}
      <g transform="translate(-14 10) rotate(-8 100 100)">
        <path d="M56 132h88L100 58z" fill={MIGA} stroke={MASA_OSCURA} strokeWidth="3" strokeLinejoin="round" />
      </g>
      {/* Mitad de adelante, con las capas a la vista */}
      <g transform="translate(16 -6) rotate(6 100 100)">
        <path d="M52 130h96L100 52z" fill={MIGA} stroke={MASA_OSCURA} strokeWidth="3" strokeLinejoin="round" />
        <path d="M67 105h66l-8-13H75z" fill={VERDE} />
        <path d="M75 92h50l-8-13H83z" fill="#e8a0a0" />
        <path d="M83 79h34l-8-13H91z" fill="#f0cf6a" />
      </g>
    </>
  );
}

/** Espiral de Arquímedes (r = paso · θ), que es la forma real de un arrollado. */
function espiral(vueltas: number, paso: number) {
  const puntos: string[] = [];
  const total = Math.round(vueltas * 40);
  for (let i = 0; i <= total; i++) {
    const t = (i / 40) * Math.PI * 2;
    const r = paso * t;
    puntos.push(`${(100 + Math.cos(t) * r).toFixed(1)} ${(100 + Math.sin(t) * r).toFixed(1)}`);
  }
  return `M${puntos.join("L")}`;
}

function Wrap() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      <circle cx="100" cy="100" r="72" fill={MIGA} stroke={MASA_OSCURA} strokeWidth="3" />
      {/* El relleno enrollado, visto de punta */}
      <path d={espiral(2.6, 4.1)} stroke={VERDE} strokeWidth="11" fill="none" strokeLinecap="round" />
      <path
        d={espiral(2.6, 4.1)}
        stroke={TOMATE}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Borde de la tortilla, por encima del relleno */}
      <circle cx="100" cy="100" r="72" fill="none" stroke={MASA_OSCURA} strokeWidth="4" />
    </>
  );
}

function Ensalada() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      <circle cx="100" cy="100" r="76" fill={PORCELANA} />
      <circle cx="100" cy="100" r="64" fill="#eae2d0" />
      {[0, 60, 120, 180, 240, 300].map((angulo) => (
        <ellipse
          key={angulo}
          cx="100"
          cy="66"
          rx="20"
          ry="27"
          fill={VERDE}
          opacity="0.9"
          transform={`rotate(${angulo} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="18" fill="#96b34e" />
      <circle cx="86" cy="88" r="8" fill={TOMATE} />
      <circle cx="118" cy="110" r="7" fill={TOMATE} />
      <circle cx="112" cy="82" r="5.5" fill="#f0cf6a" />
    </>
  );
}

function Tarta() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      {/* Borde repulgado: círculos alrededor del perímetro */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={100 + Math.cos(a) * 74}
            cy={100 + Math.sin(a) * 74}
            r="11"
            fill={MASA}
          />
        );
      })}
      <circle cx="100" cy="100" r="74" fill={MASA} />
      <circle cx="100" cy="100" r="60" fill="#c98f36" />
      {/* Enrejado */}
      {[-36, -12, 12, 36].map((d) => (
        <rect key={`h${d}`} x="40" y={97 + d} width="120" height="9" rx="4" fill={MASA} />
      ))}
      {[-36, -12, 12, 36].map((d) => (
        <rect key={`v${d}`} x={97 + d} y="40" width="9" height="120" rx="4" fill={MASA} opacity="0.75" />
      ))}
      <circle cx="100" cy="100" r="60" fill="none" stroke={MASA_OSCURA} strokeWidth="3" />
    </>
  );
}

function Empanada() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      <path
        d="M46 118a54 54 0 0 1 108 0z"
        fill={MASA}
        stroke={MASA_OSCURA}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Repulgue sobre el borde recto */}
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${52 + i * 13} 118c4-9 9-9 13 0`}
          fill="none"
          stroke={MASA_OSCURA}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M74 96c6-8 14-12 26-12s20 4 26 12"
        fill="none"
        stroke={MASA_OSCURA}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </>
  );
}

function Pizza({ variacion }: { variacion: number }) {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      <circle cx="100" cy="100" r="80" fill={MASA} />
      <circle cx="100" cy="100" r="68" fill="#e8c96b" />
      <circle cx="100" cy="100" r="62" fill={TOMATE} opacity="0.85" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = ((i + variacion / 100) / 7) * Math.PI * 2;
        const r = 26 + ((i * 13 + variacion) % 22);
        return (
          <circle
            key={i}
            cx={100 + Math.cos(a) * r}
            cy={100 + Math.sin(a) * r}
            r="10"
            fill="#a33b23"
            stroke="#8e2f1b"
            strokeWidth="2"
          />
        );
      })}
      {/* Corte en 8 porciones */}
      {[0, 45, 90, 135].map((g) => (
        <line
          key={g}
          x1="100"
          y1="38"
          x2="100"
          y2="162"
          stroke={MASA}
          strokeWidth="2.5"
          opacity="0.5"
          transform={`rotate(${g} 100 100)`}
        />
      ))}
    </>
  );
}

function Plato() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#e8ddc8" />
      <circle cx="100" cy="100" r="82" fill={PORCELANA} />
      <circle cx="100" cy="100" r="66" fill="#f0e8d8" />
      {/* Milanesa */}
      <path
        d="M62 118c-6-20 6-38 28-42 20-4 38 6 42 24 3 14-6 26-22 30-20 5-42-2-48-12z"
        fill={MASA}
        stroke={MASA_OSCURA}
        strokeWidth="3"
      />
      {/* Guarnición */}
      <circle cx="128" cy="126" r="12" fill={VERDE} />
      <circle cx="112" cy="136" r="9" fill="#96b34e" />
      <circle cx="140" cy="112" r="7" fill={TOMATE} />
    </>
  );
}

const DIBUJOS: Record<TipoIlustracion, (p: { variacion: number }) => React.ReactElement> = {
  infusion: Infusion,
  factura: Factura,
  sandwich: Sandwich,
  wrap: Wrap,
  ensalada: Ensalada,
  tarta: Tarta,
  empanada: Empanada,
  pizza: Pizza,
  plato: Plato,
};

export function IlustracionProducto({
  tipo,
  nombre,
  className = "",
}: {
  tipo: TipoIlustracion;
  /** Da la variación y el texto alternativo. */
  nombre: string;
  className?: string;
}) {
  const Dibujo = DIBUJOS[tipo];
  const variacion = semilla(nombre);
  // Un giro leve y estable por producto, para que dos tarjetas iguales no se vean clonadas.
  const giro = (variacion % 24) - 12;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`Ilustración de ${nombre}`}
    >
      <g transform={`rotate(${giro} 100 100)`}>
        <Dibujo variacion={variacion} />
      </g>
    </svg>
  );
}

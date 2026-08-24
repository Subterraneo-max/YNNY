import { ImageResponse } from "next/og";
import { aplanarProductos, leerCarta } from "@/lib/carta";
import { sucursales } from "@/data/sucursales";
import { sitio } from "@/lib/sitio";

/**
 * Tarjeta que se ve cuando el link se comparte por WhatsApp.
 *
 * Importa más de lo que parece: esta propuesta se va a mostrar pasando el link
 * por chat, y un link sin imagen se lee como algo improvisado. Se genera en el
 * build, así que no hay que mantener un archivo aparte ni se desactualiza
 * cuando cambian los datos.
 *
 * Satori (el motor detrás de ImageResponse) solo entiende un subconjunto de
 * CSS: flexbox sí, grid no, y todo elemento con más de un hijo necesita
 * `display: flex` explícito.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${sitio.nombre} — panadería en ${sitio.ciudad}`;

const CREMA = "#f0eae0";
const CACAO = "#35291f";
const LIMA = "#a8c41e";

export default async function Imagen() {
  const carta = await leerCarta();
  const cuantosProductos = aplanarProductos(carta.categorias).length;
  const cuantasCategorias = carta.categorias.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: CREMA,
          color: CACAO,
          fontFamily: "sans-serif",
        }}
      >
        {sitio.esDemo && (
          <div
            style={{
              display: "flex",
              backgroundColor: CACAO,
              color: CREMA,
              padding: "14px 56px",
              fontSize: 22,
            }}
          >
            <span style={{ color: LIMA, fontWeight: 700 }}>Propuesta no oficial</span>
            {/* Texto y expresión mezclados serían dos hijos, y Satori exige que
                cualquier elemento con más de uno declare display explícito. */}
            <span style={{ marginLeft: 14, opacity: 0.7 }}>
              {`Demo hecha por ${sitio.autorDemo}. No pertenece a ${sitio.nombreCorto}.`}
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 56px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 96,
                height: 96,
                borderRadius: 96,
                backgroundColor: CACAO,
                color: CREMA,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              YNNY
            </div>
            <div
              style={{
                marginLeft: 24,
                fontSize: 26,
                letterSpacing: 5,
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              {`Panadería & café · ${sitio.ciudad}`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>
              TODO RECIÉN HECHO
            </div>
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -3,
                color: "#556308",
              }}
            >
              TODOS LOS DÍAS
            </div>
          </div>

          <div style={{ display: "flex" }}>
            {[
              { dato: String(sucursales.length), etiqueta: "sucursales" },
              { dato: String(cuantosProductos), etiqueta: "productos" },
              { dato: String(cuantasCategorias), etiqueta: "categorías" },
              { dato: "7 a 21", etiqueta: "todos los días" },
            ].map((item) => (
              <div
                key={item.etiqueta}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: 64,
                }}
              >
                <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
                  {item.dato}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    opacity: 0.6,
                  }}
                >
                  {item.etiqueta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", height: 16, backgroundColor: LIMA }} />
      </div>
    ),
    size,
  );
}

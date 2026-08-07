/**
 * Parte un texto en letras animables sin romper las palabras.
 *
 * Si se sueltan los <span> de cada letra directamente en el contenedor, el
 * navegador los trata como unidades independientes y corta las palabras a la
 * mitad ("TODOS L / OS DÍAS"). Por eso cada palabra va envuelta en un
 * inline-block con whitespace-nowrap: adentro se anima letra por letra, pero
 * hacia afuera sigue siendo una sola pieza indivisible.
 *
 * El overflow-hidden de cada palabra es lo que permite que las letras entren
 * "desde abajo" en lugar de aparecer flotando.
 *
 * `--i` lleva el número de orden de cada letra: es lo que usa el escalonado en
 * CSS cuando la entrada no la maneja GSAP.
 */
export function TextoEnLetras({ texto }: { texto: string }) {
  const palabras = texto.split(" ");
  let orden = 0;

  return (
    <>
      {palabras.map((palabra, iPalabra) => (
        <span
          key={`${palabra}-${iPalabra}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom whitespace-nowrap"
        >
          {[...palabra].map((caracter, iLetra) => (
            <span
              key={`${caracter}-${iLetra}`}
              className="letra"
              style={{ "--i": orden++ } as React.CSSProperties}
            >
              {caracter}
            </span>
          ))}
          {/* El espacio entre palabras también se anima, si no queda un hueco fijo. */}
          {iPalabra < palabras.length - 1 && (
            <span className="letra" style={{ "--i": orden++ } as React.CSSProperties}>
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </>
  );
}

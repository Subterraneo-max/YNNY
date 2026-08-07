import { TextoEnLetras } from "@/components/TextoEnLetras";

/**
 * Titular para lo que está arriba del pliegue.
 *
 * Hace lo mismo que `TituloRevelado` —entra letra por letra— pero con una
 * animación CSS en vez de GSAP, y sin `"use client"`: no manda ni un byte de
 * JavaScript ni espera a la hidratación. Es lo que hay que usar en el primer
 * titular de cada página, porque suele ser el elemento que mide el Largest
 * Contentful Paint y con GSAP quedaba invisible hasta que bajaba el bundle.
 *
 * Para lo que aparece más abajo va `TituloRevelado`, que sí necesita saber
 * cuándo entró en pantalla.
 */
export function TituloEntrada({
  texto,
  className = "",
  como: Etiqueta = "h1",
}: {
  texto: string;
  className?: string;
  como?: "h1" | "h2";
}) {
  return (
    <Etiqueta className={`entra-letras ${className}`} aria-label={texto}>
      <TextoEnLetras texto={texto} />
    </Etiqueta>
  );
}

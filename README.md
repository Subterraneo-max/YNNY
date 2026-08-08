# Propuesta web para YNNY Panadería & Café

Demo no solicitada para YNNY (Rosario, 10 sucursales). Reemplaza el Linktree y el PDF de
la carta por un sitio propio.

**Esto es una propuesta, no el sitio oficial de YNNY.** El banner de aviso y el `noindex`
se controlan con `esDemo` en `src/lib/sitio.ts` y no hay que apagarlos hasta que el
trabajo esté cerrado y el cliente sea dueño del dominio.

## Correr

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Qué hay

| Ruta | Qué es |
|---|---|
| `/` | Home: hero, escaparate de precios, categorías, mapa de sucursales |
| `/carta` | 72 productos en 8 categorías, con buscador y navegación por categoría |
| `/sucursales` | Las 10, con "cuál me queda más cerca" y WhatsApp por local |

Los datos viven en dos archivos y son lo único que se toca para replicar esto en otro
negocio: `src/data/menu.ts` y `src/data/sucursales.ts`.

## Diseño

Sigue una referencia de cafetería: crema y cacao, titulares anchos y pesadísimos,
marquesinas, escaparate horizontal y filas alternadas. Dos decisiones deliberadas:

- **El verde lima de YNNY se conserva como acento.** La referencia es enteramente marrón,
  pero tirar el color de marca del cliente para copiar una maqueta sería un mal negocio.
- **El hero lleva dos fotos reales; el resto son ilustraciones SVG.** Las dos fotos
  (`src/imagenes/`) salen de Unsplash, cuya licencia permite uso comercial sin atribución.
  Las ilustraciones de las demás secciones (`src/components/IlustracionProducto.tsx`)
  ocupan exactamente el lugar de una foto y se reemplazan por `<Image>` sin tocar el
  layout.

  **Las fotos del hero son de un café genérico, no de YNNY.** Sirven para que la demo se
  vea terminada, pero un dueño rosarino nota que ese croissant no es una medialuna. Antes
  de mostrarla conviene cambiarlas por dos fotos de ellos: son dos archivos en
  `src/imagenes/` con el mismo nombre y listo.

- **El hero cambia de composición según el ancho.** En pantalla grande las fotos flotan a
  los costados del titular saliéndose por el borde, como en la referencia. En celular eso
  tapaba las letras y los números, así que ahí pasan a ser un par en el flujo debajo del
  titular. Un solo marcado hace las dos cosas, con `sm:contents`.

**No hay testimonios de clientes.** La referencia tiene una sección de reseñas; inventarlas
sería fabricar contenido. Ese lugar lo ocupa un bloque con las sucursales y los horarios,
que es información real.

## Animación

`GSAP` + `ScrollTrigger` para todo lo atado al scroll, y `Lenis` para el scroll suave,
manejado por el mismo reloj que GSAP (ver `src/components/ProveedorScroll.tsx`).

Las entradas de lo que está arriba del pliegue son **CSS puro**, no GSAP: con GSAP el
titular quedaba invisible hasta que bajaba e hidrataba el bundle, y eso empujaba el LCP.
Todo respeta `prefers-reduced-motion`, y hay una red de seguridad que muestra el contenido
si GSAP no llega a correr.

`motion` (framer-motion) **se quitó a propósito**: eran 50 KB de JavaScript para hovers y
apariciones que CSS y el GSAP ya cargado resuelven igual. Ver la tabla de abajo.

## Medido, no estimado

Lighthouse mobile sobre el build de producción:

| | Home | Carta | Sucursales |
|---|---|---|---|
| Performance | 89 | 92 | 96 |
| Accesibilidad | 100 | 100 | 100 |
| Buenas prácticas | 100 | 100 | 100 |
| SEO | 100\* | 100\* | 100\* |
| CLS | 0 | 0 | 0 |

\* Da 63 mientras `esDemo` esté en `true`, porque la demo se excluye a propósito de los
buscadores. Con `esDemo: false` da 100 y sin fallas.

**El costo de las animaciones, con números:**

| | Antes del rediseño | Con Motion | Sin Motion (actual) |
|---|---|---|---|
| Performance (home) | 98 | 87 | 89 |
| Performance (carta) | 98 | 84 | 92 |
| JavaScript | ~150 KB | 254 KB | 204 KB |

La home sigue siendo la página más pesada porque es la que más cosas anima. Si en algún
momento pesa más el número que el efecto, lo que más recupera es sacar el parallax del
hero y las marquesinas.

## Lo que falta antes de mostrarla

- [ ] **Verificar las 10 direcciones en Google Maps.** Las coordenadas salen de cruzar la
      geometría de OpenStreetMap y son exactas a nivel esquina, pero no saben en qué ochava
      está cada local.
- [ ] **Confirmar el precio del tostado/carlitos.** El PDF dice $13.000, que es el precio
      más alto de la carta y queda raro frente a un tostado de miga a $5.400.
- [ ] **Confirmar "Acelga y queso, brócoli"** (`menu.ts`): no se sabe si es un sabor o dos.
- [ ] **Probarla en tu celular con datos móviles**, no en el emulador del navegador.
- [ ] Fotos reales. Es lo que más la mejora, y es lo primero que hay que pedir al cerrar.

## Dos cosas rotas en el Linktree actual

Son verificables tocando los botones desde un celular y están anotadas en
`erroresDetectados` dentro de `src/data/sucursales.ts`:

1. **Mendoza y Entre Ríos** apunta a `wa.me/+5403413432595`. Ese `0` después del código de
   país invalida el número, así que el botón no abre el chat. En la demo va corregido.
2. **Brown y Dorrego** usa `?tex=` en lugar de `?text=`, así que es el único local que
   recibe los mensajes sin el texto prellenado.

## Deploy

**En vivo: https://ynny-omega.vercel.app**

El proyecto `ynny` de Vercel está conectado a este repositorio, así que **cada push a
`main` redeploya solo**. No hace falta correr nada a mano.

Hay un segundo proyecto, `ynny-demo` (https://ynny-demo.vercel.app), creado desde la CLI
antes de darnos cuenta de que el primero ya existía. Está de más y conviene borrarlo desde
el panel de Vercel para no terminar mostrando una versión vieja por error.

Antes de pasar a producción de verdad, en `src/lib/sitio.ts`: poner el dominio definitivo
en `url` y `esDemo` en `false`. **El dominio y el hosting los paga y los registra el
cliente, a su nombre** — que se les venciera `ynny.com.ar` es justamente el problema que
vinimos a resolver.

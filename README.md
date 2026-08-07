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
| `/` | Home: propuesta, destacados con precio, mapa de sucursales |
| `/carta` | 72 productos en 8 categorías, con buscador y navegación por categoría |
| `/sucursales` | Las 10, con "cuál me queda más cerca" y WhatsApp por local |

Los datos viven en dos archivos y son lo único que se toca para replicar esto en otro
negocio: `src/data/menu.ts` y `src/data/sucursales.ts`.

## Medido, no estimado

Con `npm run build` + Lighthouse mobile sobre el build de producción:

| | Home | Carta | Sucursales |
|---|---|---|---|
| Performance | 98 | 98 | 98 |
| Accesibilidad | 100 | 100 | 100 |
| Buenas prácticas | 100 | 100 | 100 |
| SEO | 100\* | 100\* | 100\* |

\* Da 63 mientras `esDemo` esté en `true`, porque la demo se excluye a propósito de los
buscadores. Con `esDemo: false` da 100 y sin fallas.

**Peso total de la página: ~222 KB comprimidos**, contra los **4,26 MB** del PDF actual
de la carta. Unas 19 veces más liviana, y con el texto legible por Google.

## Lo que falta antes de mostrarla

- [ ] **Verificar las 10 direcciones en Google Maps.** Las coordenadas salen de cruzar la
      geometría de OpenStreetMap y son exactas a nivel esquina, pero no saben en qué ochava
      está cada local.
- [ ] **Confirmar el precio del tostado/carlitos.** El PDF dice $13.000, que es el precio
      más alto de la carta y queda raro frente a un tostado de miga a $5.400.
- [ ] **Confirmar "Acelga y queso, brócoli"** (`menu.ts`): no se sabe si es un sabor o dos.
- [ ] **Probarla en tu celular con datos móviles**, no en el emulador del navegador.
- [ ] Fotos. Hoy el diseño se sostiene con tipografía a propósito, pero con fotos reales
      de sus productos mejora bastante. Cuando cierres, pediles los originales.

## Dos cosas rotas en el Linktree actual

Son verificables tocando los botones desde un celular y están anotadas en
`erroresDetectados` dentro de `src/data/sucursales.ts`:

1. **Mendoza y Entre Ríos** apunta a `wa.me/+5403413432595`. Ese `0` después del código de
   país invalida el número, así que el botón no abre el chat. En la demo va corregido.
2. **Brown y Dorrego** usa `?tex=` en lugar de `?text=`, así que es el único local que
   recibe los mensajes sin el texto prellenado.

## Deploy

```bash
npx vercel        # primera vez
npx vercel --prod
```

Antes de pasar a producción, en `src/lib/sitio.ts`: poner el dominio real en `url` y
`esDemo` en `false`. **El dominio y el hosting los paga y los registra el cliente, a su
nombre** — que se les venciera `ynny.com.ar` es justamente el problema que vinimos a
resolver.

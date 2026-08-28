# Conectar Supabase · paso a paso

Todo esto se hace **una sola vez** y tarda unos 20 minutos. Hasta que lo hagas, la web
pública funciona igual: muestra la carta de respaldo que está en el código, y `/admin`
te avisa que falta configurar.

Supabase es la base de datos y el sistema de cuentas. Es gratis en el plan que necesitamos.

---

## 1. Crear el proyecto

1. Entrá a **https://supabase.com** y apretá **Start your project**. Podés entrar con GitHub.
2. Apretá **New project**.
3. Completá:
   - **Name**: `ynny`
   - **Database Password**: apretá **Generate a password** y **guardala en algún lado**.
     No la vas a necesitar para esto, pero si la perdés no se recupera.
   - **Region**: elegí **South America (São Paulo)**. Es la más cerca de Rosario.
   - **Plan**: Free.
4. **Create new project** y esperá dos o tres minutos a que termine de armarse.

---

## 2. Crear las tablas y cargar la carta

1. En el menú de la izquierda, **SQL Editor** (el ícono `>_`).
2. Apretá **New query**.
3. Abrí el archivo `supabase/00-instalar-todo.sql` de este proyecto, copiá **todo**
   (`Ctrl` + `A`, `Ctrl` + `C`) y pegalo en el editor.
4. Apretá **Run** (o `Ctrl` + `Enter`).
5. Tiene que decir **Success**. Si dice error, mandámelo.

Eso crea las tablas, las reglas de seguridad, la carpeta de las fotos y carga los 72
productos, 8 categorías y 18 subtítulos que ya están en la web, con sus precios reales.

Para confirmar: menú **Table Editor** → tabla **productos**. Tienen que aparecer 72 filas.

> Se puede correr dos veces sin miedo: las tablas se crean solo si no existen, y la carta
> no se toca si ya tiene datos. Nunca va a pisar el trabajo de nadie.

*(Los archivos `01-esquema.sql` y `02-semilla.sql` son las dos mitades de ese mismo
archivo, por si alguna vez querés correr una sola.)*

---

## 3. Crear la cuenta para entrar al panel

1. Menú **Authentication** → **Users**.
2. Botón **Add user** → **Create new user**.
3. Poné:
   - **Email**: el mail con el que vas a entrar (puede ser el tuyo para probar).
   - **Password**: la contraseña que quieras. Anotala.
   - Tildá **Auto Confirm User**. Sin esto, la cuenta queda esperando un mail de
     confirmación y no puede entrar.
4. **Create user**.

### Darle permiso de editar

Tener cuenta no alcanza: hay que estar en la lista de administradores. Esto es a propósito.

1. **SQL Editor** → **New query**.
2. Pegá el contenido de `supabase/03-darme-permiso.sql`, **cambiando** `CAMBIAR-POR-TU-MAIL`
   por el mail del paso anterior.
3. **Run**. Abajo tiene que aparecer una fila con ese mail. Si aparece vacío, el mail no
   coincide con ninguna cuenta.

### Cerrar el registro público

Por defecto, cualquiera que sepa la dirección del proyecto puede crearse una cuenta. No las
dejaría abiertas.

1. Menú **Authentication** → **Sign In / Providers** (o **Providers**).
2. En **Email**, desactivá **Allow new users to sign up**.
3. **Save**.

Aunque quedara abierto no podrían editar nada —para eso hay que estar en `administradores`—
pero no hay razón para permitir cuentas que no usa nadie.

---

## 4. Copiar las dos claves

1. Menú **Project Settings** (el engranaje, abajo a la izquierda) → **API Keys**
   (en algunos proyectos figura como **API**).
2. Vas a ver dos cosas que necesitás:

| En Supabase dice | Ejemplo | Va en |
|---|---|---|
| **Project URL** | `https://abcdefgh.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon** / **public** / **publishable** | `eyJhbGciOi...` (largo) o `sb_publishable_...` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

> **Importante:** en esa misma pantalla hay una clave que dice **`service_role`** o
> **`secret`**, con un cartel de advertencia. **Esa no la uses nunca y no me la pases.**
> Saltea todas las reglas de seguridad. Este proyecto no la necesita en ningún lado.
>
> La `anon` sí es pública: viaja al navegador de cualquier visitante y está bien que así
> sea. No da permiso de escribir: lo único que decide quién escribe son las reglas que
> cargaste en el paso 2.

---

## 5. Pegar las claves · en tu computadora

En la carpeta del proyecto, creá un archivo llamado **`.env.local`** (así, con el punto
adelante) con estas dos líneas:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Hay un modelo listo en `.env.example`: copialo y completalo.

Después:

```bash
npm run dev
```

Y entrá a http://localhost:3000/admin

> `.env.local` está en `.gitignore`, así que no se sube a GitHub. Está bien así: las
> variables de producción se cargan en Vercel, no en el código.

---

## 6. Pegar las claves · en Vercel

1. Entrá a **https://vercel.com** y abrí el proyecto **ynny**.
2. **Settings** (arriba) → **Environment Variables** (menú de la izquierda).
3. Agregá la primera:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: la Project URL
   - **Environments**: dejá tildados los tres (Production, Preview, Development)
   - **Save**
4. Repetí con:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: la clave anon
5. **Muy importante:** Vercel no aplica las variables a lo que ya está publicado. Andá a
   **Deployments**, buscá el último, apretá los tres puntos **⋯** → **Redeploy**.

Cuando termine, `https://ynny-omega.vercel.app/admin` va a pedirte el mail y la contraseña
del paso 3.

---

## 7. Comprobar que todo quedó bien

Con `.env.local` cargado, en la carpeta del proyecto:

```bash
npm run verificar-carta
```

Compara los 72 productos y sus precios contra la base y te dice si hay alguna diferencia.
Tiene que decir **"Sin diferencias"**.

Después probá esto a mano:

1. Entrá a `/admin` **sin haber iniciado sesión**: te tiene que mandar al login.
2. Entrá con la cuenta del paso 3.
3. Cambiale el precio a un producto y guardá.
4. Abrí `/carta` en otra pestaña: el precio nuevo tiene que estar ahí, sin hacer nada más.

---

## Preguntas que van a aparecer

**¿Cuánto sale?**
Cero, en el uso que le vamos a dar. El plan Free de Supabase incluye 500 MB de base
(la carta entera pesa menos de 1 MB), 1 GB de fotos y 50.000 usuarios activos por mes;
acá va a haber uno. Lo único que hay que mirar: **un proyecto Free se pausa solo si nadie
lo usa por una semana**. Entrar al panel o que alguien abra la web lo despierta, pero si
YNNY no toca nada por meses conviene pasar al plan pago (25 USD/mes) o entrar cada tanto.

**¿Y si Supabase se cae?**
La web sigue funcionando. Las páginas están guardadas en el CDN de Vercel y, si hubiera que
volver a generarlas y Supabase no contesta, se usa la carta de respaldo del código. Lo peor
que puede pasar es que se vean precios viejos, nunca un error.

**¿Puedo sumar otra persona que edite?**
Sí: creá el usuario en Authentication (paso 3) y agregalo a `administradores` corriendo otra vez
`03-darme-permiso.sql` con su mail. Nada más.

**Perdí la contraseña del panel.**
Authentication → Users → los tres puntos del usuario → **Send password recovery** o
**Reset password**.

**¿Qué pasa si borro un producto sin querer?**
Si usaste **Eliminar**, se fue. Por eso el panel avisa dos veces y ofrece la alternativa:
destildar **"Visible en la web"** lo saca de la web pero lo deja guardado para recuperarlo
cuando quieras.

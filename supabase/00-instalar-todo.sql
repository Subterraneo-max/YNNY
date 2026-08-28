-- =============================================================================
--  YNNY · Instalar todo de una vez
--
--  Es 01-esquema.sql + 02-semilla.sql pegados uno atrás del otro, para que
--  tengas que copiar y pegar una sola vez en el SQL Editor de Supabase.
--
--  Se puede correr dos veces sin romper nada: las tablas se crean solo si no
--  existen, y la semilla no hace nada si la carta ya tiene datos.
--
--  Después de este archivo va 03-darme-permiso.sql.
-- =============================================================================


-- =============================================================================
--  YNNY · Esquema de la carta
--  Pegar TODO este archivo en Supabase → SQL Editor → New query → Run.
--  Es idempotente: se puede volver a correr sin romper nada.
-- =============================================================================

-- -----------------------------------------------------------------------------
--  1. Quién puede administrar
--
--  No alcanza con "estar logueado": si alguien se registra en el proyecto queda
--  autenticado y podría escribir. Solo los usuarios listados acá pueden tocar la
--  carta. Al principio va a haber una sola fila: la cuenta de YNNY.
-- -----------------------------------------------------------------------------
create table if not exists public.administradores (
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  email      text,
  creado_en  timestamptz not null default now()
);

comment on table public.administradores is
  'Usuarios habilitados a editar la carta. Estar autenticado no alcanza: hay que estar aca.';

-- Función auxiliar. `security definer` para que pueda leer la tabla sin que las
-- políticas se llamen a sí mismas en círculo.
create or replace function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = public
as $funcion$
  select exists (
    select 1 from public.administradores where usuario_id = auth.uid()
  );
$funcion$;

-- -----------------------------------------------------------------------------
--  2. Tablas de la carta
-- -----------------------------------------------------------------------------

create table if not exists public.categorias (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  nombre         text not null,
  orden          integer not null default 0,
  -- Precio común a toda la categoría, cuando la carta la presenta así
  -- (los almuerzos, por ejemplo). En pesos enteros.
  precio_unico   integer,
  nota           text,
  foto_url       text,
  activa         boolean not null default true,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  constraint categorias_slug_valido check (slug ~ '^[a-z0-9-]+$'),
  constraint categorias_precio_unico_positivo check (precio_unico is null or precio_unico >= 0)
);

-- Subtítulo dentro de una categoría ("Bagel", "Árabe", "Sándwich de milanesa").
-- `nombre` puede ser null: la mayoría de las categorías tiene un solo grupo sin título.
create table if not exists public.grupos (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias (id) on delete cascade,
  nombre       text,
  orden        integer not null default 0,
  creado_en    timestamptz not null default now()
);

create table if not exists public.productos (
  id             uuid primary key default gen_random_uuid(),
  categoria_id   uuid not null references public.categorias (id) on delete cascade,
  grupo_id       uuid references public.grupos (id) on delete set null,
  nombre         text not null,
  descripcion    text,
  -- En pesos enteros. Null = "Consultar" (la carta original no lo aclara).
  precio         integer,
  -- Se muestra en la web pero marcado como agotado.
  disponible     boolean not null default true,
  -- Aparece en "Los favoritos de YNNY" en la home.
  destacado      boolean not null default false,
  -- En false desaparece de la web. Es el "eliminar" blando: no se pierde el dato.
  activo         boolean not null default true,
  orden          integer not null default 0,
  foto_url       text,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  constraint productos_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint productos_precio_positivo check (precio is null or precio >= 0)
);

create index if not exists productos_categoria_idx on public.productos (categoria_id, orden);
create index if not exists productos_destacado_idx on public.productos (destacado) where destacado;
create index if not exists grupos_categoria_idx on public.grupos (categoria_id, orden);

-- `actualizado_en` se mantiene solo, para no depender de que la app se acuerde.
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
as $funcion$
begin
  new.actualizado_en = now();
  return new;
end;
$funcion$;

drop trigger if exists categorias_actualizado_en on public.categorias;
create trigger categorias_actualizado_en
  before update on public.categorias
  for each row execute function public.tocar_actualizado_en();

drop trigger if exists productos_actualizado_en on public.productos;
create trigger productos_actualizado_en
  before update on public.productos
  for each row execute function public.tocar_actualizado_en();

-- -----------------------------------------------------------------------------
--  3. RLS · Row Level Security
--
--  Esta es la seguridad de verdad. Aunque alguien consiga la clave pública
--  (que viaja al navegador y no es secreta), sin sesión de administrador no
--  puede escribir una sola fila.
--
--  Lectura: pública, pero solo de lo que está activo. Lo desactivado no se le
--  filtra a nadie que no sea administrador.
--  Escritura: solo administradores.
-- -----------------------------------------------------------------------------

alter table public.categorias      enable row level security;
alter table public.grupos          enable row level security;
alter table public.productos       enable row level security;
alter table public.administradores enable row level security;

-- --- categorias ---
drop policy if exists "categorias lectura publica" on public.categorias;
create policy "categorias lectura publica" on public.categorias
  for select using (activa or public.es_administrador());

drop policy if exists "categorias escritura admin" on public.categorias;
create policy "categorias escritura admin" on public.categorias
  for all using (public.es_administrador()) with check (public.es_administrador());

-- --- grupos ---
drop policy if exists "grupos lectura publica" on public.grupos;
create policy "grupos lectura publica" on public.grupos
  for select using (true);

drop policy if exists "grupos escritura admin" on public.grupos;
create policy "grupos escritura admin" on public.grupos
  for all using (public.es_administrador()) with check (public.es_administrador());

-- --- productos ---
drop policy if exists "productos lectura publica" on public.productos;
create policy "productos lectura publica" on public.productos
  for select using (activo or public.es_administrador());

drop policy if exists "productos escritura admin" on public.productos;
create policy "productos escritura admin" on public.productos
  for all using (public.es_administrador()) with check (public.es_administrador());

-- --- administradores ---
-- Cada quien ve su propia fila y nadie puede darse de alta a sí mismo desde la
-- app: sumar un administrador se hace a mano desde el panel de Supabase.
drop policy if exists "administradores se ven a si mismos" on public.administradores;
create policy "administradores se ven a si mismos" on public.administradores
  for select using (usuario_id = auth.uid());

-- -----------------------------------------------------------------------------
--  4. Fotos · bucket de Storage
--
--  Público para lectura (son fotos de productos que se ven en la web) y solo
--  administradores pueden subir, reemplazar o borrar.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('carta', 'carta', true)
on conflict (id) do update set public = true;

drop policy if exists "carta lectura publica" on storage.objects;
create policy "carta lectura publica" on storage.objects
  for select using (bucket_id = 'carta');

drop policy if exists "carta subida admin" on storage.objects;
create policy "carta subida admin" on storage.objects
  for insert with check (bucket_id = 'carta' and public.es_administrador());

drop policy if exists "carta reemplazo admin" on storage.objects;
create policy "carta reemplazo admin" on storage.objects
  for update using (bucket_id = 'carta' and public.es_administrador());

drop policy if exists "carta borrado admin" on storage.objects;
create policy "carta borrado admin" on storage.objects
  for delete using (bucket_id = 'carta' and public.es_administrador());


-- =============================================================================
--  YNNY · Semilla de la carta
--
--  GENERADO AUTOMÁTICAMENTE desde src/data/menu.ts.
--  No editar a mano: correr `npx tsx scripts/generar-semilla.ts`.
--
--  Pegar en Supabase → SQL Editor → New query → Run, DESPUÉS de 01-esquema.sql.
--
--  Si la tabla `categorias` ya tiene filas, este script no hace nada. Está
--  pensado así a propósito: una vez que YNNY empiece a editar precios desde el
--  panel, volver a correrlo no puede pisarle el trabajo.
-- =============================================================================

do $semilla$
declare
  cat_id uuid;
  grp_id uuid;
begin
  if exists (select 1 from public.categorias) then
    raise notice 'La carta ya tiene datos cargados. No se modificó nada.';
    return;
  end if;

  -- ------------------------------------------------------------------------
  -- Desayunos y meriendas
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('desayunos', 'Desayunos y meriendas', 0, null, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Infusión + 2 facturas', null, 4500, true, 0),
    (cat_id, grp_id, 'Infusión + 2 tostadas queso y mermelada', null, 6000, false, 1),
    (cat_id, grp_id, 'Infusión + 3 chipás', null, 6000, false, 2),
    (cat_id, grp_id, 'Infusión + 2 churros', null, 5200, false, 3),
    (cat_id, grp_id, 'Infusión + tostón huevo y palta', null, 9200, false, 4),
    (cat_id, grp_id, 'Infusión con waffles', null, 8600, false, 5),
    (cat_id, grp_id, 'Infusión + porción de torta + vaso de jugo', null, 8500, true, 6),
    (cat_id, grp_id, 'Infusión + porción de budín + vaso de jugo', null, 8200, false, 7),
    (cat_id, grp_id, 'Infusión + sin TACC', null, 7200, false, 8),
    (cat_id, grp_id, 'Infusión + medialunas jamón y queso', null, 8400, false, 9),
    (cat_id, grp_id, 'Submarino + 2 medialunas', null, 4800, true, 10),
    (cat_id, grp_id, 'Infusión + medio tostado + vaso de jugo', null, 8800, true, 11);

  -- ------------------------------------------------------------------------
  -- Almuerzos
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('almuerzos', 'Almuerzos', 1, 11500, 'Sugerencia del día. Todos incluyen bebida y postre o café.')
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Canelones de carne y verdura con salsa tuco', null, 11500, false, 0),
    (cat_id, grp_id, 'Arroz con pollo', null, 11500, false, 1),
    (cat_id, grp_id, 'Chopsuey de arroz', null, 11500, false, 2),
    (cat_id, grp_id, 'Milanesa o suprema con ensalada o papas', null, 11500, false, 3),
    (cat_id, grp_id, 'Lasagna de carne y verdura', null, 11500, false, 4);

  -- ------------------------------------------------------------------------
  -- Sándwiches
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('sandwiches', 'Sándwiches', 2, null, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Bagel', 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Jamón crudo y queso', null, 8300, false, 0);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Árabe', 1)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Árabe de pollo', 'Ketchup, queso cheddar, tomate y pollo', 7500, false, 0),
    (cat_id, grp_id, 'Árabe primavera', 'Jamón, queso, lechuga, tomate y huevo', 7500, false, 1);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Sándwich de milanesa', 2)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Milanesa', 'Milanesa, jamón cocido, queso, lechuga y tomate', 7000, false, 0);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Sándwich de chipá', 3)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Jamón y queso', null, 7200, false, 0),
    (cat_id, grp_id, 'Jamón crudo y queso', null, 8800, false, 1),
    (cat_id, grp_id, 'Primavera', 'Jamón, queso, lechuga, tomate y huevo', 8200, false, 2);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Sándwich de lomo', 4)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Lomito ahumado', 'Pan brioche, mostaza, huevo, queso, cheddar y lomito ahumado', 7400, false, 0);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Focaccia', 5)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Jamón y queso', null, 7200, false, 0);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Tostado o carlitos', 6)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Jamón y queso', null, 13000, false, 0);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Sándwiches lactales', 7)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Primavera', 'Jamón, queso, lechuga, tomate y huevo', 6800, false, 0),
    (cat_id, grp_id, 'Pollo', 'Rúcula, queso, tomate, huevo y pollo', 6800, false, 1),
    (cat_id, grp_id, 'Palta', 'Queso, lechuga, zanahoria y palta', 7900, false, 2);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Pan de miga', 8)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Miga de jamón y queso', null, 5400, false, 0),
    (cat_id, grp_id, 'Miga de carne', 'Ketchup, jamón, queso, huevo y peceto', 7200, false, 1),
    (cat_id, grp_id, 'Miga de pollo', 'Ketchup, jamón, queso, huevo y pollo', 7200, false, 2),
    (cat_id, grp_id, 'Miga de atún', 'Mayonesa, lechuga, queso y atún', 7200, false, 3),
    (cat_id, grp_id, 'Triple miga vegetariano', 'Pan de miga negro, queso crema con ciboulette, queso barra y huevo', 6700, false, 4),
    (cat_id, grp_id, 'Miga crudo y queso', null, 7200, false, 5),
    (cat_id, grp_id, 'Bandeja triples', 'Mayonesa, lechuga, tomate, huevo, jamón cocido y queso tybo', 9800, false, 6);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Pebetes', 9)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Jamón y queso', null, 5500, false, 0),
    (cat_id, grp_id, 'Salame y queso', null, 5500, false, 1),
    (cat_id, grp_id, 'Primavera', 'Jamón, queso y huevo', 5500, false, 2);

  -- ------------------------------------------------------------------------
  -- Wraps
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('wraps', 'Wraps', 3, 7600, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Carne', 'Peceto, queso, tomate y rúcula', 7600, false, 0),
    (cat_id, grp_id, 'Pollo', 'Pollo, queso, tomate y lechuga', 7600, false, 1),
    (cat_id, grp_id, 'Vegetariano', 'Queso, huevo, zanahoria, tomate y lechuga', 7600, false, 2),
    (cat_id, grp_id, 'Roquefort', 'Queso crema, ciboulette, huevo y roquefort', 7600, false, 3),
    (cat_id, grp_id, 'Carne y cheddar', 'Barbacoa, jamón, queso, huevo, carne y cheddar', 7600, false, 4);

  -- ------------------------------------------------------------------------
  -- Ensaladas
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('ensaladas', 'Ensaladas', 4, null, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'César', 'Pollo, parmesano, croutones y lechuga', 6800, false, 0),
    (cat_id, grp_id, 'Atún', 'Arroz, atún, tomates cherry, queso y olivas negras', 6800, false, 1),
    (cat_id, grp_id, 'Litto', 'Rúcula, parmesano, lentejas, tomates cherry y huevo', 6500, false, 2),
    (cat_id, grp_id, 'Chipre', 'Lentejas, rúcula, choclo, tomates cherry y zanahoria', 6800, false, 3),
    (cat_id, grp_id, 'Ensalada tibia', 'Zanahoria, lentejas, garbanzos, arroz, papa y remolacha', 6800, false, 4);

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, 'Ensaladas VIP', 1)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Crudo', 'Rúcula, queso, aceitunas, tomates cherry y jamón crudo', 7500, false, 0),
    (cat_id, grp_id, 'Kanikama', 'Kanikama, lechuga, queso, zanahoria y salsa golf', 7500, false, 1),
    (cat_id, grp_id, 'Lisboa', 'Choclo, zanahoria, jamón y queso', 7500, false, 2),
    (cat_id, grp_id, 'París', 'Lechuga, repollo morado, tomates cherry, palta y champignones', 7500, false, 3);

  -- ------------------------------------------------------------------------
  -- Tartas
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('tartas', 'Tartas', 5, 5200, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Pollo', null, 5200, false, 0),
    (cat_id, grp_id, 'Pollo y verdura', null, 5200, false, 1),
    (cat_id, grp_id, 'Jamón y queso', null, 5200, false, 2),
    (cat_id, grp_id, 'Calabaza y queso', null, 5200, false, 3),
    (cat_id, grp_id, 'Acelga y queso, brócoli', null, 5200, false, 4),
    (cat_id, grp_id, 'Zapallito', null, 5200, false, 5),
    (cat_id, grp_id, 'Calabaza y verdura', null, 5200, false, 6);

  -- ------------------------------------------------------------------------
  -- Empanadas
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('empanadas', 'Empanadas', 6, 2400, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Jamón y queso', null, 2400, false, 0),
    (cat_id, grp_id, 'Verdura', null, 2400, false, 1),
    (cat_id, grp_id, 'Capresse', null, 2400, false, 2),
    (cat_id, grp_id, 'Carne dulce', null, 2400, false, 3),
    (cat_id, grp_id, 'Carne salada', null, 2400, false, 4),
    (cat_id, grp_id, 'Pollo', null, 2400, false, 5),
    (cat_id, grp_id, 'Soja', null, 2400, false, 6);

  -- ------------------------------------------------------------------------
  -- Pizzas
  -- ------------------------------------------------------------------------
  insert into public.categorias (slug, nombre, orden, precio_unico, nota)
  values ('pizzas', 'Pizzas', 7, null, null)
  returning id into cat_id;

  insert into public.grupos (categoria_id, nombre, orden)
  values (cat_id, null, 0)
  returning id into grp_id;

  insert into public.productos (categoria_id, grupo_id, nombre, descripcion, precio, destacado, orden) values
    (cat_id, grp_id, 'Especial', null, 8700, false, 0),
    (cat_id, grp_id, 'Fugazza', null, 8700, false, 1),
    (cat_id, grp_id, 'Muzzarella', null, 8700, false, 2),
    (cat_id, grp_id, '4 quesos', null, 8800, false, 3);

  raise notice 'Carta cargada: 8 categorías, 18 grupos, 72 productos.';
end
$semilla$;

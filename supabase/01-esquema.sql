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


-- -----------------------------------------------------------------------------
--  5. Permisos de la API
--
--  RLS decide QUÉ FILAS puede ver o tocar cada uno. Esto otro decide si el rol
--  llega siquiera a la tabla. Son dos capas distintas y hacen falta las dos.
--
--  Supabase suele dar estos permisos solo cuando está tildado "Automatically
--  expose new tables" al crear el proyecto. Los escribimos igual para que este
--  archivo funcione con ese cartel tildado o destildado.
--
--  `anon`  = cualquier visitante de la web (solo lee, y solo lo activo).
--  `authenticated` = alguien con sesión iniciada; que además pueda escribir lo
--  siguen decidiendo las políticas de arriba, que exigen estar en
--  `administradores`.
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.categorias, public.grupos, public.productos to anon, authenticated;
grant insert, update, delete on public.categorias, public.grupos, public.productos to authenticated;

grant select on public.administradores to authenticated;

grant execute on function public.es_administrador() to anon, authenticated;

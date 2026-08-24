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

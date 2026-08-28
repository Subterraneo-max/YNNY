-- =============================================================================
--  YNNY · Darle permiso de edición a una cuenta
--
--  Correr DESPUÉS de haber creado el usuario en Authentication → Users.
--
--  Cambiá el mail de abajo por el de la cuenta que creaste y apretá Run.
--  No hace falta copiar ningún código raro: lo busca solo por el mail.
--
--  Para sumar a otra persona más adelante: creá su usuario y volvé a correr
--  esto con su mail.
-- =============================================================================

insert into public.administradores (usuario_id, email)
select id, email
from auth.users
where email = 'CAMBIAR-POR-TU-MAIL'
on conflict (usuario_id) do nothing;

-- Control: tiene que devolver una fila con el mail que pusiste.
-- Si devuelve vacío, el mail no coincide con ninguna cuenta (revisá que esté
-- igual, sin espacios y en minúsculas).
select email, creado_en from public.administradores;

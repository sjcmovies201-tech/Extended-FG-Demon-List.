-- =====================================================================
-- RUN THIS ONCE if you already did setup.sql earlier.
-- (If you are starting fresh, setup.sql already includes all of this.)
-- Supabase: SQL Editor -> New query -> paste ALL of this -> Run.
--
-- It adds a "players" table so admins can add players and give them
-- bonus points (or take points away with a negative number).
-- A player's total = points from their approved records + bonus points.
-- =====================================================================

create table if not exists players (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 60),
  bonus_points numeric not null default 0 check (bonus_points between -100000 and 100000)
);
create unique index if not exists players_name_unique on players (lower(name));

alter table players enable row level security;
grant select on players to anon, authenticated;
drop policy if exists "anyone reads players" on players;
create policy "anyone reads players" on players for select using (true);
-- (No insert/update/delete rules on purpose: only the admin-only
--  functions below are allowed to change this table.)

-- Add a player, edit a player, or rename a player (admins only).
-- p_old = the player's current name (empty/null when adding a new player)
create or replace function save_player(p_old text, p_new text, p_bonus numeric)
returns void language plpgsql security definer set search_path = public as $$
declare
  new_name text := btrim(p_new);
begin
  if not is_admin() then raise exception 'Only admins can do this'; end if;
  if new_name is null or char_length(new_name) < 1 or char_length(new_name) > 60 then
    raise exception 'Name must be 1 to 60 characters';
  end if;

  if p_old is not null and btrim(p_old) <> '' then
    if lower(btrim(p_old)) <> lower(new_name)
       and exists (select 1 from players where lower(name) = lower(new_name)) then
      raise exception 'A player with that name already exists';
    end if;
    update records set player = new_name where lower(btrim(player)) = lower(btrim(p_old));
    update players set name = new_name, bonus_points = p_bonus where lower(name) = lower(btrim(p_old));
    if not found then
      insert into players (name, bonus_points) values (new_name, p_bonus);
    end if;
  else
    if exists (select 1 from players where lower(name) = lower(new_name)) then
      raise exception 'A player with that name already exists';
    end if;
    insert into players (name, bonus_points) values (new_name, p_bonus);
  end if;
end $$;

-- Delete a player AND all of their records (admins only).
create or replace function delete_player(p_name text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'Only admins can do this'; end if;
  delete from records where lower(btrim(player)) = lower(btrim(p_name));
  delete from players where lower(name) = lower(btrim(p_name));
end $$;

revoke execute on function save_player(text, text, numeric) from public, anon;
revoke execute on function delete_player(text) from public, anon;
grant execute on function save_player(text, text, numeric) to authenticated;
grant execute on function delete_player(text) to authenticated;

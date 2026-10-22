-- =====================================================================
-- RUN THIS ONCE in Supabase: left menu -> "SQL Editor" -> New query ->
-- paste ALL of this -> click "Run".
-- It builds the 3 "spreadsheets" (tables) your site stores data in,
-- and sets the SAFETY RULES:
--   * everyone can READ levels and APPROVED records
--   * everyone can SUBMIT a record, but it starts as "pending"
--   * only ADMINS can add/edit/delete levels and approve/reject records
-- =====================================================================

create table if not exists levels (
  id bigint generated always as identity primary key,
  position int not null,
  name text not null check (char_length(name) between 1 and 120),
  creator text not null default '' check (char_length(creator) <= 160),
  verifier text not null default '' check (char_length(verifier) <= 120),
  video text not null default '' check (char_length(video) <= 255),
  game_id text not null default '' check (char_length(game_id) <= 32),
  requirement int not null default 100 check (requirement between 1 and 100)
);

create table if not exists records (
  id bigint generated always as identity primary key,
  level_id bigint not null references levels(id) on delete cascade,
  player text not null check (char_length(player) between 1 and 60),
  progress int not null check (progress between 1 and 100),
  video text not null default '' check (char_length(video) <= 255),
  note text not null default '' check (char_length(note) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- The list of accounts that are allowed to be admins.
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Turn the safety system ON.
alter table levels  enable row level security;
alter table records enable row level security;
alter table admins  enable row level security;   -- no rules = nobody can touch it from the website

-- A tiny helper: "is the person using the site an admin?"
create or replace function is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;
grant execute on function is_admin() to anon, authenticated;

-- Permissions (what each kind of visitor may try to do)
grant select on levels, records to anon, authenticated;
grant insert on records to anon, authenticated;
grant insert, update, delete on levels to authenticated;
grant update, delete on records to authenticated;

-- Safety rules
drop policy if exists "anyone reads levels" on levels;
create policy "anyone reads levels" on levels for select using (true);
drop policy if exists "admins add levels" on levels;
create policy "admins add levels" on levels for insert to authenticated with check (is_admin());
drop policy if exists "admins edit levels" on levels;
create policy "admins edit levels" on levels for update to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "admins delete levels" on levels;
create policy "admins delete levels" on levels for delete to authenticated using (is_admin());

drop policy if exists "read approved records" on records;
create policy "read approved records" on records for select using (status = 'approved' or is_admin());
drop policy if exists "anyone submits pending" on records;
create policy "anyone submits pending" on records for insert with check (status = 'pending');
drop policy if exists "admins edit records" on records;
create policy "admins edit records" on records for update to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "admins delete records" on records;
create policy "admins delete records" on records for delete to authenticated using (is_admin());

-- =====================================================================
-- Adds example PLAYERS you can edit in the Admin tab.
-- Run it ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- (Needs the players table: run upgrade-players.sql first if you haven't.)
-- Safe to run twice: it skips names that already exist.
-- =====================================================================

insert into players (name, bonus_points) values
  ('Player A', 0),
  ('Player B', 0),
  ('Player C', 0),
  ('Player D', 0),
  ('Player E', 0),
  ('Example Player', 100)   -- has no records, just 100 points, to show you how it works
on conflict ((lower(name))) do nothing;

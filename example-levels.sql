-- =====================================================================
-- OPTIONAL: fills your database with 10 EXAMPLE levels and a few
-- example records, so you have something to play with in the Admin tab.
-- Run it ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- (It does nothing if you already have levels, so it can't make a mess.)
-- Then log into the Admin tab and rename, move, or delete them.
-- =====================================================================

do $$
begin
  if exists (select 1 from levels) then
    raise notice 'You already have levels, so no examples were added.';
    return;
  end if;

  insert into levels (position, name, creator, verifier, video, game_id, requirement) values
    (1,  'Example Level One',   'Builder A', 'Player A', '', '', 100),
    (2,  'Example Level Two',   'Builder B', 'Player B', '', '', 100),
    (3,  'Example Level Three', 'Builder C', 'Player C', '', '', 100),
    (4,  'Example Level Four',  'Builder D', 'Player A', '', '', 100),
    (5,  'Example Level Five',  'Builder E', 'Player B', '', '', 100),
    (6,  'Example Level Six',   'Builder F', 'Player D', '', '', 100),
    (7,  'Example Level Seven', 'Builder A', 'Player C', '', '', 100),
    (8,  'Example Level Eight', 'Builder G', 'Player D', '', '', 100),
    (9,  'Example Level Nine',  'Builder H', 'Player A', '', '', 100),
    (10, 'Example Level Ten',   'Builder I', 'Player B', '', '', 100);

  insert into records (level_id, player, progress, video, status)
  select l.id, v.player, v.progress, '', v.status
  from (values
    ('Player A', 'Example Level One',   100, 'approved'),
    ('Player A', 'Example Level Three', 100, 'approved'),
    ('Player A', 'Example Level Nine',  100, 'approved'),
    ('Player B', 'Example Level Two',   100, 'approved'),
    ('Player B', 'Example Level Five',  100, 'approved'),
    ('Player C', 'Example Level Three', 100, 'approved'),
    ('Player C', 'Example Level Seven', 100, 'approved'),
    ('Player D', 'Example Level Six',   100, 'approved'),
    -- this one is "pending" so you can practice approving it in the Admin tab:
    ('Player E', 'Example Level Four',  100, 'pending')
  ) as v(player, level_name, progress, status)
  join levels l on l.name = v.level_name;
end $$;

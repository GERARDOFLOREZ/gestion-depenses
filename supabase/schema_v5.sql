-- « Au plus tard » : dépenses prévues et récurrences avec date limite
-- À exécuter une fois dans Supabase > SQL Editor. Sans danger si déjà exécuté.
alter table expenses  add column if not exists date_mode text not null default 'exact'
  check (date_mode in ('exact', 'deadline'));
alter table recurring add column if not exists date_mode text not null default 'exact'
  check (date_mode in ('exact', 'deadline'));

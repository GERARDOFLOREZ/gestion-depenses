-- Dépenses prévues + montants en fourchette
-- À exécuter une fois dans Supabase > SQL Editor. Sans danger si déjà exécuté.
alter table expenses add column if not exists status text not null default 'done'
  check (status in ('done', 'planned'));
alter table expenses add column if not exists amount_min numeric check (amount_min > 0);
alter table expenses add column if not exists amount_max numeric check (amount_max > 0);
alter table incomes  add column if not exists amount_min numeric check (amount_min > 0);
alter table incomes  add column if not exists amount_max numeric check (amount_max > 0);

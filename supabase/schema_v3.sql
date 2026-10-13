-- Récurrences à intervalle libre (tous les N jours / semaines / mois / ans)
-- À exécuter une fois dans Supabase > SQL Editor. Sans danger si déjà exécuté.
alter table recurring add column if not exists interval_count int not null default 1 check (interval_count >= 1);
alter table recurring add column if not exists interval_unit text not null default 'month'
  check (interval_unit in ('day', 'week', 'month', 'year'));
alter table recurring add column if not exists last_generated_date date;

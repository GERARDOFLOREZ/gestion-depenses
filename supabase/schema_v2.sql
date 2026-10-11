-- =====================================================================
-- Gestion des finances — mise à jour v2
-- À exécuter UNE FOIS dans Supabase > SQL Editor > New query > Run
-- Sans danger pour vos données existantes (aucune suppression).
-- =====================================================================

-- 1) Comptes (chaque compte a sa propre devise)
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'courant',
  currency text not null default 'EUR',
  initial_balance numeric not null default 0,
  created_at timestamptz not null default now()
);

-- 2) Lien dépenses / revenus -> compte (nullable pour l'historique)
alter table expenses add column if not exists account_id uuid references accounts(id) on delete set null;
alter table incomes  add column if not exists account_id uuid references accounts(id) on delete set null;

-- 3) Virements entre comptes (to_amount = montant reçu, utile si devises différentes)
create table if not exists transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  from_account_id uuid not null references accounts(id) on delete cascade,
  to_account_id uuid not null references accounts(id) on delete cascade,
  amount numeric not null check (amount > 0),
  to_amount numeric not null check (to_amount > 0),
  date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

-- 4) Objectifs d'épargne
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric not null check (target_amount > 0),
  saved_amount numeric not null default 0,
  currency text not null default 'EUR',
  deadline date,
  created_at timestamptz not null default now()
);

-- 5) Transactions récurrentes
create table if not exists recurring (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('expense', 'income')),
  label text not null,
  amount numeric not null check (amount > 0),
  category text not null,
  account_id uuid references accounts(id) on delete set null,
  day_of_month int not null check (day_of_month between 1 and 31),
  start_date date not null default current_date,
  last_generated_month text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6) Catégories personnalisées
create table if not exists custom_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('expense', 'income')),
  label text not null,
  color text not null default '#2e7d32',
  created_at timestamptz not null default now()
);

-- 7) Dettes et prêts
create table if not exists debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person text not null,
  direction text not null check (direction in ('owed_to_me', 'i_owe')),
  amount numeric not null check (amount > 0),
  paid_amount numeric not null default 0,
  currency text not null default 'EUR',
  due_date date,
  note text,
  created_at timestamptz not null default now()
);

-- 8) Sécurité : chaque utilisateur ne voit que SES données (RLS)
do $$
declare t text;
begin
  foreach t in array array['accounts','transfers','goals','recurring','custom_categories','debts'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_select', t);
    execute format('drop policy if exists %I on %I', t || '_insert', t);
    execute format('drop policy if exists %I on %I', t || '_update', t);
    execute format('drop policy if exists %I on %I', t || '_delete', t);
    execute format('create policy %I on %I for select using (auth.uid() = user_id)', t || '_select', t);
    execute format('create policy %I on %I for insert with check (auth.uid() = user_id)', t || '_insert', t);
    execute format('create policy %I on %I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t || '_update', t);
    execute format('create policy %I on %I for delete using (auth.uid() = user_id)', t || '_delete', t);
  end loop;
end $$;

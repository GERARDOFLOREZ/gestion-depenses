-- v6 : règlements de dettes / prêts (le compte qui paie ou qui reçoit l'argent)
create table if not exists debt_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  debt_id uuid not null references debts(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  direction text not null check (direction in ('owed_to_me', 'i_owe')),
  amount numeric not null check (amount > 0),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table debt_payments enable row level security;
drop policy if exists debt_payments_select on debt_payments;
drop policy if exists debt_payments_insert on debt_payments;
drop policy if exists debt_payments_update on debt_payments;
drop policy if exists debt_payments_delete on debt_payments;
create policy debt_payments_select on debt_payments for select using (auth.uid() = user_id);
create policy debt_payments_insert on debt_payments for insert with check (auth.uid() = user_id);
create policy debt_payments_update on debt_payments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy debt_payments_delete on debt_payments for delete using (auth.uid() = user_id);

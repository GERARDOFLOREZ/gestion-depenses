-- v7 : espaces (ex. « Mon espace perso » et « CESAM ») sous un même login.
-- Chaque ligne appartient à un espace (space_id). Cette migration a déjà été
-- appliquée sur le projet Supabase ; ce fichier sert de trace dans le dépôt.

-- ===== 1. Table des espaces =====
create table if not exists spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text not null default 'custom' check (kind in ('perso', 'custom')),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);
create index if not exists idx_spaces_user_id on spaces (user_id);
-- un seul espace perso par utilisateur
create unique index if not exists uniq_spaces_one_perso_per_user on spaces (user_id) where kind = 'perso';

alter table spaces enable row level security;
create policy spaces_select on spaces for select using ((select auth.uid()) = user_id);
create policy spaces_insert on spaces for insert with check ((select auth.uid()) = user_id);
create policy spaces_update on spaces for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy spaces_delete on spaces for delete using ((select auth.uid()) = user_id and kind <> 'perso');

-- ===== 2. Un espace perso pour chaque utilisateur existant =====
insert into spaces (user_id, name, kind)
select u.id, 'Mon espace perso', 'perso'
from auth.users u
where not exists (select 1 from spaces s where s.user_id = u.id and s.kind = 'perso');

-- ===== 3. space_id sur toutes les tables de données =====
-- (accounts, expenses, incomes, transfers, budgets, goals, recurring,
--  custom_categories, debts, debt_payments) :
--   - colonne space_id rattachée à l'espace perso de l'utilisateur pour l'existant
--   - valeur par défaut = espace perso (public.default_space_id())
--   - NOT NULL, index (space_id, user_id) (couvre aussi la clé étrangère composite)
--   - clé étrangère composite (space_id, user_id) -> spaces (id, user_id) :
--     une ligne ne peut appartenir qu'à un espace de son propriétaire

-- ===== 4. Budgets : un budget par catégorie ET par espace =====
alter table budgets add constraint budgets_space_id_category_key unique (space_id, category);

-- L'ancienne règle (user_id, category) a été supprimée après le déploiement du code
-- qui utilise onConflict 'space_id,category' :
alter table budgets drop constraint if exists budgets_user_id_category_key;

-- ===== 5. Nouveaux utilisateurs : espace perso créé automatiquement =====
-- (trigger on_auth_user_created_space -> public.handle_new_user_space())

import { useContext, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ExpenseContext } from '../context/ExpenseContext';
import { IncomeContext } from '../context/IncomeContext';
import { useAuth } from './useAuth';
import { useExtras } from './useExtras';
import { useCurrency } from './useCurrency';
import { getTodayISO, shiftMonth } from '../utils/formatters';

const pad = (n) => String(n).padStart(2, '0');

/** Dates (<= aujourd'hui) pas encore générées pour une transaction récurrente. */
export function pendingDates(rec, today) {
  const startMonth = rec.last_generated_month
    ? shiftMonth(rec.last_generated_month, 1)
    : rec.start_date.slice(0, 7);
  let [y, m] = startMonth.split('-').map(Number);
  const out = [];
  for (let i = 0; i < 240; i += 1) {
    const daysInMonth = new Date(y, m, 0).getDate();
    const day = Math.min(rec.day_of_month, daysInMonth);
    const date = `${y}-${pad(m)}-${pad(day)}`;
    if (date > today) break;
    if (date >= rec.start_date) out.push(date);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

/**
 * Tâches automatiques exécutées une fois connecté :
 *  1) crée un « Compte principal » si l'utilisateur n'a encore aucun compte
 *     et y rattache l'historique existant ;
 *  2) génère les dépenses / revenus récurrents arrivés à échéance.
 */
export function useAutomation() {
  const { user } = useAuth();
  const { accounts, recurring } = useExtras();
  const expenseCtx = useContext(ExpenseContext);
  const incomeCtx = useContext(IncomeContext);
  const { currencyCode } = useCurrency();
  const bootstrapped = useRef(false);
  const processing = useRef(new Set());

  const ready =
    user && !accounts.loading && !expenseCtx.loading && !incomeCtx.loading;

  // 1) compte par défaut
  useEffect(() => {
    if (!ready || accounts.error || accounts.rows.length > 0 || bootstrapped.current) return;
    bootstrapped.current = true;
    (async () => {
      // Garde-fou (autre appareil, chargement lent) : ne jamais créer de doublon.
      const { data: existing } = await supabase.from('accounts').select('id').limit(1);
      if (existing && existing.length > 0) {
        accounts.refetch();
        return;
      }
      const { data, error } = await accounts.add({
        name: 'Compte principal',
        type: 'courant',
        currency: currencyCode,
        initial_balance: 0,
      });
      if (error || !data) return;
      await supabase.from('expenses').update({ account_id: data.id }).is('account_id', null);
      await supabase.from('incomes').update({ account_id: data.id }).is('account_id', null);
      expenseCtx.refetch();
      incomeCtx.refetch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, accounts.error, accounts.rows.length]);

  // 2) récurrences
  useEffect(() => {
    if (!ready || recurring.loading || recurring.error) return;
    const today = getTodayISO();

    recurring.rows
      .filter((r) => r.active)
      .forEach(async (rec) => {
        if (processing.current.has(rec.id)) return;
        const dates = pendingDates(rec, today);
        if (dates.length === 0) return;

        processing.current.add(rec.id);
        const lastMonth = dates[dates.length - 1].slice(0, 7);
        const { error } = await recurring.update(rec.id, { last_generated_month: lastMonth });
        if (!error) {
          for (const date of dates) {
            const payload = {
              label: rec.label,
              amount: Number(rec.amount),
              category: rec.category,
              date,
              ...(rec.account_id ? { account_id: rec.account_id } : {}),
            };
            if (rec.type === 'income') await incomeCtx.addIncome(payload);
            else await expenseCtx.addExpense(payload);
          }
        }
        processing.current.delete(rec.id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, recurring.rows, recurring.loading, recurring.error]);
}

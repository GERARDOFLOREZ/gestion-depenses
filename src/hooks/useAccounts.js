import { useCallback, useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { IncomeContext } from '../context/IncomeContext';
import { useExtras } from './useExtras';
import { useCurrency } from './useCurrency';
import { getCurrencyByCode } from '../data/currencies';
import { t } from '../i18n';
import { useLanguage } from './useLanguage';

export const ACCOUNT_TYPES = [
  { id: 'courant', label: 'Banque', icon: '🏦' },
  { id: 'especes', label: 'Espèces', icon: '💵' },
  { id: 'mobile', label: 'Mobile money', icon: '📱' },
  { id: 'epargne', label: 'Épargne', icon: '🐖' },
];

export const getAccountType = (id) => {
  const type = ACCOUNT_TYPES.find((x) => x.id === id) || ACCOUNT_TYPES[0];
  return { ...type, label: t(type.label) };
};

export function useAccounts() {
  const { accounts, transfers, debtPayments } = useExtras();
  const expenseCtx = useContext(ExpenseContext);
  const incomeCtx = useContext(IncomeContext);
  const { currencyCode } = useCurrency();
  const { locale } = useLanguage();

  // Le compte créé automatiquement est stocké en français : on l'affiche dans la langue choisie.
  const rows = useMemo(
    () => accounts.rows.map((a) => (a.name === 'Compte principal' ? { ...a, name: t(a.name) } : a)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accounts.rows, locale]
  );

  const getAccount = (id) => rows.find((a) => a.id === id);
  const getAccountCurrency = (id) => getCurrencyByCode(getAccount(id)?.currency || currencyCode);

  // Solde de chaque compte, en ne comptant que les opérations datées avant `before` (AAAA-MM-JJ, exclu).
  // Sans `before` : tout l'historique.
  const balanceAt = useCallback((before) => {
    const ok = (d) => !before || d < before;
    const result = {};
    accounts.rows.forEach((a) => {
      result[a.id] = Number(a.initial_balance) || 0;
    });
    (incomeCtx?.incomes || []).forEach((i) => {
      if (i.account_id in result && ok(i.date)) result[i.account_id] += Number(i.amount);
    });
    (expenseCtx?.expenses || []).forEach((e) => {
      if (e.account_id in result && ok(e.date)) result[e.account_id] -= Number(e.amount);
    });
    transfers.rows.forEach((t) => {
      if (!ok(t.date)) return;
      if (t.from_account_id in result) result[t.from_account_id] -= Number(t.amount);
      if (t.to_account_id in result) result[t.to_account_id] += Number(t.to_amount);
    });
    // Règlement de dette : je paie (argent sort) ou on me paie (argent entre)
    debtPayments.rows.forEach((p) => {
      if (!(p.account_id in result) || !ok(p.date)) return;
      result[p.account_id] += p.direction === 'owed_to_me' ? Number(p.amount) : -Number(p.amount);
    });
    return result;
  }, [accounts.rows, transfers.rows, debtPayments.rows, expenseCtx?.expenses, incomeCtx?.incomes]);

  const balances = useMemo(() => balanceAt(null), [balanceAt]);

  return {
    accounts: rows,
    loading: accounts.loading,
    error: accounts.error,
    addAccount: accounts.add,
    updateAccount: accounts.update,
    removeAccount: accounts.remove,
    transfers: transfers.rows,
    transfersError: transfers.error,
    addTransfer: transfers.add,
    removeTransfer: transfers.remove,
    getAccount,
    getAccountCurrency,
    balances,
    balanceAt,
  };
}

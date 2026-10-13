import { useContext, useMemo } from 'react';
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
  const { accounts, transfers } = useExtras();
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

  const balances = useMemo(() => {
    const result = {};
    accounts.rows.forEach((a) => {
      result[a.id] = Number(a.initial_balance) || 0;
    });
    (incomeCtx?.incomes || []).forEach((i) => {
      if (i.account_id in result) result[i.account_id] += Number(i.amount);
    });
    (expenseCtx?.expenses || []).forEach((e) => {
      if (e.account_id in result) result[e.account_id] -= Number(e.amount);
    });
    transfers.rows.forEach((t) => {
      if (t.from_account_id in result) result[t.from_account_id] -= Number(t.amount);
      if (t.to_account_id in result) result[t.to_account_id] += Number(t.to_amount);
    });
    return result;
  }, [accounts.rows, transfers.rows, expenseCtx?.expenses, incomeCtx?.incomes]);

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
  };
}

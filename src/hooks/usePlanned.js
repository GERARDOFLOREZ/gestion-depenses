import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useAccounts } from './useAccounts';
import { useView } from './useView';
import { getCurrencyByCode } from '../data/currencies';
import { lowOf, highOf } from '../utils/amounts';
import { daysFromToday } from '../utils/formatters';

/** Dépenses prévues regroupées par devise, avec solde actuel et solde prévisionnel (fourchette). */
export function usePlanned() {
  const { plannedExpenses } = useExpenses();
  const { accounts, balances, getAccountCurrency } = useAccounts();
  const { accountId } = useView();

  return useMemo(() => {
    const map = {};
    const bucket = (currency) => {
      if (!map[currency.code]) {
        map[currency.code] = { currency, low: 0, high: 0, count: 0, overdue: 0, soon: 0, balance: 0 };
      }
      return map[currency.code];
    };
    plannedExpenses.forEach((e) => {
      const b = bucket(getAccountCurrency(e.account_id));
      const days = daysFromToday(e.date);
      b.low += lowOf(e);
      b.high += highOf(e);
      b.count += 1;
      if (days < 0) b.overdue += 1;
      else if (days <= 3) b.soon += 1;
    });
    Object.values(map).forEach((b) => {
      b.balance = accounts
        .filter((a) => a.currency === b.currency.code && (accountId === 'all' || a.id === accountId))
        .reduce((sum, a) => sum + (balances[a.id] ?? 0), 0);
      // Solde prévisionnel : le plus pessimiste (dépenses hautes) et le plus optimiste (dépenses basses).
      b.forecastLow = b.balance - b.high;
      b.forecastHigh = b.balance - b.low;
    });
    return {
      list: plannedExpenses,
      groups: Object.values(map),
      overdue: Object.values(map).reduce((s, b) => s + b.overdue, 0),
      soon: Object.values(map).reduce((s, b) => s + b.soon, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedExpenses, accounts, balances, accountId]);
}

export { getCurrencyByCode };

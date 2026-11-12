import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useIncomes } from './useIncomes';
import { useAccounts } from './useAccounts';
import { useCurrency } from './useCurrency';
import { useView } from './useView';
import { getCurrencyByCode } from '../data/currencies';

// « 2026-11 » → « 2026-11-01 » ; mois suivant → « 2026-12-01 »
const monthStart = (month) => `${month}-01`;
const nextMonthStart = (month) => {
  const [y, m] = month.split('-').map(Number);
  return m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;
};

/**
 * Totaux de la vue courante, regroupés par devise (on n'additionne jamais des devises différentes).
 * `opening` = solde reporté des mois précédents, `balance` = solde en fin de période
 * (report + revenus − dépenses, virements et règlements de dettes compris).
 */
export function useViewTotals() {
  const { viewExpenses, allExpenses } = useExpenses();
  const { viewIncomes, allIncomes } = useIncomes();
  const { accounts, balanceAt, getAccountCurrency } = useAccounts();
  const { currencyCode } = useCurrency();
  const { viewCurrencyCode, month, accountId } = useView();

  return useMemo(() => {
    const map = {};
    const bucket = (currency) => {
      if (!map[currency.code]) map[currency.code] = { currency, income: 0, expense: 0, opening: 0, closing: 0 };
      return map[currency.code];
    };
    viewIncomes.forEach((i) => {
      bucket(getAccountCurrency(i.account_id)).income += Number(i.amount);
    });
    viewExpenses.forEach((e) => {
      bucket(getAccountCurrency(e.account_id)).expense += Number(e.amount);
    });

    const isAll = month === 'all';
    const openAt = isAll ? null : monthStart(month);
    const closeAt = isAll ? null : nextMonthStart(month);
    const opening = isAll ? null : balanceAt(openAt);
    const closing = balanceAt(closeAt);
    const known = new Set(accounts.map((a) => a.id));

    accounts
      .filter((a) => accountId === 'all' || a.id === accountId)
      .forEach((a) => {
        const o = isAll ? 0 : opening[a.id] || 0;
        const c = closing[a.id] || 0;
        if (o !== 0 || c !== 0 || map[a.currency]) {
          const b = bucket(getCurrencyByCode(a.currency));
          b.opening += o;
          b.closing += c;
        }
      });

    // Opérations sans compte (compte supprimé) : comptées dans la vue « tous les comptes ».
    if (accountId === 'all') {
      const orphans = (list, sign, before, field) =>
        list.forEach((x) => {
          if (known.has(x.account_id) || (before && x.date >= before)) return;
          bucket(getAccountCurrency(x.account_id))[field] += sign * Number(x.amount);
        });
      orphans(allIncomes || [], 1, closeAt, 'closing');
      orphans(allExpenses || [], -1, closeAt, 'closing');
      if (!isAll) {
        orphans(allIncomes || [], 1, openAt, 'opening');
        orphans(allExpenses || [], -1, openAt, 'opening');
      }
    }

    const rows = Object.values(map).map((r) => ({ ...r, balance: r.closing }));
    if (rows.length === 0) {
      return [
        {
          currency: getCurrencyByCode(viewCurrencyCode || currencyCode),
          income: 0,
          expense: 0,
          opening: 0,
          balance: 0,
        },
      ];
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewExpenses, viewIncomes, allExpenses, allIncomes, accounts, balanceAt, month, accountId, viewCurrencyCode, currencyCode]);
}

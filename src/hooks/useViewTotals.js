import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useIncomes } from './useIncomes';
import { useAccounts } from './useAccounts';
import { useCurrency } from './useCurrency';
import { useView } from './useView';
import { getCurrencyByCode } from '../data/currencies';

/** Totaux de la vue courante, regroupés par devise (on n'additionne jamais des devises différentes). */
export function useViewTotals() {
  const { viewExpenses } = useExpenses();
  const { viewIncomes } = useIncomes();
  const { getAccountCurrency } = useAccounts();
  const { currencyCode } = useCurrency();
  const { viewCurrencyCode } = useView();

  return useMemo(() => {
    const map = {};
    const bucket = (currency) => {
      if (!map[currency.code]) map[currency.code] = { currency, income: 0, expense: 0 };
      return map[currency.code];
    };
    viewIncomes.forEach((i) => {
      bucket(getAccountCurrency(i.account_id)).income += Number(i.amount);
    });
    viewExpenses.forEach((e) => {
      bucket(getAccountCurrency(e.account_id)).expense += Number(e.amount);
    });
    const rows = Object.values(map).map((r) => ({ ...r, balance: r.income - r.expense }));
    if (rows.length === 0) {
      return [
        {
          currency: getCurrencyByCode(viewCurrencyCode || currencyCode),
          income: 0,
          expense: 0,
          balance: 0,
        },
      ];
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewExpenses, viewIncomes, viewCurrencyCode, currencyCode]);
}

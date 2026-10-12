import { createContext, useState, useMemo, useCallback } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useCurrency } from '../hooks/useCurrency';
import { getMonthISO } from '../utils/formatters';

export const ViewContext = createContext(null);

export function ViewProvider({ children }) {
  const { accounts } = useExtras();
  const { currencyCode } = useCurrency();
  const [month, setMonth] = useState(getMonthISO());
  const [rawAccountId, setAccountId] = useState('all');

  const selected = accounts.rows.find((a) => a.id === rawAccountId);
  const accountId = selected ? rawAccountId : 'all';

  const codes = [...new Set(accounts.rows.map((a) => a.currency))];
  const viewCurrencyCode = selected
    ? selected.currency
    : codes.length <= 1
      ? codes[0] || currencyCode
      : codes.includes(currencyCode)
        ? currencyCode
        : codes[0];
  const isMixed = !selected && codes.length > 1;

  const matchesView = useCallback(
    (item) =>
      (month === 'all' || item.date.startsWith(month)) &&
      (accountId === 'all' || item.account_id === accountId),
    [month, accountId]
  );

  const value = useMemo(
    () => ({ month, setMonth, accountId, setAccountId, viewCurrencyCode, isMixed, matchesView }),
    [month, accountId, viewCurrencyCode, isMixed, matchesView]
  );

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

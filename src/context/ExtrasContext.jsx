import { createContext } from 'react';
import { useSupabaseTable } from '../hooks/useSupabaseTable';

export const ExtrasContext = createContext(null);

export function ExtrasProvider({ children }) {
  const accounts = useSupabaseTable('accounts', { orderBy: 'created_at', ascending: true });
  const transfers = useSupabaseTable('transfers', { orderBy: 'date' });
  const goals = useSupabaseTable('goals');
  const recurring = useSupabaseTable('recurring');
  const customCategories = useSupabaseTable('custom_categories', {
    orderBy: 'created_at',
    ascending: true,
  });
  const debts = useSupabaseTable('debts');
  const debtPayments = useSupabaseTable('debt_payments', { orderBy: 'date' });

  return (
    <ExtrasContext.Provider
      value={{ accounts, transfers, goals, recurring, customCategories, debts, debtPayments }}
    >
      {children}
    </ExtrasContext.Provider>
  );
}

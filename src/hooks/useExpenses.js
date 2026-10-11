import { useContext, useMemo } from 'react';
import { ExpenseContext, defaultExpenseFilters } from '../context/ExpenseContext';
import { ViewContext } from '../context/ViewContext';

const alwaysTrue = () => true;

export function useExpenses() {
  const context = useContext(ExpenseContext);
  const view = useContext(ViewContext);

  if (!context) {
    throw new Error("useExpenses doit être utilisé à l'intérieur d'un ExpenseProvider");
  }

  const { expenses: allExpenses, loading, addExpense, updateExpense, deleteExpense, filters, setFilters } = context;
  const matchesView = view ? view.matchesView : alwaysTrue;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const resetFilters = () => setFilters(defaultExpenseFilters);

  // Éléments de la période / du compte sélectionnés (barre de vue)
  const viewExpenses = useMemo(() => allExpenses.filter(matchesView), [allExpenses, matchesView]);

  // + filtres de recherche / catégorie / dates
  const filteredExpenses = useMemo(() => {
    return viewExpenses.filter((exp) => {
      if (filters.category !== 'all' && exp.category !== filters.category) return false;
      if (filters.startDate && exp.date < filters.startDate) return false;
      if (filters.endDate && exp.date > filters.endDate) return false;
      if (filters.search && !exp.label.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [viewExpenses, filters]);

  const totalAmount = viewExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const filteredTotalAmount = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return {
    expenses: filteredExpenses,
    viewExpenses,
    allExpenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    totalAmount,
    filteredTotalAmount,
    filters,
    updateFilter,
    resetFilters,
  };
}

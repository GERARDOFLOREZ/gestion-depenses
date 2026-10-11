import { useContext, useMemo } from 'react';
import { IncomeContext, defaultIncomeFilters } from '../context/IncomeContext';
import { ViewContext } from '../context/ViewContext';

const alwaysTrue = () => true;

export function useIncomes() {
  const context = useContext(IncomeContext);
  const view = useContext(ViewContext);

  if (!context) {
    throw new Error("useIncomes doit être utilisé à l'intérieur d'un IncomeProvider");
  }

  const { incomes: allIncomes, loading, addIncome, updateIncome, deleteIncome, filters, setFilters } = context;
  const matchesView = view ? view.matchesView : alwaysTrue;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const resetFilters = () => setFilters(defaultIncomeFilters);

  // Éléments de la période / du compte sélectionnés (barre de vue)
  const viewIncomes = useMemo(() => allIncomes.filter(matchesView), [allIncomes, matchesView]);

  // + filtres de recherche / catégorie / dates
  const filteredIncomes = useMemo(() => {
    return viewIncomes.filter((inc) => {
      if (filters.category !== 'all' && inc.category !== filters.category) return false;
      if (filters.startDate && inc.date < filters.startDate) return false;
      if (filters.endDate && inc.date > filters.endDate) return false;
      if (filters.search && !inc.label.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [viewIncomes, filters]);

  const totalAmount = viewIncomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const filteredTotalAmount = filteredIncomes.reduce((sum, inc) => sum + Number(inc.amount), 0);

  return {
    incomes: filteredIncomes,
    viewIncomes,
    allIncomes,
    loading,
    addIncome,
    updateIncome,
    deleteIncome,
    totalAmount,
    filteredTotalAmount,
    filters,
    updateFilter,
    resetFilters,
  };
}

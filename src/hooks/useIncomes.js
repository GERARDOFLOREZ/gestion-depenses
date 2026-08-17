import { useContext, useState, useMemo } from 'react';
import { IncomeContext } from '../context/IncomeContext';

const defaultFilters = {
  category: 'all',
  startDate: '',
  endDate: '',
  search: '',
};

export function useIncomes() {
  const context = useContext(IncomeContext);

  if (!context) {
    throw new Error('useIncomes doit être utilisé à l\'intérieur d\'un IncomeProvider');
  }

  const { incomes, dispatch } = context;
  const [filters, setFilters] = useState(defaultFilters);

  const addIncome = (income) => {
    dispatch({ type: 'ADD_INCOME', payload: income });
  };

  const updateIncome = (id, updates) => {
    dispatch({ type: 'UPDATE_INCOME', payload: { id, ...updates } });
  };

  const deleteIncome = (id) => {
    dispatch({ type: 'DELETE_INCOME', payload: id });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredIncomes = useMemo(() => {
    return incomes.filter((inc) => {
      if (filters.category !== 'all' && inc.category !== filters.category) {
        return false;
      }
      if (filters.startDate && inc.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && inc.date > filters.endDate) {
        return false;
      }
      if (
        filters.search &&
        !inc.label.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [incomes, filters]);

  const totalAmount = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);

  const filteredTotalAmount = filteredIncomes.reduce(
    (sum, inc) => sum + Number(inc.amount),
    0
  );

  return {
    incomes: filteredIncomes,
    allIncomes: incomes,
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
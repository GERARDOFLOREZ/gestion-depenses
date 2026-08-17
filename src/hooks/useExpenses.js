import { useContext, useState, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const defaultFilters = {
  category: 'all',
  startDate: '',
  endDate: '',
  search: '',
};

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error('useExpenses doit être utilisé à l\'intérieur d\'un ExpenseProvider');
  }

  const { expenses, dispatch } = context;
  const [filters, setFilters] = useState(defaultFilters);

  const addExpense = (expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const updateExpense = (id, updates) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: { id, ...updates } });
  };

  const deleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      if (filters.category !== 'all' && exp.category !== filters.category) {
        return false;
      }
      if (filters.startDate && exp.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && exp.date > filters.endDate) {
        return false;
      }
      if (
        filters.search &&
        !exp.label.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const filteredTotalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
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
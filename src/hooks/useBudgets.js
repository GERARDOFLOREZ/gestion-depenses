import { useContext, useMemo } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/categories';

export function useBudgets() {
  const budgetContext = useContext(BudgetContext);
  const expenseContext = useContext(ExpenseContext);

  if (!budgetContext || !expenseContext) {
    throw new Error(
      'useBudgets doit être utilisé à l\'intérieur d\'un BudgetProvider et d\'un ExpenseProvider'
    );
  }

  const { budgets, loading, setBudget, removeBudget } = budgetContext;
  const { expenses } = expenseContext;

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    });
  }, [expenses]);

  const budgetStatus = useMemo(() => {
    return CATEGORIES.filter((cat) => budgets[cat.id] !== undefined).map((cat) => {
      const spent = currentMonthExpenses
        .filter((exp) => exp.category === cat.id)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      const budgetAmount = budgets[cat.id];
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

      return {
        ...cat,
        budgetAmount,
        spent,
        remaining: budgetAmount - spent,
        percentage: Math.min(percentage, 100),
        isOverBudget: spent > budgetAmount,
      };
    });
  }, [budgets, currentMonthExpenses]);

  return {
    budgets,
    loading,
    setBudget,
    removeBudget,
    budgetStatus,
  };
}
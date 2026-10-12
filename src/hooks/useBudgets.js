import { useContext, useMemo } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { useExtras } from './useExtras';
import { useCategories } from './useCategories';
import { useCurrency } from './useCurrency';
import { getCurrencyByCode } from '../data/currencies';

export function useBudgets() {
  const budgetContext = useContext(BudgetContext);
  const expenseContext = useContext(ExpenseContext);

  if (!budgetContext || !expenseContext) {
    throw new Error(
      'useBudgets doit être utilisé à l\'intérieur d\'un BudgetProvider et d\'un ExpenseProvider'
    );
  }

  const { budgets, loading, setBudget, removeBudget } = budgetContext;
  const { expenses: allExpenses } = expenseContext;
  const { accounts } = useExtras();
  const { expenseCategories } = useCategories();
  const { currencyCode } = useCurrency();

  // Les budgets sont exprimés dans la devise principale : seules les dépenses
  // des comptes dans cette devise (ou sans compte) sont comptabilisées.
  const expenses = useMemo(() => {
    return allExpenses.filter((exp) => {
      const account = accounts.rows.find((a) => a.id === exp.account_id);
      return getCurrencyByCode(account?.currency || currencyCode).code === currencyCode;
    });
  }, [allExpenses, accounts.rows, currencyCode]);

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
    return expenseCategories.filter((cat) => budgets[cat.id] !== undefined).map((cat) => {
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
        // « presque atteint » : il reste moins de 20 % du budget
        isNearLimit: spent <= budgetAmount && budgetAmount > 0 && spent >= budgetAmount * 0.8,
      };
    });
  }, [budgets, currentMonthExpenses, expenseCategories]);

  return {
    budgets,
    loading,
    setBudget,
    removeBudget,
    budgetStatus,
  };
}
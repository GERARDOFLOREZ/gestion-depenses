import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    if (!user) {
      setBudgets({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from('budgets').select('*');

    if (error) {
      console.error('Erreur lors du chargement des budgets :', error);
    } else {
      const budgetsMap = {};
      data.forEach((row) => {
        budgetsMap[row.category] = row.amount;
      });
      setBudgets(budgetsMap);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const setBudget = async (categoryId, amount) => {
    const { error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: user.id, category: categoryId, amount },
        { onConflict: 'user_id,category' }
      );

    if (error) {
      console.error('Erreur lors de la définition du budget :', error);
      return;
    }
    setBudgets((prev) => ({ ...prev, [categoryId]: amount }));
  };

  const removeBudget = async (categoryId) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('category', categoryId);

    if (error) {
      console.error('Erreur lors de la suppression du budget :', error);
      return;
    }
    setBudgets((prev) => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  return (
    <BudgetContext.Provider value={{ budgets, loading, setBudget, removeBudget }}>
      {children}
    </BudgetContext.Provider>
  );
}
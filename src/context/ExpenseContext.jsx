import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export const defaultExpenseFilters = {
  category: 'all',
  startDate: '',
  endDate: '',
  search: '',
};

export const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultExpenseFilters);

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des dépenses :', error);
    } else {
      setExpenses(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: user.id }])
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout de la dépense :', error);
      return;
    }
    setExpenses((prev) => [data[0], ...prev]);
  };

  const updateExpense = async (id, updates) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erreur lors de la modification de la dépense :', error);
      return;
    }
    setExpenses((prev) => prev.map((exp) => (exp.id === id ? data[0] : exp)));
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la dépense :', error);
      return;
    }
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, loading, filters, setFilters, refetch: fetchExpenses, addExpense, updateExpense, deleteExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
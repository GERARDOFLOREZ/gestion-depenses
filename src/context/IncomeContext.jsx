import { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useSpace } from '../hooks/useSpace';

export const defaultIncomeFilters = {
  category: 'all',
  startDate: '',
  endDate: '',
  search: '',
};

export const IncomeContext = createContext(null);

export function IncomeProvider({ children }) {
  const { user } = useAuth();
  const { spaceId } = useSpace();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultIncomeFilters);

  const fetchIncomes = useCallback(async () => {
    if (!user || !spaceId) {
      setIncomes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('space_id', spaceId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des revenus :', error);
    } else {
      setIncomes(data);
    }
    setLoading(false);
  }, [user, spaceId]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const addIncome = async (income) => {
    const { data, error } = await supabase
      .from('incomes')
      .insert([{ ...income, user_id: user.id, space_id: spaceId }])
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout du revenu :', error);
      return;
    }
    setIncomes((prev) => [data[0], ...prev]);
  };

  const updateIncome = async (id, updates) => {
    const { data, error } = await supabase
      .from('incomes')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erreur lors de la modification du revenu :', error);
      return;
    }
    setIncomes((prev) => prev.map((inc) => (inc.id === id ? data[0] : inc)));
  };

  const deleteIncome = async (id) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du revenu :', error);
      return;
    }
    setIncomes((prev) => prev.filter((inc) => inc.id !== id));
  };

  return (
    <IncomeContext.Provider
      value={{ incomes, loading, filters, setFilters, refetch: fetchIncomes, addIncome, updateIncome, deleteIncome }}
    >
      {children}
    </IncomeContext.Provider>
  );
}
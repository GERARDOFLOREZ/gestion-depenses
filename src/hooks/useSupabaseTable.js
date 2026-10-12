import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

/**
 * Petit hook CRUD générique pour une table Supabase protégée par RLS.
 * Retourne { rows, loading, error, add, update, remove, refetch }.
 * `error` est renseigné si la table n'existe pas encore (SQL non exécuté).
 */
export function useSupabaseTable(table, { orderBy = 'created_at', ascending = false } = {}) {
  const { user } = useAuth();
  const userId = user?.id;
  const [rows, setRows] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loadedFor, setLoadedFor] = useState(null);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setRows([]);
      setFetching(false);
      return;
    }
    setFetching(true);
    const { data, error: err } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending });
    if (err) {
      console.error(`Erreur de chargement (${table}) :`, err);
      setError(err);
      setRows([]);
    } else {
      setError(null);
      setRows(data);
    }
    setFetching(false);
    setLoadedFor(userId);
  }, [table, orderBy, ascending, userId]);

  // « en chargement » tant que les données de CET utilisateur n'ont pas été reçues
  const loading = userId ? loadedFor !== userId || fetching : false;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const add = async (row) => {
    const { data, error: err } = await supabase
      .from(table)
      .insert([{ ...row, user_id: userId }])
      .select()
      .single();
    if (err) {
      console.error(`Erreur d'ajout (${table}) :`, err);
      return { error: err };
    }
    setRows((prev) => (ascending ? [...prev, data] : [data, ...prev]));
    return { data };
  };

  const update = async (id, updates) => {
    const { data, error: err } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (err) {
      console.error(`Erreur de modification (${table}) :`, err);
      return { error: err };
    }
    setRows((prev) => prev.map((r) => (r.id === id ? data : r)));
    return { data };
  };

  const remove = async (id) => {
    const { error: err } = await supabase.from(table).delete().eq('id', id);
    if (err) {
      console.error(`Erreur de suppression (${table}) :`, err);
      return { error: err };
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    return {};
  };

  return { rows, loading, error, add, update, remove, refetch };
}

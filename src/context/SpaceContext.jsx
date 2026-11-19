import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export const SpaceContext = createContext(null);

const storageKey = (userId) => `gestion-depenses:space:${userId}`;

function loadChosen(userId) {
  try {
    return localStorage.getItem(storageKey(userId));
  } catch {
    return null;
  }
}

function saveChosen(userId, spaceId) {
  try {
    localStorage.setItem(storageKey(userId), spaceId);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'espace :", error);
  }
}

/**
 * Espaces d'un utilisateur (ex. « Mon espace perso », « CESAM »).
 * Un seul login, plusieurs espaces totalement séparés : chaque donnée
 * (comptes, dépenses, revenus, budgets…) appartient à un espace.
 */
export function SpaceProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [spaces, setSpaces] = useState([]);
  const [chosenId, setChosenId] = useState(null);
  const [loadedFor, setLoadedFor] = useState(null);
  const [error, setError] = useState(null);

  const fetchSpaces = useCallback(async () => {
    if (!userId) return;
    setError(null);

    const { data, error: err } = await supabase
      .from('spaces')
      .select('*')
      .order('created_at', { ascending: true });

    if (err) {
      console.error('Erreur de chargement des espaces :', err);
      setError(err);
      return;
    }

    let rows = data;
    // Filet de sécurité : un utilisateur doit toujours avoir son espace perso.
    if (!rows.some((s) => s.kind === 'perso')) {
      const { data: created, error: createErr } = await supabase
        .from('spaces')
        .insert([{ user_id: userId, name: 'Mon espace perso', kind: 'perso' }])
        .select()
        .single();
      if (createErr) {
        console.error("Erreur de création de l'espace perso :", createErr);
        setError(createErr);
        return;
      }
      rows = [created, ...rows];
    }

    setSpaces(rows);
    setChosenId(loadChosen(userId));
    setLoadedFor(userId);
  }, [userId]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const ready = Boolean(userId) && loadedFor === userId;
  const visibleSpaces = useMemo(() => (ready ? spaces : []), [ready, spaces]);

  // Espace actif : celui choisi la dernière fois, sinon l'espace perso.
  const currentSpace = useMemo(() => {
    if (!ready) return null;
    return (
      spaces.find((s) => s.id === chosenId) ||
      spaces.find((s) => s.kind === 'perso') ||
      spaces[0] ||
      null
    );
  }, [ready, spaces, chosenId]);

  const spaceId = currentSpace?.id ?? null;

  const setSpaceId = useCallback(
    (id) => {
      if (!spaces.some((s) => s.id === id)) return;
      saveChosen(userId, id);
      setChosenId(id);
    },
    [spaces, userId]
  );

  const createSpace = useCallback(
    async (name) => {
      const clean = name.trim();
      if (!clean) return { error: new Error('Nom vide') };
      const { data, error: err } = await supabase
        .from('spaces')
        .insert([{ user_id: userId, name: clean, kind: 'custom' }])
        .select()
        .single();
      if (err) {
        console.error("Erreur de création de l'espace :", err);
        return { error: err };
      }
      setSpaces((prev) => [...prev, data]);
      saveChosen(userId, data.id);
      setChosenId(data.id);
      return { data };
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      spaces: visibleSpaces,
      currentSpace,
      spaceId,
      loading: Boolean(userId) && !ready && !error,
      error,
      reload: fetchSpaces,
      setSpaceId,
      createSpace,
    }),
    [visibleSpaces, currentSpace, spaceId, userId, ready, error, fetchSpaces, setSpaceId, createSpace]
  );

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
}

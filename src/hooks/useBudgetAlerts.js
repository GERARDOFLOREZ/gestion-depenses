import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { useBudgets } from './useBudgets';
import { useCurrency } from './useCurrency';
import { formatAmount } from '../utils/formatters';
import { t } from '../i18n';
import { useLanguage } from './useLanguage';

// Les messages parlent en montants (pas en pourcentages).
function buildAlert(cat, currency) {
  const budget = formatAmount(cat.budgetAmount, currency);
  if (cat.isOverBudget) {
    return {
      id: `${cat.id}-over`,
      catId: cat.id,
      level: 'over',
      title: t('Budget « {label} » dépassé', { label: cat.label }),
      message: t('Vous avez dépensé {spent} pour un budget de {budget} : dépassement de {over}.', {
        spent: formatAmount(cat.spent, currency),
        budget,
        over: formatAmount(Math.abs(cat.remaining), currency),
      }),
    };
  }
  return {
    id: `${cat.id}-warn`,
    catId: cat.id,
    level: 'warn',
    title: t('Budget « {label} » presque atteint', { label: cat.label }),
    message: t('Il ne vous reste que {left} sur {budget} (déjà dépensé : {spent}).', {
      left: formatAmount(cat.remaining, currency),
      budget,
      spent: formatAmount(cat.spent, currency),
    }),
  };
}

/** Liste actuelle des budgets en alerte (dépassés ou presque atteints). */
export function useBudgetAlerts() {
  const { budgetStatus } = useBudgets();
  const { currency } = useCurrency();
  const { locale } = useLanguage();

  return useMemo(
    () =>
      budgetStatus
        .filter((c) => c.isOverBudget || c.isNearLimit)
        .map((c) => buildAlert(c, currency))
        .sort((a, b) => (a.level === b.level ? 0 : a.level === 'over' ? -1 : 1)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budgetStatus, currency, locale]
  );
}

const LEVEL = (c) => (c.isOverBudget ? 2 : c.isNearLimit ? 1 : 0);

/**
 * Notifications (toasts) : s'affichent quand un budget passe à « presque atteint »
 * ou « dépassé » — par exemple juste après l'ajout d'une dépense.
 */
export function useBudgetToasts() {
  const { budgetStatus, loading } = useBudgets();
  const expenseCtx = useContext(ExpenseContext);
  const { currency } = useCurrency();
  const [toasts, setToasts] = useState([]);
  const previous = useRef(null);
  const readySince = useRef(null);
  const ready = !loading && !expenseCtx.loading;

  useEffect(() => {
    if (!ready) return;
    if (readySince.current === null) readySince.current = Date.now();

    const now = {};
    budgetStatus.forEach((c) => {
      now[c.id] = LEVEL(c);
    });

    // Pas de notification pendant le chargement initial (premières secondes)
    const settled = Date.now() - readySince.current > 2500;
    if (previous.current && settled) {
      const fresh = budgetStatus
        .filter((c) => LEVEL(c) > (previous.current[c.id] ?? 0))
        .map((c) => ({ ...buildAlert(c, currency), key: `${c.id}-${Date.now()}` }));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((f) => f.catId));
        setToasts((list) => [...list.filter((x) => !ids.has(x.catId)), ...fresh]);
      }
    }
    previous.current = now;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, budgetStatus]);

  const dismissToast = (key) => setToasts((list) => list.filter((x) => x.key !== key));

  return { toasts, dismissToast };
}

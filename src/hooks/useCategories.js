import { useMemo } from 'react';
import { useExtras } from './useExtras';
import { useLanguage } from './useLanguage';
import { t } from '../i18n';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { INCOME_CATEGORIES, getIncomeCategoryById } from '../data/incomeCategories';

const translateLabel = (c) => ({ ...c, label: t(c.label) });

export function useCategories() {
  const { customCategories } = useExtras();
  const { locale } = useLanguage();

  return useMemo(() => {
    const custom = customCategories.rows.map((c) => ({
      id: `custom_${c.id}`,
      rowId: c.id,
      label: c.label,
      color: c.color,
      kind: c.kind,
      custom: true,
    }));

    const expenseCategories = [...CATEGORIES.map(translateLabel), ...custom.filter((c) => c.kind === 'expense')];
    const incomeCategories = [
      ...INCOME_CATEGORIES.map(translateLabel),
      ...custom.filter((c) => c.kind === 'income'),
    ];

    return {
      expenseCategories,
      incomeCategories,
      customList: custom,
      getExpenseCategory: (id) =>
        expenseCategories.find((c) => c.id === id) || getCategoryById(id),
      getIncomeCategory: (id) =>
        incomeCategories.find((c) => c.id === id) || getIncomeCategoryById(id),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customCategories.rows, locale]);
}

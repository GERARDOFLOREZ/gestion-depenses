export const MENU_GROUPS = [
  {
    title: 'Aperçu',
    items: [{ id: 'dashboard', icon: '📊', label: 'Tableau de bord' }],
  },
  {
    title: 'Opérations',
    items: [
      { id: 'expenses', icon: '💸', label: 'Dépenses' },
      { id: 'incomes', icon: '💵', label: 'Revenus' },
      { id: 'recurring', icon: '🔁', label: 'Récurrents' },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { id: 'accounts', icon: '🏦', label: 'Comptes' },
      { id: 'budgets', icon: '🎯', label: 'Budgets' },
      { id: 'goals', icon: '🐖', label: "Objectifs d'épargne" },
      { id: 'debts', icon: '🤝', label: 'Dettes' },
    ],
  },
  {
    title: 'Réglages',
    items: [{ id: 'categories', icon: '🏷️', label: 'Catégories' }],
  },
];

export const getMenuItem = (id) =>
  MENU_GROUPS.flatMap((g) => g.items).find((i) => i.id === id);

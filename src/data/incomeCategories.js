export const INCOME_CATEGORIES = [
  { id: 'salaire', label: 'Salaire', color: '#2e7d32' },
  { id: 'freelance', label: 'Freelance', color: '#0288d1' },
  { id: 'investissement', label: 'Investissement', color: '#7b1fa2' },
  { id: 'cadeau', label: 'Cadeau', color: '#f57c00' },
  { id: 'remboursement', label: 'Remboursement', color: '#00897b' },
  { id: 'autre', label: 'Autre', color: '#5d4037' },
];

export const getIncomeCategoryById = (id) =>
  INCOME_CATEGORIES.find((cat) => cat.id === id) || INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
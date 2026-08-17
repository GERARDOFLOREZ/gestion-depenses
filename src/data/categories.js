export const CATEGORIES = [
  { id: 'alimentation', label: 'Alimentation', color: '#4CAF50' },
  { id: 'transport', label: 'Transport', color: '#2196F3' },
  { id: 'logement', label: 'Logement', color: '#9C27B0' },
  { id: 'sante', label: 'Santé', color: '#F44336' },
  { id: 'loisirs', label: 'Loisirs', color: '#FF9800' },
  { id: 'education', label: 'Éducation', color: '#3F51B5' },
  { id: 'factures', label: 'Factures', color: '#607D8B' },
  { id: 'autre', label: 'Autre', color: '#795548' },
];

export const getCategoryById = (id) =>
  CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
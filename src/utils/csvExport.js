import { getCategoryById } from '../data/categories';

export function exportExpensesToCSV(expenses) {
  if (expenses.length === 0) return;

  const headers = ['Libellé', 'Montant (€)', 'Catégorie', 'Date'];

  const rows = expenses.map((exp) => {
    const category = getCategoryById(exp.category);
    return [
      escapeCSVValue(exp.label),
      exp.amount,
      escapeCSVValue(category.label),
      exp.date,
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.join(';'))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `depenses-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSVValue(value) {
  const str = String(value);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
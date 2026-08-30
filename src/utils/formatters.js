export function formatAmount(amount, currency) {
  const code = currency?.code || 'EUR';
  const locale = currency?.locale || 'fr-FR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(amount);
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}
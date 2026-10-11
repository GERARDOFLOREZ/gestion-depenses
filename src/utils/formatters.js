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

export function getMonthISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number);
  return getMonthISO(new Date(y, m - 1 + delta, 1));
}

export function formatMonthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  const label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(
    new Date(y, m - 1, 1)
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatShortMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(y, m - 1, 1));
}

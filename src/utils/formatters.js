import { intlLocale, getLocale } from '../i18n';

const hasLetter = (s) => /\p{L}/u.test(s);

export function formatAmount(amount, currency) {
  const code = currency?.code || 'EUR';
  const symbol = currency?.symbol;
  const parts = new Intl.NumberFormat(intlLocale(), {
    style: 'currency',
    currency: code,
  }).formatToParts(amount);

  // On remplace le symbole d'Intl (souvent "XOF", "MAD"…) par celui de notre table.
  const firstNumber = parts.findIndex((p) => p.type === 'integer');
  let text = parts
    .map((p, i) => {
      if (p.type !== 'currency' || !symbol) return p.value;
      return symbol;
    })
    .reduce((acc, value, i) => {
      // Symbole non alphabétique placé devant le nombre : pas d'espace (ex. ₦5,000).
      const prevIsPrefixSymbol =
        i > 0 && parts[i - 1].type === 'currency' && i - 1 < firstNumber && symbol && !hasLetter(symbol);
      if (prevIsPrefixSymbol && parts[i].type === 'literal') return acc;
      return acc + value;
    }, '');

  // Isole le montant (écriture de gauche à droite) au milieu d'un texte arabe.
  if (getLocale() === 'ar') text = `⁦${text}⁩`;
  return text;
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat(intlLocale(), {
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
  const label = new Intl.DateTimeFormat(intlLocale(), { month: 'long', year: 'numeric' }).format(
    new Date(y, m - 1, 1)
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMonthName(month) {
  const [y, m] = month.split('-').map(Number);
  const label = new Intl.DateTimeFormat(intlLocale(), { month: 'long' }).format(new Date(y, m - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatShortMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale(), { month: 'short' }).format(new Date(y, m - 1, 1));
}

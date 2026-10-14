const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => d.toISOString().slice(0, 10);
const parse = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

export const INTERVAL_UNITS = ['day', 'week', 'month', 'year'];

export const intervalOf = (rec) => ({
  count: Math.max(1, Number(rec.interval_count) || 1),
  unit: rec.interval_unit || 'month',
});

/** n-ième échéance (0 = première) d'une opération récurrente, au format AAAA-MM-JJ. */
function occurrence(rec, k) {
  const { count, unit } = intervalOf(rec);
  const start = parse(rec.start_date);
  if (unit === 'day' || unit === 'week') {
    const step = count * (unit === 'week' ? 7 : 1) * k;
    return toISO(new Date(Date.UTC(start.y, start.m - 1, start.d + step)));
  }
  const monthStep = count * (unit === 'year' ? 12 : 1) * k;
  const total = start.m - 1 + monthStep;
  const y = start.y + Math.floor(total / 12);
  const m = (total % 12) + 1;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const wanted = Number(rec.day_of_month) || start.d;
  return `${y}-${pad(m)}-${pad(Math.min(wanted, daysInMonth))}`;
}

/** Dernière date déjà générée (nouvelle colonne, ou ancien suivi par mois). */
function lastGenerated(rec) {
  if (rec.last_generated_date) return rec.last_generated_date;
  if (rec.last_generated_month) {
    const { y, m } = parse(`${rec.last_generated_month}-01`);
    return `${y}-${pad(m)}-${pad(new Date(Date.UTC(y, m, 0)).getUTCDate())}`;
  }
  return null;
}

/** Dates (<= aujourd'hui) pas encore générées pour une opération récurrente. */
export function pendingDates(rec, today) {
  const last = lastGenerated(rec);
  const deadline = rec.date_mode === 'deadline';
  const out = [];
  for (let k = 0; k < 5000; k += 1) {
    const date = occurrence(rec, k);
    if (deadline) {
      // « Au plus tard » : l'échéance apparaît dès que le cycle précédent est écoulé (une seule d'avance).
      if (k > 0 && occurrence(rec, k - 1) > today) break;
    } else if (date > today) break;
    if (date >= rec.start_date && (!last || date > last)) out.push(date);
  }
  return out;
}

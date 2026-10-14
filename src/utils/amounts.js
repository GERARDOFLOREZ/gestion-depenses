/** Montants précis ou en fourchette (« 100 – 150 »). `amount` = valeur utilisée dans les calculs (milieu). */
export const emptyAmount = { amount: '', isRange: false, amountMin: '', amountMax: '' };

export const isRangeRow = (row) => row.amount_min != null && row.amount_max != null;

export function amountFromRow(row) {
  return isRangeRow(row)
    ? { amount: '', isRange: true, amountMin: row.amount_min, amountMax: row.amount_max }
    : { amount: row.amount, isRange: false, amountMin: '', amountMax: '' };
}

/** Retourne { fields } à enregistrer, ou { error } ('positive' | 'order'). */
export function amountPayload(form, editingRow) {
  if (form.isRange) {
    const min = Number(form.amountMin);
    const max = Number(form.amountMax);
    if (!min || min <= 0 || !max || max <= 0) return { error: 'positive' };
    if (max < min) return { error: 'order' };
    return {
      fields: { amount: Math.round(((min + max) / 2) * 100) / 100, amount_min: min, amount_max: max },
    };
  }
  if (!form.amount || Number(form.amount) <= 0) return { error: 'positive' };
  const fields = { amount: Number(form.amount) };
  // Repasse en montant précis : on efface l'ancienne fourchette (colonnes présentes si la base est à jour).
  if (editingRow && 'amount_min' in editingRow) {
    fields.amount_min = null;
    fields.amount_max = null;
  }
  return { fields };
}

/** Borne basse / haute d'un montant (identiques si le montant est précis). */
export const lowOf = (row) => (isRangeRow(row) ? Number(row.amount_min) : Number(row.amount));
export const highOf = (row) => (isRangeRow(row) ? Number(row.amount_max) : Number(row.amount));

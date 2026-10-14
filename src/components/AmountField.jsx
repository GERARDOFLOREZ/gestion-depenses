import { t } from '../i18n';

/** Champ « Montant » : précis, ou fourchette min – max (ex. prix d'une paire de chaussures : 100 – 150). */
function AmountField({ id, form, setForm, onChange, symbol }) {
  const toggle = () => setForm((prev) => ({ ...prev, isRange: !prev.isRange }));

  return (
    <div className="form-group">
      <label htmlFor={id}>{t('Montant')} ({symbol})</label>
      {form.isRange ? (
        <div className="range-row">
          <input
            type="number" id={id} name="amountMin" value={form.amountMin} onChange={onChange}
            step="0.01" min="0" placeholder={t('Min')} aria-label={t('Montant minimum')}
          />
          <span aria-hidden="true">–</span>
          <input
            type="number" name="amountMax" value={form.amountMax} onChange={onChange}
            step="0.01" min="0" placeholder={t('Max')} aria-label={t('Montant maximum')}
          />
        </div>
      ) : (
        <input type="number" id={id} name="amount" value={form.amount} onChange={onChange} step="0.01" min="0" />
      )}
      <button type="button" className="range-toggle" onClick={toggle}>
        {form.isRange ? t('Montant précis') : t('Je ne connais pas le prix exact : saisir une fourchette')}
      </button>
    </div>
  );
}

export default AmountField;

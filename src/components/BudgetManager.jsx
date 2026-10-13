import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useCurrency } from '../hooks/useCurrency';
import { useCategories } from '../hooks/useCategories';
import { formatAmount } from '../utils/formatters';
import { t } from '../i18n';

function BudgetManager() {
  const { budgets, setBudget, removeBudget } = useBudgets();
  const { currency } = useCurrency();
  const { expenseCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('alimentation');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setError(t('Le budget doit être un nombre positif.'));
      return;
    }

    setBudget(selectedCategory, Number(amount));
    setAmount('');
    setError('');
  };

  const definedBudgets = expenseCategories.filter((cat) => budgets[cat.id] !== undefined);

  return (
    <section className="budget-manager">
      <h2>{t('Budgets mensuels ({code})', { code: currency.code })}</h2>
      <p className="hint">{t('Les budgets sont exprimés dans votre devise principale ({label}). Seules les dépenses des comptes dans cette devise sont comptées.', { label: t(currency.label) })}</p>

      <form className="budget-manager-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="budget-form-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder={t('Montant')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
          />

          <button type="submit">{t('Définir')}</button>
        </div>
      </form>

      {definedBudgets.length > 0 && (
        <ul className="budget-defined-list">
          {definedBudgets.map((cat) => (
            <li key={cat.id} className="budget-defined-item">
              <span>{cat.label}</span>
              <span>{formatAmount(budgets[cat.id], currency)} {t('/ mois')}</span>
              <button
                type="button"
                className="budget-remove-btn"
                onClick={() => removeBudget(cat.id)}
                aria-label={t('Supprimer le budget {label}', { label: cat.label })}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BudgetManager;
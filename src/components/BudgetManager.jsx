import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useCurrency } from '../hooks/useCurrency';
import { CATEGORIES } from '../data/categories';
import { formatAmount } from '../utils/formatters';

function BudgetManager() {
  const { budgets, setBudget, removeBudget } = useBudgets();
  const { currency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setError('Le budget doit être un nombre positif.');
      return;
    }

    setBudget(selectedCategory, Number(amount));
    setAmount('');
    setError('');
  };

  const definedBudgets = CATEGORIES.filter((cat) => budgets[cat.id] !== undefined);

  return (
    <section className="budget-manager">
      <h2>Budgets mensuels</h2>

      <form className="budget-manager-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="budget-form-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
          />

          <button type="submit">Définir</button>
        </div>
      </form>

      {definedBudgets.length > 0 && (
        <ul className="budget-defined-list">
          {definedBudgets.map((cat) => (
            <li key={cat.id} className="budget-defined-item">
              <span>{cat.label}</span>
              <span>{formatAmount(budgets[cat.id], currency)} / mois</span>
              <button
                type="button"
                className="budget-remove-btn"
                onClick={() => removeBudget(cat.id)}
                aria-label={`Supprimer le budget ${cat.label}`}
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
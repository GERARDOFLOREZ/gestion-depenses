import { useState, useEffect } from 'react';
import { useIncomes } from '../hooks/useIncomes';
import { useCurrency } from '../hooks/useCurrency';
import { INCOME_CATEGORIES } from '../data/incomeCategories';
import { getTodayISO } from '../utils/formatters';

const emptyForm = {
  label: '',
  amount: '',
  category: INCOME_CATEGORIES[0].id,
  date: getTodayISO(),
};

function IncomeForm({ editingIncome, onFinishEdit }) {
  const { addIncome, updateIncome } = useIncomes();
  const { currency } = useCurrency();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const isEditing = Boolean(editingIncome);

  useEffect(() => {
    if (editingIncome) {
      setForm({
        label: editingIncome.label,
        amount: editingIncome.amount,
        category: editingIncome.category,
        date: editingIncome.date,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [editingIncome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.label.trim()) {
      setError('Le libellé est obligatoire.');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Le montant doit être un nombre positif.');
      return;
    }

    const payload = {
      label: form.label.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    };

    if (isEditing) {
      updateIncome(editingIncome.id, payload);
      onFinishEdit();
    } else {
      addIncome(payload);
    }

    setForm(emptyForm);
    setError('');
  };

  const handleCancel = () => {
    onFinishEdit();
  };

  return (
    <form className="income-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Modifier le revenu' : 'Ajouter un revenu'}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="income-label">Libellé</label>
        <input
          type="text"
          id="income-label"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Ex: Salaire, Freelance..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="income-amount">Montant ({currency.symbol})</label>
        <input
          type="number"
          id="income-amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="income-category">Catégorie</label>
        <select
          id="income-category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="income-date">Date</label>
        <input
          type="date"
          id="income-date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit">{isEditing ? 'Enregistrer' : 'Ajouter'}</button>
        {isEditing && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default IncomeForm;
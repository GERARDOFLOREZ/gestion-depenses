import { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { CATEGORIES } from '../data/categories';
import { getTodayISO } from '../utils/formatters';

const emptyForm = {
  label: '',
  amount: '',
  category: CATEGORIES[0].id,
  date: getTodayISO(),
};

function ExpenseForm({ editingExpense, onFinishEdit }) {
  const { addExpense, updateExpense } = useExpenses();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const isEditing = Boolean(editingExpense);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        label: editingExpense.label,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [editingExpense]);

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
      updateExpense(editingExpense.id, payload);
      onFinishEdit();
    } else {
      addExpense(payload);
    }

    setForm(emptyForm);
    setError('');
  };

  const handleCancel = () => {
    onFinishEdit();
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Modifier la dépense' : 'Ajouter une dépense'}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="label">Libellé</label>
        <input
          type="text"
          id="label"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Ex: Courses, Essence..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Montant (€)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Catégorie</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
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

export default ExpenseForm;
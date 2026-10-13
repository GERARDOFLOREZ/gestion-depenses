import { useState, useEffect, useRef } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useView } from '../hooks/useView';
import { CATEGORIES } from '../data/categories';
import { getTodayISO } from '../utils/formatters';
import { t } from '../i18n';

const emptyForm = {
  label: '',
  amount: '',
  category: CATEGORIES[0].id,
  date: getTodayISO(),
  account_id: '',
};

function ExpenseForm({ editingExpense, onFinishEdit }) {
  const { addExpense, updateExpense } = useExpenses();
  const formRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const { accounts, getAccountCurrency } = useAccounts();
  const { expenseCategories } = useCategories();
  const { accountId } = useView();
  const defaultAccountId = accountId !== 'all' ? accountId : accounts[0]?.id || '';
  const accountValue = form.account_id || defaultAccountId;
  const currency = getAccountCurrency(accountValue);

  const isEditing = Boolean(editingExpense);

  useEffect(() => {
    if (editingExpense) {
      // Le formulaire est en haut de page : on y remonte pour que la modification soit visible.
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setForm({
        label: editingExpense.label,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        account_id: editingExpense.account_id || '',
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
      setError(t('Le libellé est obligatoire.'));
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError(t('Le montant doit être un nombre positif.'));
      return;
    }

    const payload = {
      label: form.label.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      ...(accountValue ? { account_id: accountValue } : {}),
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
    <form className="expense-form" onSubmit={handleSubmit} ref={formRef}>
      <h2>{isEditing ? t('Modifier la dépense') : t('Ajouter une dépense')}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="label">{t('Libellé')}</label>
        <input
          type="text"
          id="label"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder={t('Ex: Courses, Essence...')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">{t('Montant')} ({currency.symbol})</label>
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
        <label htmlFor="category">{t('Catégorie')}</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {expenseCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {accounts.length > 0 && (
        <div className="form-group">
          <label htmlFor="expense-account">{t('Compte')}</label>
          <select
            id="expense-account"
            name="account_id"
            value={accountValue}
            onChange={handleChange}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.currency})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="date">{t('Date')}</label>
        <input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit">{isEditing ? t('Enregistrer') : t('Ajouter')}</button>
        {isEditing && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            {t('Annuler')}
          </button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;
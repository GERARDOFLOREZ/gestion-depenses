import { useState, useEffect, useRef } from 'react';
import { useIncomes } from '../hooks/useIncomes';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useView } from '../hooks/useView';
import { INCOME_CATEGORIES } from '../data/incomeCategories';
import { getTodayISO } from '../utils/formatters';
import { t } from '../i18n';

const emptyForm = {
  label: '',
  amount: '',
  category: INCOME_CATEGORIES[0].id,
  date: getTodayISO(),
  account_id: '',
};

function IncomeForm({ editingIncome, onFinishEdit }) {
  const { addIncome, updateIncome } = useIncomes();
  const formRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const { accounts, getAccountCurrency } = useAccounts();
  const { incomeCategories } = useCategories();
  const { accountId } = useView();
  const defaultAccountId = accountId !== 'all' ? accountId : accounts[0]?.id || '';
  const accountValue = form.account_id || defaultAccountId;
  const currency = getAccountCurrency(accountValue);

  const isEditing = Boolean(editingIncome);

  useEffect(() => {
    if (editingIncome) {
      // Le formulaire est en haut de page : on y remonte pour que la modification soit visible.
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setForm({
        label: editingIncome.label,
        amount: editingIncome.amount,
        category: editingIncome.category,
        date: editingIncome.date,
        account_id: editingIncome.account_id || '',
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
    <form className="income-form" onSubmit={handleSubmit} ref={formRef}>
      <h2>{isEditing ? t('Modifier le revenu') : t('Ajouter un revenu')}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="income-label">{t('Libellé')}</label>
        <input
          type="text"
          id="income-label"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder={t('Ex: Salaire, Freelance...')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="income-amount">{t('Montant')} ({currency.symbol})</label>
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
        <label htmlFor="income-category">{t('Catégorie')}</label>
        <select
          id="income-category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {incomeCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {accounts.length > 0 && (
        <div className="form-group">
          <label htmlFor="income-account">{t('Compte')}</label>
          <select
            id="income-account"
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
        <label htmlFor="income-date">{t('Date')}</label>
        <input
          type="date"
          id="income-date"
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

export default IncomeForm;
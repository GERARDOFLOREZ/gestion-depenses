import { useState, useEffect, useRef } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useView } from '../hooks/useView';
import { CATEGORIES } from '../data/categories';
import { getTodayISO } from '../utils/formatters';
import { emptyAmount, amountFromRow, amountPayload } from '../utils/amounts';
import AmountField from './AmountField';
import { t } from '../i18n';

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return getTodayISO(d);
}

const emptyForm = {
  label: '',
  ...emptyAmount,
  status: 'done',
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
        ...amountFromRow(editingExpense),
        status: editingExpense.status || 'done',
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

  const setStatus = (status) =>
    setForm((prev) => ({
      ...prev,
      status,
      // Une dépense prévue part par défaut pour demain ; repasser à « faite » remet aujourd'hui.
      date: status === 'planned' && prev.date <= getTodayISO() ? tomorrowISO() : status === 'done' ? getTodayISO() : prev.date,
    }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.label.trim()) {
      setError(t('Le libellé est obligatoire.'));
      return;
    }
    const { fields, error: amountError } = amountPayload(form, editingExpense);
    if (amountError) {
      setError(
        amountError === 'order'
          ? t('Le montant maximum doit être supérieur ou égal au minimum.')
          : t('Le montant doit être un nombre positif.')
      );
      return;
    }

    const payload = {
      label: form.label.trim(),
      ...fields,
      category: form.category,
      date: form.date,
      ...(accountValue ? { account_id: accountValue } : {}),
      // « status » n'est envoyé que s'il sert (prévue, ou modification d'une ligne qui en a un) : base ancienne compatible.
      ...(form.status === 'planned' || (isEditing && 'status' in editingExpense) ? { status: form.status } : {}),
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
      <h2>{isEditing ? t('Modifier la dépense') : form.status === 'planned' ? t('Ajouter une dépense prévue') : t('Ajouter une dépense')}</h2>

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

      <AmountField id="amount" form={form} setForm={setForm} onChange={handleChange} symbol={currency.symbol} />

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

      <div className="form-group">
        <span className="field-label">{t('Cette dépense est…')}</span>
        <div className="segmented">
          <button type="button" className={form.status === 'done' ? 'on' : ''} onClick={() => setStatus('done')}>
            ✅ {t('Déjà faite')}
          </button>
          <button type="button" className={form.status === 'planned' ? 'on' : ''} onClick={() => setStatus('planned')}>
            🗓️ {t('Prévue (à venir)')}
          </button>
        </div>
        {form.status === 'planned' && (
          <p className="hint">
            {t("Une dépense prévue n'est comptée ni dans vos soldes ni dans vos budgets tant que vous ne l'avez pas marquée comme payée. Elle apparaît dans « À venir » et dans votre solde prévisionnel.")}
          </p>
        )}
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
        <label htmlFor="date">{form.status === 'planned' ? t('Date prévue') : t('Date')}</label>
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
import { useState } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { formatAmount, getTodayISO } from '../utils/formatters';
import DbNotice from './DbNotice';

function RecurringPage() {
  const { recurring } = useExtras();
  const { accounts, getAccountCurrency, getAccount } = useAccounts();
  const { expenseCategories, incomeCategories, getExpenseCategory, getIncomeCategory } = useCategories();

  const [form, setForm] = useState({
    type: 'expense', label: '', amount: '', category: 'logement',
    account_id: '', day: String(new Date().getDate()), start: getTodayISO(),
  });
  const [error, setError] = useState('');

  const categories = form.type === 'expense' ? expenseCategories : incomeCategories;
  const accountValue = form.account_id || accounts[0]?.id || '';
  const currency = getAccountCurrency(accountValue);

  const setType = (type) =>
    setForm({ ...form, type, category: type === 'expense' ? 'logement' : 'salaire' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return setError('Le libellé est obligatoire.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Le montant doit être positif.');
    const day = Number(form.day);
    if (!day || day < 1 || day > 31) return setError('Le jour doit être entre 1 et 31.');
    const { error: err } = await recurring.add({
      type: form.type,
      label: form.label.trim(),
      amount: Number(form.amount),
      category: form.category,
      account_id: accountValue || null,
      day_of_month: day,
      start_date: form.start,
      active: true,
    });
    if (err) return setError("Impossible d'enregistrer (base de données à mettre à jour ?).");
    setForm({ ...form, label: '', amount: '' });
    setError('');
  };

  return (
    <>
      <DbNotice error={recurring.error} />

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>Nouvelle opération récurrente</h2>
        <p className="hint">
          Ajoutée automatiquement chaque mois à l'ouverture de l'application. Si la date de début est
          passée, les mois écoulés sont ajoutés d'un coup.
        </p>
        {error && <p className="form-error">{error}</p>}

        <div className="segmented">
          <button type="button" className={form.type === 'expense' ? 'on' : ''} onClick={() => setType('expense')}>💸 Dépense</button>
          <button type="button" className={form.type === 'income' ? 'on' : ''} onClick={() => setType('income')}>💵 Revenu</button>
        </div>

        <div className="form-group">
          <label htmlFor="rec-label">Libellé</label>
          <input id="rec-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Ex : Loyer, Salaire, Abonnement..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rec-amount">Montant ({currency.symbol})</label>
            <input id="rec-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="rec-day">Jour du mois</label>
            <input id="rec-day" type="number" min="1" max="31" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rec-cat">Catégorie</label>
            <select id="rec-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
          </div>
          {accounts.length > 0 && (
            <div className="form-group">
              <label htmlFor="rec-acc">Compte</label>
              <select id="rec-acc" value={accountValue} onChange={(e) => setForm({ ...form, account_id: e.target.value })}>
                {accounts.map((a) => (<option key={a.id} value={a.id}>{a.name} ({a.currency})</option>))}
              </select>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="rec-start">À partir du</label>
          <input id="rec-start" type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
        </div>
        <button type="submit">Programmer</button>
      </form>

      {recurring.rows.length === 0 ? (
        <div className="expense-list-empty"><p>Aucune opération récurrente.</p></div>
      ) : (
        <section className="expense-list-section">
          <div className="expense-list-header"><h2>Programmées ({recurring.rows.length})</h2></div>
          <ul className="expense-list">
            {recurring.rows.map((r) => {
              const cat = r.type === 'expense' ? getExpenseCategory(r.category) : getIncomeCategory(r.category);
              return (
                <li key={r.id} className={`expense-item ${r.active ? '' : 'is-paused'}`}>
                  <span className="expense-category-badge" style={{ backgroundColor: cat.color }}>{cat.label}</span>
                  <div className="expense-info">
                    <p className="expense-label">{r.label}</p>
                    <p className="expense-date">
                      Le {r.day_of_month} de chaque mois{getAccount(r.account_id) ? ` · ${getAccount(r.account_id).name}` : ''}
                    </p>
                  </div>
                  <span className={`expense-amount ${r.type === 'income' ? 'income-amount' : ''}`}>
                    {r.type === 'income' ? '+ ' : '− '}{formatAmount(r.amount, getAccountCurrency(r.account_id))}
                  </span>
                  <button type="button" className="expense-edit-btn" onClick={() => recurring.update(r.id, { active: !r.active })} aria-label={r.active ? 'Mettre en pause' : 'Réactiver'}>
                    {r.active ? '⏸️' : '▶️'}
                  </button>
                  <button type="button" className="expense-delete-btn" onClick={() => window.confirm(`Supprimer "${r.label}" ? (les opérations déjà ajoutées sont conservées)`) && recurring.remove(r.id)} aria-label="Supprimer">🗑️</button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}

export default RecurringPage;

import { useState } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { formatAmount, getTodayISO } from '../utils/formatters';
import DbNotice from './DbNotice';
import { intervalOf } from '../utils/recurrence';
import { t } from '../i18n';

const UNIT_LABELS = { day: 'jour(s)', week: 'semaine(s)', month: 'mois', year: 'an(s)' };

function describeRecurrence(r) {
  const { count, unit } = intervalOf(r);
  let text;
  if (unit === 'month') {
    text = count === 1
      ? t('Chaque mois, le {day}', { day: r.day_of_month })
      : t('Tous les {n} mois, le {day}', { n: count, day: r.day_of_month });
  } else if (unit === 'year') {
    text = count === 1 ? t('Chaque année') : t('Tous les {n} ans', { n: count });
  } else if (unit === 'week') {
    text = count === 1 ? t('Chaque semaine') : t('Toutes les {n} semaines', { n: count });
  } else {
    text = count === 1 ? t('Chaque jour') : t('Tous les {n} jours', { n: count });
  }
  return text;
}

function RecurringPage() {
  const { recurring } = useExtras();
  const { accounts, getAccountCurrency, getAccount } = useAccounts();
  const { expenseCategories, incomeCategories, getExpenseCategory, getIncomeCategory } = useCategories();

  const [form, setForm] = useState({
    type: 'expense', label: '', amount: '', category: 'logement',
    account_id: '', day: String(new Date().getDate()), start: getTodayISO(),
    every: '1', unit: 'month', date_mode: 'exact',
  });
  const [error, setError] = useState('');

  const categories = form.type === 'expense' ? expenseCategories : incomeCategories;
  const usesDay = form.unit === 'month' || form.unit === 'year';
  const accountValue = form.account_id || accounts[0]?.id || '';
  const currency = getAccountCurrency(accountValue);

  const setType = (type) =>
    setForm({ ...form, type, date_mode: type === 'expense' ? form.date_mode : 'exact', category: type === 'expense' ? 'logement' : 'salaire' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return setError(t('Le libellé est obligatoire.'));
    if (!form.amount || Number(form.amount) <= 0) return setError(t('Le montant doit être positif.'));
    const every = Math.floor(Number(form.every));
    if (!every || every < 1) return setError(t('Indiquez un intervalle d\'au moins 1.'));
    const day = usesDay ? Number(form.day) : Number(form.start.slice(8, 10));
    if (!day || day < 1 || day > 31) return setError(t('Le jour doit être entre 1 et 31.'));
    const { error: err } = await recurring.add({
      type: form.type,
      label: form.label.trim(),
      amount: Number(form.amount),
      category: form.category,
      account_id: accountValue || null,
      day_of_month: day,
      start_date: form.start,
      active: true,
      // Envoyés seulement si ≠ mensuel : un ancien schéma continue de fonctionner pour « chaque mois ».
      ...(every !== 1 || form.unit !== 'month' ? { interval_count: every, interval_unit: form.unit } : {}),
      ...(form.type === 'expense' && form.date_mode === 'deadline' ? { date_mode: 'deadline' } : {}),
    });
    if (err) return setError(t("Impossible d'enregistrer (base de données à mettre à jour ?)."));
    setForm({ ...form, label: '', amount: '' });
    setError('');
  };

  return (
    <>
      <DbNotice error={recurring.error} />

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>{t('Nouvelle opération récurrente')}</h2>
        <p className="hint">
          {t("Ajoutée automatiquement à chaque échéance, à l'ouverture de l'application. Si la date de début est passée, les échéances écoulées sont ajoutées d'un coup.")}
        </p>
        {error && <p className="form-error">{error}</p>}

        <div className="segmented">
          <button type="button" className={form.type === 'expense' ? 'on' : ''} onClick={() => setType('expense')}>💸 {t('Dépense')}</button>
          <button type="button" className={form.type === 'income' ? 'on' : ''} onClick={() => setType('income')}>💵 {t('Revenu')}</button>
        </div>

        <div className="form-group">
          <label htmlFor="rec-label">{t('Libellé')}</label>
          <input id="rec-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t('Ex : Loyer, Bourse, Salaire, Abonnement...')} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rec-amount">{t('Montant')} ({currency.symbol})</label>
            <input id="rec-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="rec-start">{t('Première échéance')}</label>
            <input id="rec-start" type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value, day: e.target.value ? String(Number(e.target.value.slice(8, 10))) : form.day })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rec-every">{t('Répéter tous les')}</label>
            <input id="rec-every" type="number" min="1" step="1" value={form.every} onChange={(e) => setForm({ ...form, every: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="rec-unit">{t('Unité')}</label>
            <select id="rec-unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              {Object.entries(UNIT_LABELS).map(([id, label]) => (<option key={id} value={id}>{t(label)}</option>))}
            </select>
          </div>
        </div>
        {form.type === 'expense' && (
          <div className="form-group">
            <span className="field-label">{t('Échéance')}</span>
            <div className="segmented segmented-small">
              <button type="button" className={form.date_mode === 'exact' ? 'on' : ''} onClick={() => setForm({ ...form, date_mode: 'exact' })}>
                📅 {t('Date précise')}
              </button>
              <button type="button" className={form.date_mode === 'deadline' ? 'on' : ''} onClick={() => setForm({ ...form, date_mode: 'deadline' })}>
                ⏳ {t('Au plus tard')}
              </button>
            </div>
            <p className="hint">
              {form.date_mode === 'deadline'
                ? t("À chaque échéance, la dépense apparaît dans « À venir » avec une date limite : vous la payez quand vous voulez avant cette date, puis vous la marquez comme payée.")
                : t("La dépense est ajoutée automatiquement, comme déjà payée, à la date indiquée.")}
            </p>
          </div>
        )}
        {usesDay && (
          <div className="form-group">
            <label htmlFor="rec-day">{t('Jour du mois')}</label>
            <input id="rec-day" type="number" min="1" max="31" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
          </div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rec-cat">{t('Catégorie')}</label>
            <select id="rec-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
          </div>
          {accounts.length > 0 && (
            <div className="form-group">
              <label htmlFor="rec-acc">{t('Compte')}</label>
              <select id="rec-acc" value={accountValue} onChange={(e) => setForm({ ...form, account_id: e.target.value })}>
                {accounts.map((a) => (<option key={a.id} value={a.id}>{a.name} ({a.currency})</option>))}
              </select>
            </div>
          )}
        </div>
        <button type="submit">{t('Programmer')}</button>
      </form>

      {recurring.rows.length === 0 ? (
        <div className="expense-list-empty"><p>{t('Aucune opération récurrente.')}</p></div>
      ) : (
        <section className="expense-list-section">
          <div className="expense-list-header"><h2>{t('Programmées ({count})', { count: recurring.rows.length })}</h2></div>
          <ul className="expense-list">
            {recurring.rows.map((r) => {
              const cat = r.type === 'expense' ? getExpenseCategory(r.category) : getIncomeCategory(r.category);
              return (
                <li key={r.id} className={`expense-item ${r.active ? '' : 'is-paused'}`}>
                  <span className="expense-category-badge" style={{ backgroundColor: cat.color }}>{cat.label}</span>
                  <div className="expense-info">
                    <p className="expense-label">{r.label}</p>
                    <p className="expense-date">
                      {describeRecurrence(r)}{r.date_mode === 'deadline' ? ` · ⏳ ${t('au plus tard')}` : ''}{getAccount(r.account_id) ? ` · ${getAccount(r.account_id).name}` : ''}
                    </p>
                  </div>
                  <span className={`expense-amount ${r.type === 'income' ? 'income-amount' : ''}`}>
                    {r.type === 'income' ? '+ ' : '− '}{formatAmount(r.amount, getAccountCurrency(r.account_id))}
                  </span>
                  <button type="button" className="expense-edit-btn" onClick={() => recurring.update(r.id, { active: !r.active })} aria-label={r.active ? t('Mettre en pause') : t('Réactiver')}>
                    {r.active ? '⏸️' : '▶️'}
                  </button>
                  <button type="button" className="expense-delete-btn" onClick={() => window.confirm(t('Supprimer "{label}" ? (les opérations déjà ajoutées sont conservées)', { label: r.label })) && recurring.remove(r.id)} aria-label={t('Supprimer')}>🗑️</button>
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

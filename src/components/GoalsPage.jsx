import { useState } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useCurrency } from '../hooks/useCurrency';
import { CURRENCIES, getCurrencyByCode } from '../data/currencies';
import { formatAmount, formatDate, getTodayISO } from '../utils/formatters';
import DbNotice from './DbNotice';
import { t } from '../i18n';

function monthsUntil(deadline) {
  const now = new Date(getTodayISO());
  const end = new Date(deadline);
  const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
  return Math.max(1, months);
}

function GoalCard({ goal, onContribute, onDelete }) {
  const [value, setValue] = useState('');
  const currency = getCurrencyByCode(goal.currency);
  const target = Number(goal.target_amount);
  const saved = Number(goal.saved_amount);
  const remaining = Math.max(0, target - saved);
  const pct = Math.min(100, (saved / target) * 100);
  const done = saved >= target;

  const submit = (sign) => {
    const n = Number(value);
    if (!n || n <= 0) return;
    onContribute(goal, sign * n);
    setValue('');
  };

  return (
    <li className="goal-card">
      <div className="goal-head">
        <div>
          <p className="expense-label">{done ? '🎉 ' : '🎯 '}{goal.name}</p>
          <p className="expense-date">
            {goal.deadline ? t('Échéance : {date}', { date: formatDate(goal.deadline) }) : t('Sans échéance')}
          </p>
        </div>
        <button type="button" className="expense-delete-btn" onClick={() => window.confirm(t('Supprimer l\'objectif "{name}" ?', { name: goal.name })) && onDelete(goal.id)} aria-label={t("Supprimer l'objectif")}>🗑️</button>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${done ? 'done' : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="goal-figures">
        <span><strong>{formatAmount(saved, currency)}</strong> / {formatAmount(target, currency)}</span>
        <span>{pct.toFixed(0)} %</span>
      </div>
      {!done && goal.deadline && (
        <p className="hint">
          {t('Pour y arriver : environ {amount} / mois.', { amount: formatAmount(remaining / monthsUntil(goal.deadline), currency) })}
        </p>
      )}
      <div className="inline-add">
        <input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`${t('Montant')} (${currency.symbol})`} />
        <button type="button" onClick={() => submit(1)}>{t('Ajouter')}</button>
        <button type="button" className="secondary" onClick={() => submit(-1)}>{t('Retirer')}</button>
      </div>
    </li>
  );
}

function GoalsPage() {
  const { goals } = useExtras();
  const { currencyCode } = useCurrency();
  const [form, setForm] = useState({ name: '', target: '', saved: '', currency: currencyCode, deadline: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError(t("Donnez un nom à l'objectif."));
    if (!form.target || Number(form.target) <= 0) return setError(t('Le montant cible doit être positif.'));
    const { error: err } = await goals.add({
      name: form.name.trim(),
      target_amount: Number(form.target),
      saved_amount: Number(form.saved) || 0,
      currency: form.currency,
      deadline: form.deadline || null,
    });
    if (err) return setError(t("Impossible d'enregistrer l'objectif (base de données à mettre à jour ?)."));
    setForm({ ...form, name: '', target: '', saved: '', deadline: '' });
    setError('');
  };

  const handleContribute = (goal, delta) => {
    const next = Math.max(0, Number(goal.saved_amount) + delta);
    goals.update(goal.id, { saved_amount: next });
  };

  return (
    <>
      <DbNotice error={goals.error} />

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>{t("Nouvel objectif d'épargne")}</h2>
        {error && <p className="form-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="goal-name">{t('Objectif')}</label>
          <input id="goal-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("Ex : Ordinateur portable, Voyage, Fonds d'urgence")} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="goal-target">{t('Montant cible')}</label>
            <input id="goal-target" type="number" min="0" step="0.01" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="goal-cur">{t('Devise')}</label>
            <select id="goal-cur" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              {CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.symbol} — {t(c.label)}</option>))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="goal-saved">{t('Déjà épargné')}</label>
            <input id="goal-saved" type="number" min="0" step="0.01" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value })} placeholder="0" />
          </div>
          <div className="form-group">
            <label htmlFor="goal-deadline">{t('Échéance (facultatif)')}</label>
            <input id="goal-deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>
        <button type="submit">{t("Créer l'objectif")}</button>
      </form>

      {goals.rows.length === 0 ? (
        <div className="expense-list-empty"><p>{t('Aucun objectif pour le moment.')}</p></div>
      ) : (
        <ul className="expense-list">
          {goals.rows.map((g) => (
            <GoalCard key={g.id} goal={g} onContribute={handleContribute} onDelete={goals.remove} />
          ))}
        </ul>
      )}
    </>
  );
}

export default GoalsPage;

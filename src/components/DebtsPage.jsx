import { useMemo, useState } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useCurrency } from '../hooks/useCurrency';
import { CURRENCIES, getCurrencyByCode } from '../data/currencies';
import { formatAmount, formatDate } from '../utils/formatters';
import DbNotice from './DbNotice';

function DebtCard({ debt, onPay, onDelete }) {
  const [value, setValue] = useState('');
  const currency = getCurrencyByCode(debt.currency);
  const amount = Number(debt.amount);
  const paid = Number(debt.paid_amount);
  const left = Math.max(0, amount - paid);
  const settled = left === 0;
  const late = !settled && debt.due_date && debt.due_date < new Date().toISOString().slice(0, 10);

  const pay = () => {
    const n = Number(value);
    if (!n || n <= 0) return;
    onPay(debt, n);
    setValue('');
  };

  return (
    <li className={`goal-card ${settled ? 'is-paused' : ''}`}>
      <div className="goal-head">
        <div>
          <p className="expense-label">{debt.direction === 'owed_to_me' ? '⬅️' : '➡️'} {debt.person}</p>
          <p className="expense-date">
            {debt.due_date ? `Échéance : ${formatDate(debt.due_date)}` : 'Sans échéance'}
            {late ? ' · ⚠️ en retard' : ''}
            {debt.note ? ` · ${debt.note}` : ''}
          </p>
        </div>
        <button type="button" className="expense-delete-btn" onClick={() => window.confirm('Supprimer cette dette ?') && onDelete(debt.id)} aria-label="Supprimer">🗑️</button>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${settled ? 'done' : ''}`} style={{ width: `${Math.min(100, (paid / amount) * 100)}%` }} />
      </div>
      <div className="goal-figures">
        <span>{settled ? '✅ Soldée' : <>Reste <strong>{formatAmount(left, currency)}</strong></>}</span>
        <span>{formatAmount(paid, currency)} / {formatAmount(amount, currency)}</span>
      </div>
      {!settled && (
        <div className="inline-add">
          <input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Paiement (${currency.symbol})`} />
          <button type="button" onClick={pay}>Enregistrer</button>
        </div>
      )}
    </li>
  );
}

function DebtsPage() {
  const { debts } = useExtras();
  const { currencyCode } = useCurrency();
  const [form, setForm] = useState({
    person: '', direction: 'owed_to_me', amount: '', currency: currencyCode, due: '', note: '',
  });
  const [error, setError] = useState('');

  const totals = useMemo(() => {
    const t = {};
    debts.rows.forEach((d) => {
      const left = Math.max(0, Number(d.amount) - Number(d.paid_amount));
      if (!left) return;
      t[d.currency] = t[d.currency] || { owed_to_me: 0, i_owe: 0 };
      t[d.currency][d.direction] += left;
    });
    return Object.entries(t);
  }, [debts.rows]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.person.trim()) return setError('Indiquez la personne concernée.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Le montant doit être positif.');
    const { error: err } = await debts.add({
      person: form.person.trim(),
      direction: form.direction,
      amount: Number(form.amount),
      currency: form.currency,
      due_date: form.due || null,
      note: form.note.trim() || null,
    });
    if (err) return setError("Impossible d'enregistrer (base de données à mettre à jour ?).");
    setForm({ ...form, person: '', amount: '', due: '', note: '' });
    setError('');
  };

  const handlePay = (debt, n) => {
    const paid = Math.min(Number(debt.amount), Number(debt.paid_amount) + n);
    debts.update(debt.id, { paid_amount: paid });
  };

  const owedToMe = debts.rows.filter((d) => d.direction === 'owed_to_me');
  const iOwe = debts.rows.filter((d) => d.direction === 'i_owe');

  return (
    <>
      <DbNotice error={debts.error} />

      {totals.length > 0 && (
        <section className="summary">
          <h2>Bilan des dettes</h2>
          {totals.map(([code, v]) => {
            const cur = getCurrencyByCode(code);
            return (
              <div key={code} className="debt-totals">
                <span className="balance-income-text">On me doit : {formatAmount(v.owed_to_me, cur)}</span>
                <span className="balance-expense-text">Je dois : {formatAmount(v.i_owe, cur)}</span>
              </div>
            );
          })}
        </section>
      )}

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>Nouvelle dette / prêt</h2>
        {error && <p className="form-error">{error}</p>}
        <div className="segmented">
          <button type="button" className={form.direction === 'owed_to_me' ? 'on' : ''} onClick={() => setForm({ ...form, direction: 'owed_to_me' })}>On me doit</button>
          <button type="button" className={form.direction === 'i_owe' ? 'on' : ''} onClick={() => setForm({ ...form, direction: 'i_owe' })}>Je dois</button>
        </div>
        <div className="form-group">
          <label htmlFor="debt-person">Personne</label>
          <input id="debt-person" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} placeholder="Nom" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="debt-amount">Montant</label>
            <input id="debt-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="debt-cur">Devise</label>
            <select id="debt-cur" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              {CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.symbol} — {c.label}</option>))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="debt-due">Échéance (facultatif)</label>
            <input id="debt-due" type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="debt-note">Note (facultatif)</label>
            <input id="debt-note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
        </div>
        <button type="submit">Enregistrer</button>
      </form>

      {debts.rows.length === 0 && <div className="expense-list-empty"><p>Aucune dette enregistrée.</p></div>}

      {owedToMe.length > 0 && (
        <>
          <h2 className="section-title">On me doit</h2>
          <ul className="expense-list">
            {owedToMe.map((d) => (<DebtCard key={d.id} debt={d} onPay={handlePay} onDelete={debts.remove} />))}
          </ul>
        </>
      )}
      {iOwe.length > 0 && (
        <>
          <h2 className="section-title">Je dois</h2>
          <ul className="expense-list">
            {iOwe.map((d) => (<DebtCard key={d.id} debt={d} onPay={handlePay} onDelete={debts.remove} />))}
          </ul>
        </>
      )}
    </>
  );
}

export default DebtsPage;

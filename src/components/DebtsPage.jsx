import { useMemo, useState } from 'react';
import { useExtras } from '../hooks/useExtras';
import { useAccounts } from '../hooks/useAccounts';
import { useCurrency } from '../hooks/useCurrency';
import { CURRENCIES, getCurrencyByCode } from '../data/currencies';
import { formatAmount, formatDate, getTodayISO } from '../utils/formatters';
import DbNotice from './DbNotice';
import { t } from '../i18n';

function DebtCard({ debt, accounts, balances, payments, onPay, onUndo, onDelete }) {
  const [value, setValue] = useState('');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [err, setErr] = useState('');
  const mine = debt.direction === 'i_owe';
  const usable = accounts.filter((a) => a.currency === debt.currency);
  const currency = getCurrencyByCode(debt.currency);
  const amount = Number(debt.amount);
  const paid = Number(debt.paid_amount);
  const left = Math.max(0, amount - paid);
  const settled = left === 0;
  const late = !settled && debt.due_date && debt.due_date < new Date().toISOString().slice(0, 10);

  const pay = async () => {
    const n = Number(value);
    if (!n || n <= 0) return setErr(t('Le montant doit être positif.'));
    if (n > left + 0.0001) return setErr(t('Le montant dépasse le reste à régler.'));
    if (!accountId) return setErr(mine ? t("Choisissez le compte d'où l'argent sort.") : t("Choisissez le compte qui reçoit l'argent."));
    const res = await onPay(debt, n, accountId, date);
    if (res?.error) return setErr(t("Impossible d'enregistrer le règlement (base de données à mettre à jour ?)."));
    setValue('');
    setErr('');
  };

  return (
    <li className={`goal-card ${settled ? 'is-paused' : ''}`}>
      <div className="goal-head">
        <div>
          <p className="expense-label">{debt.direction === 'owed_to_me' ? '⬅️' : '➡️'} {debt.person}</p>
          <p className="expense-date">
            {debt.due_date ? t('Échéance : {date}', { date: formatDate(debt.due_date) }) : t('Sans échéance')}
            {late ? ` · ⚠️ ${t('en retard')}` : ''}
            {debt.note ? ` · ${debt.note}` : ''}
          </p>
        </div>
        <button type="button" className="expense-delete-btn" onClick={() => window.confirm(t('Supprimer cette dette ? Ses règlements seront aussi annulés sur vos comptes.')) && onDelete(debt.id)} aria-label={t('Supprimer')}>🗑️</button>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${settled ? 'done' : ''}`} style={{ width: `${Math.min(100, (paid / amount) * 100)}%` }} />
      </div>
      <div className="goal-figures">
        <span>{settled ? `✅ ${t('Soldée')}` : <>{t('Reste')} <strong>{formatAmount(left, currency)}</strong></>}</span>
        <span>{formatAmount(paid, currency)} / {formatAmount(amount, currency)}</span>
      </div>
      {payments.length > 0 && (
        <ul className="debt-payments">
          {payments.map((p) => (
            <li key={p.id}>
              <span>{formatDate(p.date)} · {formatAmount(Number(p.amount), currency)} · {accounts.find((a) => a.id === p.account_id)?.name || '—'}</span>
              <button type="button" className="expense-delete-btn" onClick={() => window.confirm(t('Annuler ce règlement ?')) && onUndo(debt, p)} aria-label={t('Annuler ce règlement')}>↩️</button>
            </li>
          ))}
        </ul>
      )}
      {!settled && (
        <div className="debt-pay">
          <p className="field-label">{mine ? t("Je règle cette dette : d'où sort l'argent ?") : t("On me règle : où va l'argent ?")} *</p>
          {err && <p className="form-error">{err}</p>}
          {usable.length === 0 ? (
            <p className="hint">{t('Aucun compte en {currency}. Créez-en un dans « Comptes ».', { currency: debt.currency })}</p>
          ) : (
            <>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} aria-label={t('Compte')}>
                <option value="">{t('Choisir…')}</option>
                {usable.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({formatAmount(balances[a.id] ?? 0, currency)})</option>
                ))}
              </select>
              <div className="inline-add">
                <input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`${t('Montant réglé')} (${currency.symbol})`} />
                <button type="button" className="btn-secondary" onClick={() => setValue(String(left))}>{t('Tout')}</button>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={t('Date')} />
                <button type="button" onClick={pay}>{mine ? t('Payer') : t('Recevoir')}</button>
              </div>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function DebtsPage() {
  const { debts, debtPayments } = useExtras();
  const { accounts, balances } = useAccounts();
  const { currencyCode } = useCurrency();
  const [form, setForm] = useState({
    person: '', direction: 'owed_to_me', amount: '', currency: currencyCode, due: '', note: '',
  });
  const [error, setError] = useState('');

  const totals = useMemo(() => {
    const acc = {};
    debts.rows.forEach((d) => {
      const left = Math.max(0, Number(d.amount) - Number(d.paid_amount));
      if (!left) return;
      acc[d.currency] = acc[d.currency] || { owed_to_me: 0, i_owe: 0 };
      acc[d.currency][d.direction] += left;
    });
    return Object.entries(acc);
  }, [debts.rows]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.person.trim()) return setError(t('Indiquez la personne concernée.'));
    if (!form.amount || Number(form.amount) <= 0) return setError(t('Le montant doit être positif.'));
    const { error: err } = await debts.add({
      person: form.person.trim(),
      direction: form.direction,
      amount: Number(form.amount),
      currency: form.currency,
      due_date: form.due || null,
      note: form.note.trim() || null,
    });
    if (err) return setError(t("Impossible d'enregistrer (base de données à mettre à jour ?)."));
    setForm({ ...form, person: '', amount: '', due: '', note: '' });
    setError('');
  };

  const handlePay = async (debt, n, accountId, date) => {
    const res = await debtPayments.add({ debt_id: debt.id, account_id: accountId, direction: debt.direction, amount: n, date });
    if (res.error) return res;
    const paid = Math.min(Number(debt.amount), Number(debt.paid_amount) + n);
    return debts.update(debt.id, { paid_amount: paid });
  };

  const handleUndo = async (debt, p) => {
    await debtPayments.remove(p.id);
    await debts.update(debt.id, { paid_amount: Math.max(0, Number(debt.paid_amount) - Number(p.amount)) });
  };

  const owedToMe = debts.rows.filter((d) => d.direction === 'owed_to_me');
  const iOwe = debts.rows.filter((d) => d.direction === 'i_owe');

  return (
    <>
      <DbNotice error={debts.error} />
      {debtPayments.error && <DbNotice error={debtPayments.error} script="schema_v6.sql" />}

      {totals.length > 0 && (
        <section className="summary">
          <h2>{t('Bilan des dettes')}</h2>
          {totals.map(([code, v]) => {
            const cur = getCurrencyByCode(code);
            return (
              <div key={code} className="debt-totals">
                <span className="balance-income-text">{t('On me doit : {amount}', { amount: formatAmount(v.owed_to_me, cur) })}</span>
                <span className="balance-expense-text">{t('Je dois : {amount}', { amount: formatAmount(v.i_owe, cur) })}</span>
              </div>
            );
          })}
        </section>
      )}

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>{t('Nouvelle dette / prêt')}</h2>
        {error && <p className="form-error">{error}</p>}
        <div className="segmented">
          <button type="button" className={form.direction === 'owed_to_me' ? 'on' : ''} onClick={() => setForm({ ...form, direction: 'owed_to_me' })}>{t('On me doit')}</button>
          <button type="button" className={form.direction === 'i_owe' ? 'on' : ''} onClick={() => setForm({ ...form, direction: 'i_owe' })}>{t('Je dois')}</button>
        </div>
        <div className="form-group">
          <label htmlFor="debt-person">{t('Personne')}</label>
          <input id="debt-person" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} placeholder={t('Nom')} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="debt-amount">{t('Montant')}</label>
            <input id="debt-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="debt-cur">{t('Devise')}</label>
            <select id="debt-cur" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              {CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.symbol} — {t(c.label)}</option>))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="debt-due">{t('Échéance (facultatif)')}</label>
            <input id="debt-due" type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="debt-note">{t('Note (facultatif)')}</label>
            <input id="debt-note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
        </div>
        <button type="submit">{t('Enregistrer')}</button>
      </form>

      {debts.rows.length === 0 && <div className="expense-list-empty"><p>{t('Aucune dette enregistrée.')}</p></div>}

      {owedToMe.length > 0 && (
        <>
          <h2 className="section-title">{t('On me doit')}</h2>
          <ul className="expense-list">
            {owedToMe.map((d) => (<DebtCard key={d.id} debt={d} accounts={accounts} balances={balances} payments={debtPayments.rows.filter((p) => p.debt_id === d.id)} onPay={handlePay} onUndo={handleUndo} onDelete={debts.remove} />))}
          </ul>
        </>
      )}
      {iOwe.length > 0 && (
        <>
          <h2 className="section-title">{t('Je dois')}</h2>
          <ul className="expense-list">
            {iOwe.map((d) => (<DebtCard key={d.id} debt={d} accounts={accounts} balances={balances} payments={debtPayments.rows.filter((p) => p.debt_id === d.id)} onPay={handlePay} onUndo={handleUndo} onDelete={debts.remove} />))}
          </ul>
        </>
      )}
    </>
  );
}

export default DebtsPage;

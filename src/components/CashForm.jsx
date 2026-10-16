import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { formatAmount, getTodayISO } from '../utils/formatters';
import { t } from '../i18n';

const isCash = (a) => a.type === 'especes';

/**
 * Retrait (banque → espèces) et dépôt (espèces → banque).
 * C'est un virement entre deux comptes de même devise : aucun frais, et ce n'est pas une dépense.
 */
function CashForm() {
  const { accounts, balances, getAccountCurrency, addAccount, addTransfer } = useAccounts();
  const [mode, setMode] = useState('withdraw');
  const [bankId, setBankId] = useState('');
  const [cashId, setCashId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const banks = accounts.filter((a) => !isCash(a));
  if (banks.length === 0) return null;

  const bank = banks.find((a) => a.id === bankId) || banks[0];
  const cashAccounts = accounts.filter((a) => isCash(a) && a.currency === bank.currency);
  const cash = cashAccounts.find((a) => a.id === cashId) || cashAccounts[0];
  const cur = getAccountCurrency(bank.id);
  const withdraw = mode === 'withdraw';

  const submit = async (e) => {
    e.preventDefault();
    setDone('');
    const value = Number(amount);
    if (!value || value <= 0) return setError(t('Le montant doit être positif.'));
    if (!date) return setError(t('La date est obligatoire.'));

    let cashAccount = cash;
    if (!cashAccount) {
      const cashName = t('Espèces');
      const res = await addAccount({ name: cashName, type: 'especes', currency: bank.currency, initial_balance: 0 });
      if (res.error) return setError(t("Impossible de créer le compte Espèces."));
      cashAccount = res.data;
    }
    const { error: err } = await addTransfer({
      from_account_id: withdraw ? bank.id : cashAccount.id,
      to_account_id: withdraw ? cashAccount.id : bank.id,
      amount: value,
      to_amount: value,
      date,
    });
    if (err) return setError(t("Impossible d'enregistrer le virement."));
    setError('');
    setAmount('');
    setDone(
      withdraw
        ? t('Retrait de {amount} enregistré : il est maintenant dans « {cash} ».', { amount: formatAmount(value, cur), cash: cashAccount.name })
        : t('Dépôt de {amount} enregistré dans « {bank} ».', { amount: formatAmount(value, cur), bank: bank.name })
    );
  };

  return (
    <form className="expense-form cash-form" onSubmit={submit}>
      <h2>💵 {t("Retrait / dépôt d'espèces")}</h2>
      <p className="hint">
        {t("Vous retirez de l'argent à la banque pour payer en espèces ? Enregistrez-le ici : le solde de la banque baisse, et l'argent que vous avez sur vous est suivi dans votre compte Espèces. Sans frais, et ce n'est pas une dépense.")}
      </p>
      {error && <p className="form-error">{error}</p>}
      {done && <p className="form-success">{done}</p>}
      <div className="segmented">
        <button type="button" className={withdraw ? 'on' : ''} onClick={() => setMode('withdraw')}>
          ⬇️ {t('Retrait (banque → espèces)')}
        </button>
        <button type="button" className={!withdraw ? 'on' : ''} onClick={() => setMode('deposit')}>
          ⬆️ {t('Dépôt (espèces → banque)')}
        </button>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cash-bank">{t('Compte bancaire')}</label>
          <select id="cash-bank" value={bank.id} onChange={(e) => { setBankId(e.target.value); setCashId(''); }}>
            {banks.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.currency}) — {formatAmount(balances[a.id] ?? 0, getAccountCurrency(a.id))}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cash-cash">{t('Compte espèces')}</label>
          {cashAccounts.length > 1 ? (
            <select id="cash-cash" value={cash.id} onChange={(e) => setCashId(e.target.value)}>
              {cashAccounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {formatAmount(balances[a.id] ?? 0, getAccountCurrency(a.id))}</option>
              ))}
            </select>
          ) : cash ? (
            <p className="cash-fixed">💵 {cash.name} — {formatAmount(balances[cash.id] ?? 0, getAccountCurrency(cash.id))}</p>
          ) : (
            <p className="cash-fixed">💵 {t('Un compte « Espèces » ({currency}) sera créé automatiquement.', { currency: bank.currency })}</p>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cash-amount">{t('Montant')} ({bank.currency})</label>
          <input id="cash-amount" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="cash-date">{t('Date')}</label>
          <input id="cash-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <button type="submit">{withdraw ? t('Enregistrer le retrait') : t('Enregistrer le dépôt')}</button>
    </form>
  );
}

export default CashForm;

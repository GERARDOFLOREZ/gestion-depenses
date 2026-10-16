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
  const [dest, setDest] = useState('');
  const [newName, setNewName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const banks = accounts.filter((a) => !isCash(a));
  if (banks.length === 0) return null;

  const bank = banks.find((a) => a.id === bankId) || banks[0];
  const cashAccounts = accounts.filter((a) => isCash(a) && a.currency === bank.currency);
  const cash = cashAccounts.find((a) => a.id === cashId) || (cashAccounts.length === 1 ? cashAccounts[0] : null);
  // Destinations possibles d'un retrait : tout autre compte de même devise (espèces en premier).
  const destinations = [
    ...cashAccounts,
    ...accounts.filter((a) => !isCash(a) && a.id !== bank.id && a.currency === bank.currency),
  ];
  const cur = getAccountCurrency(bank.id);
  const withdraw = mode === 'withdraw';

  const submit = async (e) => {
    e.preventDefault();
    setDone('');
    const value = Number(amount);
    if (!value || value <= 0) return setError(t('Le montant doit être positif.'));
    if (!date) return setError(t('La date est obligatoire.'));

    let target = null; // compte qui reçoit le retrait / qui donne pour le dépôt
    if (withdraw) {
      if (!dest) return setError(t('Choisissez où va l\'argent retiré.'));
      if (dest === 'new') {
        const res = await addAccount({ name: newName.trim() || t('Espèces'), type: 'especes', currency: bank.currency, initial_balance: 0 });
        if (res.error) return setError(t('Impossible de créer le compte Espèces.'));
        target = res.data;
      } else {
        target = accounts.find((a) => a.id === dest);
      }
    } else {
      if (!cash) return setError(t('Choisissez le compte espèces à déposer.'));
      target = cash;
    }
    const cashAccount = target;
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
    setDest('');
    setNewName('');
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
          <select id="cash-bank" value={bank.id} onChange={(e) => { setBankId(e.target.value); setCashId(''); setDest(''); }}>
            {banks.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.currency}) — {formatAmount(balances[a.id] ?? 0, getAccountCurrency(a.id))}</option>
            ))}
          </select>
        </div>
        {withdraw ? (
          <div className="form-group">
            <label htmlFor="cash-dest">{t("Où va l'argent retiré ?")} *</label>
            <select id="cash-dest" value={dest} onChange={(e) => setDest(e.target.value)} required>
              <option value="">{t('Choisir…')}</option>
              <option value="new">➕ {t('Nouveau compte espèces')}</option>
              {destinations.map((a) => (
                <option key={a.id} value={a.id}>
                  {isCash(a) ? '💵' : '🏦'} {a.name} ({formatAmount(balances[a.id] ?? 0, getAccountCurrency(a.id))})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="cash-cash">{t('Compte espèces')} *</label>
            <select id="cash-cash" value={cash ? cash.id : ''} onChange={(e) => setCashId(e.target.value)} required>
              <option value="">{t('Choisir…')}</option>
              {cashAccounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {formatAmount(balances[a.id] ?? 0, getAccountCurrency(a.id))}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {withdraw && dest === 'new' && (
        <div className="form-group">
          <label htmlFor="cash-new-name">{t('Nom du nouveau compte espèces')}</label>
          <input id="cash-new-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('Espèces')} />
        </div>
      )}
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

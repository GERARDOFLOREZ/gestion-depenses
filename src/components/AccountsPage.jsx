import { useContext, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { IncomeContext } from '../context/IncomeContext';
import { useAccounts, ACCOUNT_TYPES } from '../hooks/useAccounts';
import { useCurrency } from '../hooks/useCurrency';
import { CURRENCIES } from '../data/currencies';
import { formatAmount, formatDate, getTodayISO } from '../utils/formatters';
import AccountBalances from './AccountBalances';
import CurrencySelector from './CurrencySelector';
import DbNotice from './DbNotice';
import CashForm from './CashForm';
import { t } from '../i18n';

function AccountsPage() {
  const expenseCtx = useContext(ExpenseContext);
  const incomeCtx = useContext(IncomeContext);
  const {
    accounts, error, addAccount, removeAccount,
    transfers, addTransfer, removeTransfer, getAccount, getAccountCurrency,
  } = useAccounts();
  const { currencyCode } = useCurrency();

  const [acc, setAcc] = useState({ name: '', type: 'courant', currency: currencyCode, initial: '' });
  const [accError, setAccError] = useState('');
  const [tr, setTr] = useState({ from: '', to: '', amount: '', toAmount: '', date: getTodayISO() });
  const [trError, setTrError] = useState('');

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!acc.name.trim()) return setAccError(t('Le nom du compte est obligatoire.'));
    const { error: err } = await addAccount({
      name: acc.name.trim(),
      type: acc.type,
      currency: acc.currency,
      initial_balance: Number(acc.initial) || 0,
    });
    if (err) return setAccError(t("Impossible de créer le compte (base de données à mettre à jour ?)."));
    setAcc({ ...acc, name: '', initial: '' });
    setAccError('');
  };

  const handleDeleteAccount = async (account) => {
    const ok = window.confirm(
      t("Supprimer le compte \"{name}\" ?\nSes dépenses et revenus seront conservés mais n'auront plus de compte.", { name: account.name })
    );
    if (!ok) return;
    await removeAccount(account.id);
    expenseCtx.refetch();
    incomeCtx.refetch();
  };

  const from = getAccount(tr.from);
  const to = getAccount(tr.to);
  const crossCurrency = from && to && from.currency !== to.currency;

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!tr.from || !tr.to) return setTrError(t('Choisissez les deux comptes.'));
    if (tr.from === tr.to) return setTrError(t('Les deux comptes doivent être différents.'));
    if (!tr.amount || Number(tr.amount) <= 0) return setTrError(t('Le montant doit être positif.'));
    if (crossCurrency && (!tr.toAmount || Number(tr.toAmount) <= 0)) {
      return setTrError(t('Indiquez le montant reçu (devises différentes).'));
    }
    const { error: err } = await addTransfer({
      from_account_id: tr.from,
      to_account_id: tr.to,
      amount: Number(tr.amount),
      to_amount: crossCurrency ? Number(tr.toAmount) : Number(tr.amount),
      date: tr.date,
    });
    if (err) return setTrError(t("Impossible d'enregistrer le virement."));
    setTr({ ...tr, amount: '', toAmount: '' });
    setTrError('');
  };

  // Retrait / dépôt = virement entre une banque et un compte espèces.
  const kindOf = (tf) => {
    const a = getAccount(tf.from_account_id);
    const b = getAccount(tf.to_account_id);
    if (a && b && a.type !== 'especes' && b.type === 'especes') return { label: t('Retrait'), color: '#F9A825' };
    if (a && b && a.type === 'especes' && b.type !== 'especes') return { label: t('Dépôt'), color: '#00897B' };
    return { label: t('Virement'), color: '#607D8B' };
  };

  return (
    <>
      <DbNotice error={error} />

      <section className="summary">
        <h2>{t('Devise principale')}</h2>
        <p className="hint">
          {t('Utilisée par défaut pour les nouveaux comptes et pour vos budgets.')}
        </p>
        <CurrencySelector />
      </section>

      <AccountBalances onDelete={handleDeleteAccount} />

      <CashForm />

      <form className="expense-form" onSubmit={handleAddAccount}>
        <h2>{t('Ajouter un compte')}</h2>
        {accError && <p className="form-error">{accError}</p>}
        <div className="form-group">
          <label htmlFor="acc-name">{t('Nom')}</label>
          <input id="acc-name" value={acc.name} onChange={(e) => setAcc({ ...acc, name: e.target.value })} placeholder={t('Ex : Attijariwafa, Orange Money, Cash...')} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="acc-type">{t('Type')}</label>
            <select id="acc-type" value={acc.type} onChange={(e) => setAcc({ ...acc, type: e.target.value })}>
              {ACCOUNT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>{type.icon} {t(type.label)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="acc-cur">{t('Devise')}</label>
            <select id="acc-cur" value={acc.currency} onChange={(e) => setAcc({ ...acc, currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol} — {t(c.label)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="acc-init">{t('Solde de départ')}</label>
          <input id="acc-init" type="number" step="0.01" value={acc.initial} onChange={(e) => setAcc({ ...acc, initial: e.target.value })} placeholder="0" />
        </div>
        <button type="submit">{t('Ajouter le compte')}</button>
      </form>

      {accounts.length >= 2 && (
        <form className="expense-form" onSubmit={handleTransfer}>
          <h2>{t('Virement entre comptes')}</h2>
          {trError && <p className="form-error">{trError}</p>}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tr-from">{t('De')}</label>
              <select id="tr-from" value={tr.from} onChange={(e) => setTr({ ...tr, from: e.target.value })}>
                <option value="">{t('Choisir…')}</option>
                {accounts.map((a) => (<option key={a.id} value={a.id}>{a.name} ({a.currency})</option>))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tr-to">{t('Vers')}</label>
              <select id="tr-to" value={tr.to} onChange={(e) => setTr({ ...tr, to: e.target.value })}>
                <option value="">{t('Choisir…')}</option>
                {accounts.map((a) => (<option key={a.id} value={a.id}>{a.name} ({a.currency})</option>))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tr-amount">{t('Montant envoyé')} {from ? `(${from.currency})` : ''}</label>
              <input id="tr-amount" type="number" step="0.01" min="0" value={tr.amount} onChange={(e) => setTr({ ...tr, amount: e.target.value })} />
            </div>
            {crossCurrency && (
              <div className="form-group">
                <label htmlFor="tr-to-amount">{t('Montant reçu')} ({to.currency})</label>
                <input id="tr-to-amount" type="number" step="0.01" min="0" value={tr.toAmount} onChange={(e) => setTr({ ...tr, toAmount: e.target.value })} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="tr-date">{t('Date')}</label>
            <input id="tr-date" type="date" value={tr.date} onChange={(e) => setTr({ ...tr, date: e.target.value })} />
          </div>
          <button type="submit">{t('Effectuer le virement')}</button>
        </form>
      )}

      {transfers.length > 0 && (
        <section className="expense-list-section">
          <div className="expense-list-header"><h2>{t('Virements ({count})', { count: transfers.length })}</h2></div>
          <ul className="expense-list">
            {transfers.map((tf) => (
              <li key={tf.id} className="expense-item">
                <span className="expense-category-badge" style={{ backgroundColor: kindOf(tf).color }}>{kindOf(tf).label}</span>
                <div className="expense-info">
                  <p className="expense-label">{getAccount(tf.from_account_id)?.name || '?'} → {getAccount(tf.to_account_id)?.name || '?'}</p>
                  <p className="expense-date">{formatDate(tf.date)}</p>
                </div>
                <span className="expense-amount">
                  {formatAmount(tf.amount, getAccountCurrency(tf.from_account_id))}
                </span>
                <button type="button" className="expense-delete-btn" onClick={() => window.confirm(t('Supprimer ce virement ?')) && removeTransfer(tf.id)} aria-label={t('Supprimer le virement')}>🗑️</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default AccountsPage;

import { useAccounts, getAccountType } from '../hooks/useAccounts';
import { formatAmount } from '../utils/formatters';
import { useState } from 'react';
import { t } from '../i18n';

function AccountBalances({ onDelete, onCash }) {
  const { accounts, balances, getAccountCurrency, updateAccount } = useAccounts();
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const startEdit = (a) => { setEditId(a.id); setName(a.name); setErr(''); };
  const saveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr(t('Le nom du compte est obligatoire.'));
    const { error } = await updateAccount(editId, { name: name.trim() });
    if (error) return setErr(t('Impossible de renommer le compte.'));
    setEditId(null);
  };

  if (accounts.length === 0) return null;

  return (
    <section className="summary">
      <h2>{t('Mes comptes')}</h2>
      <ul className="account-list">
        {accounts.map((a) => {
          const type = getAccountType(a.type);
          const balance = balances[a.id] ?? 0;
          return (
            <li key={a.id} className="account-row">
              <span className="account-icon">{type.icon}</span>
              {editId === a.id ? (
                <form className="account-rename" onSubmit={saveName}>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoFocus aria-label={t('Nouveau nom du compte')} />
                  <button type="submit">{t('Enregistrer')}</button>
                  <button type="button" className="btn-secondary" onClick={() => setEditId(null)}>{t('Annuler')}</button>
                  {err && <span className="form-error">{err}</span>}
                </form>
              ) : (
                <div className="account-info">
                  <p className="expense-label">{a.name}</p>
                  <p className="expense-date">
                    {type.label} · {a.currency}
                  </p>
                </div>
              )}
              <span className={`account-balance ${balance < 0 ? 'negative' : ''}`}>
                {formatAmount(balance, getAccountCurrency(a.id))}
              </span>
              {onDelete && editId !== a.id && (
                <button type="button" className="expense-edit-btn" onClick={() => startEdit(a)} aria-label={t('Renommer le compte {name}', { name: a.name })}>
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="expense-delete-btn"
                  onClick={() => onDelete(a)}
                  aria-label={t('Supprimer le compte {name}', { name: a.name })}
                >
                  🗑️
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {onCash && (
        <button type="button" className="cash-link" onClick={onCash}>
          💵 {t("Retrait / dépôt d'espèces")}
        </button>
      )}
    </section>
  );
}

export default AccountBalances;

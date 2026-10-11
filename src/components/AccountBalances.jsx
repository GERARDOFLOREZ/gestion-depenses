import { useAccounts, getAccountType } from '../hooks/useAccounts';
import { formatAmount } from '../utils/formatters';

function AccountBalances({ onDelete }) {
  const { accounts, balances, getAccountCurrency } = useAccounts();

  if (accounts.length === 0) return null;

  return (
    <section className="summary">
      <h2>Mes comptes</h2>
      <ul className="account-list">
        {accounts.map((a) => {
          const type = getAccountType(a.type);
          const balance = balances[a.id] ?? 0;
          return (
            <li key={a.id} className="account-row">
              <span className="account-icon">{type.icon}</span>
              <div className="account-info">
                <p className="expense-label">{a.name}</p>
                <p className="expense-date">
                  {type.label} · {a.currency}
                </p>
              </div>
              <span className={`account-balance ${balance < 0 ? 'negative' : ''}`}>
                {formatAmount(balance, getAccountCurrency(a.id))}
              </span>
              {onDelete && (
                <button
                  type="button"
                  className="expense-delete-btn"
                  onClick={() => onDelete(a)}
                  aria-label={`Supprimer le compte ${a.name}`}
                >
                  🗑️
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default AccountBalances;

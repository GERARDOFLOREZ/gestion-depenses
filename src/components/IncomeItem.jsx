import { useIncomes } from '../hooks/useIncomes';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { formatAmountOrRange, formatDate } from '../utils/formatters';
import { t } from '../i18n';

function IncomeItem({ income, onEdit }) {
  const { deleteIncome } = useIncomes();
  const { getAccountCurrency, getAccount } = useAccounts();
  const { getIncomeCategory } = useCategories();
  const currency = getAccountCurrency(income.account_id);
  const category = getIncomeCategory(income.category);
  const account = getAccount(income.account_id);

  const handleDelete = () => {
    if (window.confirm(t('Supprimer le revenu "{label}" ?', { label: income.label }))) {
      deleteIncome(income.id);
    }
  };

  return (
    <li className="expense-item">
      <span
        className="expense-category-badge"
        style={{ backgroundColor: category.color }}
      >
        {category.label}
      </span>

      <div className="expense-info">
        <p className="expense-label">{income.label}</p>
        <p className="expense-date">
          {formatDate(income.date)}
          {account ? ` · ${account.name}` : ''}
        </p>
      </div>

      <span className="expense-amount income-amount">
        + {formatAmountOrRange(income, currency)}
      </span>

      <button
        className="expense-edit-btn"
        onClick={() => onEdit(income)}
        aria-label={t('Modifier {label}', { label: income.label })}
      >
        ✏️
      </button>

      <button
        className="expense-delete-btn"
        onClick={handleDelete}
        aria-label={t('Supprimer {label}', { label: income.label })}
      >
        🗑️
      </button>
    </li>
  );
}

export default IncomeItem;
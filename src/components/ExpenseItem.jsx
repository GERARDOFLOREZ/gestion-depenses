import { useExpenses } from '../hooks/useExpenses';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { formatAmount, formatDate } from '../utils/formatters';

function ExpenseItem({ expense, onEdit }) {
  const { deleteExpense } = useExpenses();
  const { getAccountCurrency, getAccount } = useAccounts();
  const { getExpenseCategory } = useCategories();
  const currency = getAccountCurrency(expense.account_id);
  const category = getExpenseCategory(expense.category);
  const account = getAccount(expense.account_id);

  const handleDelete = () => {
    if (window.confirm(`Supprimer la dépense "${expense.label}" ?`)) {
      deleteExpense(expense.id);
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
        <p className="expense-label">{expense.label}</p>
        <p className="expense-date">
          {formatDate(expense.date)}
          {account ? ` · ${account.name}` : ''}
        </p>
      </div>

      <span className="expense-amount">{formatAmount(expense.amount, currency)}</span>

      <button
        className="expense-edit-btn"
        onClick={() => onEdit(expense)}
        aria-label={`Modifier ${expense.label}`}
      >
        ✏️
      </button>

      <button
        className="expense-delete-btn"
        onClick={handleDelete}
        aria-label={`Supprimer ${expense.label}`}
      >
        🗑️
      </button>
    </li>
  );
}

export default ExpenseItem;
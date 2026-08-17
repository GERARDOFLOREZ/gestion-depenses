import { useExpenses } from '../hooks/useExpenses';
import { getCategoryById } from '../data/categories';
import { formatAmount, formatDate } from '../utils/formatters';

function ExpenseItem({ expense, onEdit }) {
  const { deleteExpense } = useExpenses();
  const category = getCategoryById(expense.category);

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
        <p className="expense-date">{formatDate(expense.date)}</p>
      </div>

      <span className="expense-amount">{formatAmount(expense.amount)}</span>

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
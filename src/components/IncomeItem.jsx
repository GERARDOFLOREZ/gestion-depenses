import { useIncomes } from '../hooks/useIncomes';
import { getIncomeCategoryById } from '../data/incomeCategories';
import { formatAmount, formatDate } from '../utils/formatters';

function IncomeItem({ income, onEdit }) {
  const { deleteIncome } = useIncomes();
  const category = getIncomeCategoryById(income.category);

  const handleDelete = () => {
    if (window.confirm(`Supprimer le revenu "${income.label}" ?`)) {
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
        <p className="expense-date">{formatDate(income.date)}</p>
      </div>

      <span className="expense-amount income-amount">
        + {formatAmount(income.amount)}
      </span>

      <button
        className="expense-edit-btn"
        onClick={() => onEdit(income)}
        aria-label={`Modifier ${income.label}`}
      >
        ✏️
      </button>

      <button
        className="expense-delete-btn"
        onClick={handleDelete}
        aria-label={`Supprimer ${income.label}`}
      >
        🗑️
      </button>
    </li>
  );
}

export default IncomeItem;
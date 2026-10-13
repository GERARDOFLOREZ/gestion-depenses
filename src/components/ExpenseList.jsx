import { useExpenses } from '../hooks/useExpenses';
import { exportExpensesToCSV } from '../utils/csvExport';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import ExpenseItem from './ExpenseItem';
import { t } from '../i18n';

function ExpenseList({ onEdit }) {
  const { expenses } = useExpenses();
  const { getAccount } = useAccounts();
  const { getExpenseCategory } = useCategories();

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <p>{t('Aucune dépense enregistrée pour le moment.')}</p>
      </div>
    );
  }

  const handleExport = () => {
    exportExpensesToCSV(expenses, { getCategory: getExpenseCategory, getAccount });
  };

  return (
    <section className="expense-list-section">
      <div className="expense-list-header">
        <h2>{t('Historique des dépenses ({count})', { count: expenses.length })}</h2>
        <button type="button" className="export-btn" onClick={handleExport}>
          📥 {t('Exporter en CSV')}
        </button>
      </div>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} />
        ))}
      </ul>
    </section>
  );
}

export default ExpenseList;
import { useExpenses } from '../hooks/useExpenses';
import { exportExpensesToCSV } from '../utils/csvExport';
import ExpenseItem from './ExpenseItem';

function ExpenseList({ onEdit }) {
  const { expenses } = useExpenses();

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <p>Aucune dépense enregistrée pour le moment.</p>
      </div>
    );
  }

  const handleExport = () => {
    exportExpensesToCSV(expenses);
  };

  return (
    <section className="expense-list-section">
      <div className="expense-list-header">
        <h2>Historique des dépenses ({expenses.length})</h2>
        <button type="button" className="export-btn" onClick={handleExport}>
          📥 Exporter en CSV
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
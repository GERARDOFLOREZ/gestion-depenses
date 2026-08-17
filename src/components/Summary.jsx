import { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { CATEGORIES } from '../data/categories';
import { formatAmount } from '../utils/formatters';

function Summary() {
  const { expenses, filteredTotalAmount } = useExpenses();

  const totalsByCategory = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const total = expenses
        .filter((exp) => exp.category === cat.id)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      return { ...cat, total };
    }).filter((cat) => cat.total > 0);
  }, [expenses]);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <section className="summary">
      <h2>Résumé {filteredTotalAmount !== undefined && `— ${formatAmount(filteredTotalAmount)}`}</h2>

      <div className="summary-bars">
        {totalsByCategory.map((cat) => {
          const percentage = (cat.total / filteredTotalAmount) * 100;
          return (
            <div key={cat.id} className="summary-row">
              <div className="summary-row-header">
                <span>{cat.label}</span>
                <span>{formatAmount(cat.total)}</span>
              </div>
              <div className="summary-bar-track">
                <div
                  className="summary-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Summary;
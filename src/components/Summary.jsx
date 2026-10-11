import { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useView } from '../hooks/useView';
import { useCategories } from '../hooks/useCategories';
import { getCurrencyByCode } from '../data/currencies';
import MixedCurrencyNotice from './MixedCurrencyNotice';
import { formatAmount } from '../utils/formatters';

function Summary() {
  const { expenses, filteredTotalAmount } = useExpenses();
  const { viewCurrencyCode } = useView();
  const { expenseCategories } = useCategories();
  const currency = getCurrencyByCode(viewCurrencyCode || 'EUR');

  const totalsByCategory = useMemo(() => {
    return expenseCategories.map((cat) => {
      const total = expenses
        .filter((exp) => exp.category === cat.id)
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      return { ...cat, total };
    }).filter((cat) => cat.total > 0);
  }, [expenses, expenseCategories]);

  if (!viewCurrencyCode) {
    return <MixedCurrencyNotice title="Résumé" />;
  }

  if (expenses.length === 0) {
    return null;
  }

  return (
    <section className="summary">
      <h2>Résumé {filteredTotalAmount !== undefined && `— ${formatAmount(filteredTotalAmount, currency)}`}</h2>

      <div className="summary-bars">
        {totalsByCategory.map((cat) => {
          const percentage = (cat.total / filteredTotalAmount) * 100;
          return (
            <div key={cat.id} className="summary-row">
              <div className="summary-row-header">
                <span>{cat.label}</span>
                <span>{formatAmount(cat.total, currency)}</span>
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
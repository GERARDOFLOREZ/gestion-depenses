import { useBudgets } from '../hooks/useBudgets';
import { formatAmount } from '../utils/formatters';

function BudgetOverview() {
  const { budgetStatus } = useBudgets();

  if (budgetStatus.length === 0) {
    return null;
  }

  return (
    <section className="budget-overview">
      <h2>Suivi des budgets — ce mois-ci</h2>

      <div className="budget-overview-list">
        {budgetStatus.map((cat) => (
          <div key={cat.id} className="budget-overview-row">
            <div className="budget-overview-header">
              <span className="budget-overview-label">{cat.label}</span>
              <span
                className={`budget-overview-amounts ${cat.isOverBudget ? 'over-budget' : ''}`}
              >
                {formatAmount(cat.spent)} / {formatAmount(cat.budgetAmount)}
              </span>
            </div>

            <div className="budget-bar-track">
              <div
                className="budget-bar-fill"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.isOverBudget ? '#c62828' : cat.color,
                }}
              />
            </div>

            {cat.isOverBudget ? (
              <p className="budget-alert">
                ⚠️ Dépassement de {formatAmount(Math.abs(cat.remaining))}
              </p>
            ) : (
              <p className="budget-remaining">
                {formatAmount(cat.remaining)} restants
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default BudgetOverview;
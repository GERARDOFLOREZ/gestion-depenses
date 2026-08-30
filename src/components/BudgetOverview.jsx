import { useBudgets } from '../hooks/useBudgets';
import { useCurrency } from '../hooks/useCurrency';
import { formatAmount } from '../utils/formatters';

const MONTH_NAMES = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

function BudgetOverview() {
  const { budgetStatus } = useBudgets();
  const { currency } = useCurrency();

  const now = new Date();
  const currentMonthLabel = MONTH_NAMES[now.getMonth()];

  if (budgetStatus.length === 0) {
    return null;
  }

  return (
    <section className="budget-overview">
      <h2>Suivi du mois de {currentMonthLabel}</h2>

      <div className="budget-overview-list">
        {budgetStatus.map((cat) => (
          <div key={cat.id} className="budget-overview-row">
            <div className="budget-overview-header">
              <span>{cat.label}</span>
              <span className={cat.isOverBudget ? 'budget-over' : ''}>
                {formatAmount(cat.spent, currency)} / {formatAmount(cat.budgetAmount, currency)}
              </span>
            </div>

            <div className="budget-bar-track">
              <div
                className={`budget-bar-fill ${cat.isOverBudget ? 'over-budget' : ''}`}
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.isOverBudget ? '#c62828' : cat.color,
                }}
              />
            </div>

            {cat.isOverBudget ? (
              <p className="budget-alert">
                ⚠️ Dépassement de {formatAmount(Math.abs(cat.remaining), currency)}
              </p>
            ) : (
              <p className="budget-remaining">
                Reste {formatAmount(cat.remaining, currency)}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default BudgetOverview;
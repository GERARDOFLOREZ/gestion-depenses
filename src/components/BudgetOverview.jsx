import { useBudgets } from '../hooks/useBudgets';
import { useCurrency } from '../hooks/useCurrency';
import { formatAmount, formatMonthName, getMonthISO } from '../utils/formatters';
import { t } from '../i18n';

function BudgetOverview() {
  const { budgetStatus } = useBudgets();
  const { currency } = useCurrency();

  const now = new Date();
  const currentMonthLabel = formatMonthName(getMonthISO(now)).toLowerCase();

  if (budgetStatus.length === 0) {
    return null;
  }

  return (
    <section className="budget-overview">
      <h2>{t('Suivi du mois de {month}', { month: currentMonthLabel })}</h2>

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
                  backgroundColor: cat.isOverBudget ? '#c62828' : cat.isNearLimit ? '#f57c00' : cat.color,
                }}
              />
            </div>

            {cat.isOverBudget ? (
              <p className="budget-alert">
                ⚠️ {t('Dépassement de {amount}', { amount: formatAmount(Math.abs(cat.remaining), currency) })}
              </p>
            ) : cat.isNearLimit ? (
              <p className="budget-warning">
                ⚠️ {t('Attention : il ne reste que {amount} avant la limite', { amount: formatAmount(cat.remaining, currency) })}
              </p>
            ) : (
              <p className="budget-remaining">
                {t('Reste {amount}', { amount: formatAmount(cat.remaining, currency) })}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default BudgetOverview;
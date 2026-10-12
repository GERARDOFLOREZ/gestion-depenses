import { useBudgetAlerts } from '../hooks/useBudgetAlerts';

function BudgetAlertsBanner({ onSeeBudgets }) {
  const alerts = useBudgetAlerts();
  if (alerts.length === 0) return null;

  return (
    <section className="alert-banner" role="alert">
      <h2>⚠️ Budgets à surveiller ce mois-ci</h2>
      <ul>
        {alerts.map((a) => (
          <li key={a.id} className={`alert-item alert-${a.level}`}>
            <strong>{a.title}</strong>
            <span>{a.message}</span>
          </li>
        ))}
      </ul>
      {onSeeBudgets && (
        <button type="button" className="alert-link" onClick={onSeeBudgets}>
          Voir mes budgets →
        </button>
      )}
    </section>
  );
}

export default BudgetAlertsBanner;

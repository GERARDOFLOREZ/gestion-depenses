import { usePlanned } from '../hooks/usePlanned';
import { formatAmount } from '../utils/formatters';
import { t } from '../i18n';

const range = (low, high, currency) =>
  low === high ? formatAmount(low, currency) : `${formatAmount(low, currency)} – ${formatAmount(high, currency)}`;

/** Tableau de bord : dépenses prévues, échéances proches et solde prévisionnel. */
function UpcomingCard({ onSee }) {
  const { groups, overdue, soon } = usePlanned();
  if (groups.length === 0) return null;

  return (
    <section className="summary upcoming-card">
      <h2>🗓️ {t('Dépenses à venir')}</h2>
      {(overdue > 0 || soon > 0) && (
        <p className="upcoming-alert" role="status">
          ⚠️{' '}
          {overdue > 0 && t('{n} dépense(s) prévue(s) en retard.', { n: overdue })}{' '}
          {soon > 0 && t('{n} dépense(s) à payer dans les 3 jours.', { n: soon })}
        </p>
      )}
      {groups.map((g) => (
        <div key={g.currency.code} className="upcoming-group">
          <div><span>{t('Prévu')} ({g.count})</span><strong>{range(g.low, g.high, g.currency)}</strong></div>
          <div><span>{t('Solde actuel')}</span><strong>{formatAmount(g.balance, g.currency)}</strong></div>
          <div className="upcoming-forecast">
            <span>{t('Solde prévisionnel')}</span>
            <strong className={g.forecastLow < 0 ? 'negative' : ''}>{range(g.forecastLow, g.forecastHigh, g.currency)}</strong>
          </div>
        </div>
      ))}
      {onSee && (
        <button type="button" className="alert-link" onClick={onSee}>{t('Voir les dépenses prévues →')}</button>
      )}
    </section>
  );
}

export default UpcomingCard;

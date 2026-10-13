import { useView } from '../hooks/useView';
import { useAccounts } from '../hooks/useAccounts';
import { formatMonthLabel, getMonthISO, shiftMonth } from '../utils/formatters';
import { t } from '../i18n';

function ViewBar() {
  const { month, setMonth, accountId, setAccountId } = useView();
  const { accounts } = useAccounts();
  const isAll = month === 'all';

  return (
    <div className="view-bar">
      <div className="month-nav">
        <button
          type="button"
          onClick={() => setMonth(shiftMonth(month, -1))}
          disabled={isAll}
          aria-label={t('Mois précédent')}
        >
          ‹
        </button>
        <span className="month-label">{isAll ? t('Toute la période') : formatMonthLabel(month)}</span>
        <button
          type="button"
          onClick={() => setMonth(shiftMonth(month, 1))}
          disabled={isAll}
          aria-label={t('Mois suivant')}
        >
          ›
        </button>
        <button
          type="button"
          className="month-toggle"
          onClick={() => setMonth(isAll ? getMonthISO() : 'all')}
        >
          {isAll ? t('Ce mois') : t('Tout')}
        </button>
      </div>

      {accounts.length > 0 && (
        <select
          className="account-select"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          aria-label={t('Compte affiché')}
        >
          <option value="all">{t('Tous les comptes')}</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.currency})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default ViewBar;

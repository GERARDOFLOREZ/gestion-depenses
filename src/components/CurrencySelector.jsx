import { useCurrency } from '../hooks/useCurrency';
import { CURRENCIES } from '../data/currencies';
import { t } from '../i18n';

function CurrencySelector() {
  const { currencyCode, setCurrencyCode } = useCurrency();

  return (
    <div className="currency-selector">
      <label htmlFor="currency-select">{t('Devise principale')}</label>
      <select
        id="currency-select"
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
      >
        {CURRENCIES.map((cur) => (
          <option key={cur.code} value={cur.code}>
            {cur.symbol} — {t(cur.label)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelector;
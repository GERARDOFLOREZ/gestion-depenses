import { LANGUAGES, t } from '../i18n';
import { useLanguage } from '../hooks/useLanguage';

function LanguageSelector({ className = '' }) {
  const { locale, setLocale } = useLanguage();
  return (
    <label className={`lang-select ${className}`}>
      <span aria-hidden="true">🌐</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-label={t('Langue')}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSelector;

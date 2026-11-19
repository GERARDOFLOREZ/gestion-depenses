import { useSpace } from '../hooks/useSpace';
import { spaceLabel } from '../utils/spaces';
import { t } from '../i18n';

const NEW_SPACE = '__new__';

// Petit menu dans l'en-tête : choisir son espace, ou en créer un nouveau.
function SpaceSwitcher({ className = '' }) {
  const { spaces, spaceId, setSpaceId, createSpace } = useSpace();

  const handleChange = async (e) => {
    const value = e.target.value;
    if (value !== NEW_SPACE) {
      setSpaceId(value);
      return;
    }
    const name = window.prompt(t('Nom du nouvel espace'));
    if (!name || !name.trim()) return;
    const { error } = await createSpace(name);
    if (error) window.alert(t("Impossible de créer l'espace."));
  };

  return (
    <label className={`lang-select space-select ${className}`}>
      <span aria-hidden="true">🗂️</span>
      <select value={spaceId} onChange={handleChange} aria-label={t('Espace')}>
        {spaces.map((s) => (
          <option key={s.id} value={s.id}>{spaceLabel(s)}</option>
        ))}
        <option value={NEW_SPACE}>＋ {t('Créer un espace')}</option>
      </select>
    </label>
  );
}

export default SpaceSwitcher;

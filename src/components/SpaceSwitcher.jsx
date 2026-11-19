import { useSpace } from '../hooks/useSpace';
import { spaceLabel } from '../utils/spaces';
import { t } from '../i18n';

const NEW_SPACE = '__new__';
const RENAME_SPACE = '__rename__';
const DELETE_SPACE = '__delete__';

// Petit menu dans l'en-tête : choisir son espace, en créer, renommer ou supprimer un espace.
function SpaceSwitcher({ className = '' }) {
  const { spaces, spaceId, currentSpace, setSpaceId, createSpace, renameSpace, deleteSpace } = useSpace();
  // L'espace perso ne peut être ni renommé ni supprimé.
  const isCustom = currentSpace?.kind === 'custom';

  const handleChange = async (e) => {
    const value = e.target.value;

    if (value === NEW_SPACE) {
      const name = window.prompt(t('Nom du nouvel espace'));
      if (!name || !name.trim()) return;
      const { error } = await createSpace(name);
      if (error) window.alert(t("Impossible de créer l'espace."));
      return;
    }

    if (value === RENAME_SPACE) {
      const name = window.prompt(t("Nouveau nom de l'espace"), currentSpace.name);
      if (!name || !name.trim() || name.trim() === currentSpace.name) return;
      const { error } = await renameSpace(currentSpace.id, name);
      if (error) window.alert(t("Impossible de renommer l'espace."));
      return;
    }

    if (value === DELETE_SPACE) {
      const ok = window.confirm(
        t('Supprimer l\'espace "{name}" ?\nTOUTES ses données (comptes, dépenses, revenus, budgets...) seront définitivement supprimées.', {
          name: currentSpace.name,
        })
      );
      if (!ok) return;
      const { error } = await deleteSpace(currentSpace.id);
      if (error) window.alert(t("Impossible de supprimer l'espace."));
      return;
    }

    setSpaceId(value);
  };

  return (
    <label className={`lang-select space-select ${className}`}>
      <span aria-hidden="true">🗂️</span>
      <select value={spaceId} onChange={handleChange} aria-label={t('Espace')}>
        {spaces.map((s) => (
          <option key={s.id} value={s.id}>{spaceLabel(s)}</option>
        ))}
        <option value={NEW_SPACE}>＋ {t('Créer un espace')}</option>
        {isCustom && <option value={RENAME_SPACE}>✎ {t('Renommer cet espace')}</option>}
        {isCustom && <option value={DELETE_SPACE}>🗑 {t('Supprimer cet espace')}</option>}
      </select>
    </label>
  );
}

export default SpaceSwitcher;

import { t } from '../i18n';

// Nom affiché d'un espace : l'espace perso est traduit, les autres gardent le nom choisi.
export function spaceLabel(space) {
  if (!space) return '';
  return space.kind === 'perso' ? t('Mon espace perso') : space.name;
}

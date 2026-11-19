import { Fragment } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSpace } from '../hooks/useSpace';
import { t } from '../i18n';

/**
 * Place l'espace actif au-dessus de toutes les données. Le `key` fait repartir
 * l'arbre de zéro quand on change d'espace : aucune donnée d'un espace ne peut
 * rester affichée (ou être écrite) dans un autre.
 */
function SpaceGate({ children }) {
  const { user } = useAuth();
  const { spaceId, loading, error, reload } = useSpace();

  if (!user) return children;

  if (error) {
    return (
      <div className="auth-loading">
        <p>{t('Impossible de charger vos espaces.')}</p>
        <button type="button" onClick={reload}>{t('Réessayer')}</button>
      </div>
    );
  }

  if (loading || !spaceId) {
    return <div className="auth-loading">{t('Chargement...')}</div>;
  }

  return <Fragment key={spaceId}>{children}</Fragment>;
}

export default SpaceGate;

import { t } from '../i18n';

function DbNotice({ error, script = 'schema_v2.sql' }) {
  if (!error) return null;
  return (
    <div className="db-notice">
      <strong>{t('Mise à jour de la base de données requise.')}</strong>{' '}
      {t('Cette section a besoin des nouvelles tables : exécutez une fois le script')}{' '}
      <code>supabase/{script}</code>{' '}
      {t('dans Supabase (SQL Editor), puis rechargez la page.')}
    </div>
  );
}

export default DbNotice;

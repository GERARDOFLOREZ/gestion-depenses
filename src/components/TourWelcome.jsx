import { useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../i18n';

/**
 * Fenêtre de bienvenue (première connexion) : propose la visite, sans jamais l'imposer.
 */
function TourWelcome({ onStart, onLater }) {
  useLanguage();
  const goRef = useRef(null);

  useEffect(() => {
    goRef.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && onLater();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onLater]);

  return (
    <div className="tour-welcome-backdrop">
      <section className="tour-welcome" role="dialog" aria-modal="true" aria-labelledby="tour-welcome-title">
        <span className="tour-welcome-icon" aria-hidden="true">🧭</span>
        <h2 id="tour-welcome-title">{t('Bienvenue ! On fait le tour ?')}</h2>
        <p>{t('Une minute pour découvrir tout ce que vous pouvez faire. Vous pouvez arrêter quand vous voulez.')}</p>
        <button type="button" ref={goRef} className="tour-welcome-go" onClick={onStart}>
          {t('Commencer la visite')}
        </button>
        <button type="button" className="tour-welcome-later" onClick={onLater}>
          {t('Plus tard')}
        </button>
      </section>
    </div>
  );
}

export default TourWelcome;

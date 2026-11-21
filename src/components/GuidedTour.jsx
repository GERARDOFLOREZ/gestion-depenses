import { useEffect, useRef, useState } from 'react';
import { TOUR_STEPS } from '../data/tour';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../i18n';

/**
 * Visite guidée : une petite carte en bas de l'écran, pendant que la vraie page
 * dont elle parle s'affiche derrière, avec la zone concernée mise en évidence.
 * Jamais bloquante : « Passer » est toujours visible, et Échap ferme.
 */
function GuidedTour({ onNavigate, onClose, onFinish }) {
  useLanguage(); // la carte se réaffiche si la langue change pendant la visite
  const [index, setIndex] = useState(0);
  const primaryRef = useRef(null);

  const step = TOUR_STEPS[index];
  const total = TOUR_STEPS.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // 1. Ouvrir la vraie page de l'étape.
  useEffect(() => {
    onNavigate(step.tab);
  }, [step.tab, onNavigate]);

  // 2. Mettre la zone en évidence et la faire défiler à l'écran.
  //    La page vient de changer : on réessaie un court instant le temps qu'elle s'affiche.
  useEffect(() => {
    let cancelled = false;
    let timer;
    let el = null;
    let tries = 0;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const spot = () => {
      if (cancelled) return;
      el = step.target ? document.querySelector(step.target) : null;
      if (!el) {
        if (step.target && tries < 15) {
          tries += 1;
          timer = setTimeout(spot, 120);
        } else {
          window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        return;
      }
      el.classList.add('tour-spot');
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };

    timer = setTimeout(spot, 60);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      el?.classList.remove('tour-spot');
    };
  }, [step]);

  // 3. Clavier : Échap ferme ; le focus suit le bouton principal.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    primaryRef.current?.focus({ preventScroll: true });
  }, [index]);

  return (
    <section className="tour-card" role="dialog" aria-modal="false" aria-label={t('Visite guidée')}>
      <div className="tour-head">
        <span className="tour-icon" aria-hidden="true">{step.icon}</span>
        <h3 className="tour-title">{t(step.title)}</h3>
        <button type="button" className="tour-skip" onClick={onClose}>
          {isLast ? t('Fermer') : t('Passer')}
        </button>
      </div>

      <p className="tour-text" aria-live="polite">{t(step.text)}</p>

      <div className="tour-foot">
        <div
          className="tour-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-label={t('Étape {current} sur {total}', { current: index + 1, total })}
        >
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
        <div className="tour-actions">
          {!isFirst && (
            <button type="button" className="tour-btn tour-btn-ghost" onClick={() => setIndex(index - 1)}>
              {t('Précédent')}
            </button>
          )}
          <button
            type="button"
            ref={primaryRef}
            className="tour-btn tour-btn-primary"
            onClick={isLast ? onFinish : () => setIndex(index + 1)}
          >
            {isLast ? t('Ajouter ma première dépense') : t('Suivant')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default GuidedTour;

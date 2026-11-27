import { useEffect, useRef } from 'react';
import { LEGAL, LEGAL_UPDATED } from '../data/legal';
import { getLocale, t } from '../i18n';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Conditions d'utilisation / Politique de confidentialité, affichées par-dessus l'appli
 * (accessibles avant la connexion comme après).
 */
function LegalPage({ doc, onClose, onSwitch }) {
  useLanguage(); // se réaffiche si la langue change
  const closeRef = useRef(null);
  const lang = getLocale();
  const content = LEGAL[doc]?.[lang] ?? LEGAL[doc]?.fr;
  const other = doc === 'terms' ? 'privacy' : 'terms';

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!content) return null;

  return (
    <div className="legal-backdrop" onClick={onClose}>
      <article
        className="legal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="legal-head">
          <div>
            <h2 id="legal-title">{content.title}</h2>
            <p className="legal-updated">{content.updated} : {LEGAL_UPDATED[lang] ?? LEGAL_UPDATED.fr}</p>
          </div>
          <button type="button" ref={closeRef} className="legal-close" onClick={onClose} aria-label={t('Fermer')}>
            ✕
          </button>
        </header>

        <div className="legal-body">
          {content.sections.map(([heading, paragraphs]) => (
            <section key={heading}>
              <h3>{heading}</h3>
              {paragraphs.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>

        <footer className="legal-foot">
          <button type="button" className="legal-link" onClick={() => onSwitch(other)}>
            {t(other === 'terms' ? "Conditions d'utilisation" : 'Confidentialité')}
          </button>
          <button type="button" className="legal-done" onClick={onClose}>{t('Fermer')}</button>
        </footer>
      </article>
    </div>
  );
}

export default LegalPage;

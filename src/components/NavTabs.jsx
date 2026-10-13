import { useEffect } from 'react';
import { MENU_GROUPS } from '../data/menu';
import { t } from '../i18n';

function NavTabs({ activeTab, onTabChange, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`menu-overlay ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <nav className={`side-menu ${open ? 'open' : ''}`} aria-label={t('Menu principal')}>
        <div className="side-menu-head">
          <span className="side-menu-brand">💰 {t('Mes finances')}</span>
          <button type="button" className="side-menu-close" onClick={onClose} aria-label={t('Fermer le menu')}>
            ✕
          </button>
        </div>

        {MENU_GROUPS.map((group) => (
          <div key={group.title} className="side-group">
            <p className="side-group-title">{t(group.title)}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`side-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
              >
                <span className="side-link-icon">{item.icon}</span>
                {t(item.label)}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}

export default NavTabs;

import { useEffect } from 'react';
import { t } from '../i18n';

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.key), 9000);
    return () => clearTimeout(timer);
  }, [toast.key, onClose]);

  return (
    <div className={`toast toast-${toast.level}`} role="alert" onClick={() => onClose(toast.key)}>
      <span className="toast-icon">{toast.level === 'over' ? '🚨' : '⚠️'}</span>
      <div>
        <p className="toast-title">{toast.title}</p>
        <p className="toast-text">{toast.message}</p>
      </div>
      <button type="button" className="toast-close" aria-label={t('Fermer')}>✕</button>
    </div>
  );
}

function BudgetToasts({ toasts, onClose }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack">
      {toasts.map((item) => (
        <Toast key={item.key} toast={item} onClose={onClose} />
      ))}
    </div>
  );
}

export default BudgetToasts;

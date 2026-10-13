import { translations } from './translations';

// Le français est la langue de référence : la chaîne française sert de clé.
export const LANGUAGES = [
  { code: 'fr', label: 'Français', dir: 'ltr', intl: 'fr-FR' },
  { code: 'en', label: 'English', dir: 'ltr', intl: 'en-US' },
  { code: 'es', label: 'Español', dir: 'ltr', intl: 'es-ES' },
  // nu-latn : chiffres 0-9 (plus lisibles pour les montants et cohérents avec l'export CSV)
  { code: 'ar', label: 'العربية', dir: 'rtl', intl: 'ar-u-nu-latn' },
];

const STORAGE_KEY = 'gestion-depenses:language';
const isSupported = (code) => LANGUAGES.some((l) => l.code === code);

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupported(saved)) return saved;
  } catch {
    /* stockage indisponible */
  }
  const nav = (typeof navigator !== 'undefined' && navigator.language || 'fr').slice(0, 2).toLowerCase();
  return isSupported(nav) ? nav : 'fr';
}

let current = detect();

export const getLocale = () => current;
export const getLanguage = () => LANGUAGES.find((l) => l.code === current);
export const intlLocale = () => getLanguage().intl;

function applyToDocument() {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = current;
  document.documentElement.dir = getLanguage().dir;
}

export function setLocale(code) {
  if (!isSupported(code)) return;
  current = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignoré */
  }
  applyToDocument();
}

applyToDocument();

if (typeof window !== 'undefined') window.__i18nMissing = new Set();

export function t(key, params) {
  let text = key;
  if (current !== 'fr') {
    const found = translations[current]?.[key];
    if (found === undefined) {
      if (typeof window !== 'undefined') window.__i18nMissing.add(key);
    } else {
      text = found;
    }
  }
  if (params) {
    text = text.replace(/\{(\w+)\}/g, (m, name) => (name in params ? params[name] : m));
  }
  return text;
}

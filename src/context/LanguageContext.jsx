import { createContext, useState, useCallback, useMemo } from 'react';
import { getLocale, setLocale as applyLocale } from '../i18n';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getLocale);

  const setLocale = useCallback((code) => {
    applyLocale(code);
    setLocaleState(getLocale());
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

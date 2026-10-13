import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage doit être utilisé dans un LanguageProvider');
  return ctx;
}

import { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext(null);

const CURRENCY_KEY = 'gestion-depenses:currency';
const DEFAULT_CURRENCY = 'EUR';

function loadCurrency() {
  try {
    return localStorage.getItem(CURRENCY_KEY) || DEFAULT_CURRENCY;
  } catch (error) {
    console.error('Erreur lors du chargement de la devise :', error);
    return DEFAULT_CURRENCY;
  }
}

function saveCurrency(code) {
  try {
    localStorage.setItem(CURRENCY_KEY, code);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la devise :', error);
  }
}

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(loadCurrency);

  useEffect(() => {
    saveCurrency(currencyCode);
  }, [currencyCode]);

  return (
    <CurrencyContext.Provider value={{ currencyCode, setCurrencyCode }}>
      {children}
    </CurrencyContext.Provider>
  );
}
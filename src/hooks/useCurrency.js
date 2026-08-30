import { useContext } from 'react';
import { CurrencyContext } from '../context/CurrencyContext';
import { getCurrencyByCode } from '../data/currencies';

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency doit être utilisé à l\'intérieur d\'un CurrencyProvider');
  }

  const { currencyCode, setCurrencyCode } = context;
  const currency = getCurrencyByCode(currencyCode);

  return {
    currency,
    currencyCode,
    setCurrencyCode,
  };
}
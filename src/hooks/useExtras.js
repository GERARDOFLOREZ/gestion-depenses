import { useContext } from 'react';
import { ExtrasContext } from '../context/ExtrasContext';

export function useExtras() {
  const context = useContext(ExtrasContext);
  if (!context) {
    throw new Error("useExtras doit être utilisé à l'intérieur d'un ExtrasProvider");
  }
  return context;
}

import { useContext } from 'react';
import { ViewContext } from '../context/ViewContext';

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView doit être utilisé à l'intérieur d'un ViewProvider");
  }
  return context;
}

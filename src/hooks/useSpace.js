import { useContext } from 'react';
import { SpaceContext } from '../context/SpaceContext';

export function useSpace() {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace doit être utilisé à l'intérieur d'un SpaceProvider");
  }
  return context;
}

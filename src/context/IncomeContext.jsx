import { createContext, useReducer, useEffect } from 'react';
import { loadIncomes, saveIncomes } from '../utils/storage';

export const IncomeContext = createContext(null);

const initialState = {
  incomes: loadIncomes(),
};

function incomeReducer(state, action) {
  switch (action.type) {
    case 'ADD_INCOME': {
      const newIncome = {
        id: crypto.randomUUID(),
        ...action.payload,
      };
      return { ...state, incomes: [newIncome, ...state.incomes] };
    }

    case 'UPDATE_INCOME': {
      const updated = state.incomes.map((inc) =>
        inc.id === action.payload.id ? { ...inc, ...action.payload } : inc
      );
      return { ...state, incomes: updated };
    }

    case 'DELETE_INCOME': {
      const filtered = state.incomes.filter((inc) => inc.id !== action.payload);
      return { ...state, incomes: filtered };
    }

    default:
      return state;
  }
}

export function IncomeProvider({ children }) {
  const [state, dispatch] = useReducer(incomeReducer, initialState);

  useEffect(() => {
    saveIncomes(state.incomes);
  }, [state.incomes]);

  return (
    <IncomeContext.Provider value={{ incomes: state.incomes, dispatch }}>
      {children}
    </IncomeContext.Provider>
  );
}
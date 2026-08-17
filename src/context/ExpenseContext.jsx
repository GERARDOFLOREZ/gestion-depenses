import { createContext, useReducer, useEffect } from 'react';
import { loadExpenses, saveExpenses } from '../utils/storage';

export const ExpenseContext = createContext(null);

const initialState = {
  expenses: loadExpenses(),
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExpense = {
        id: crypto.randomUUID(),
        ...action.payload,
      };
      return { ...state, expenses: [newExpense, ...state.expenses] };
    }

    case 'UPDATE_EXPENSE': {
      const updated = state.expenses.map((exp) =>
        exp.id === action.payload.id ? { ...exp, ...action.payload } : exp
      );
      return { ...state, expenses: updated };
    }

    case 'DELETE_EXPENSE': {
      const filtered = state.expenses.filter((exp) => exp.id !== action.payload);
      return { ...state, expenses: filtered };
    }

    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    saveExpenses(state.expenses);
  }, [state.expenses]);

  return (
    <ExpenseContext.Provider value={{ expenses: state.expenses, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}
import { createContext, useReducer, useEffect } from 'react';
import { loadBudgets, saveBudgets } from '../utils/storage';

export const BudgetContext = createContext(null);

const initialState = {
  budgets: loadBudgets(),
};

function budgetReducer(state, action) {
  switch (action.type) {
    case 'SET_BUDGET': {
      const { categoryId, amount } = action.payload;
      return {
        ...state,
        budgets: { ...state.budgets, [categoryId]: amount },
      };
    }

    case 'REMOVE_BUDGET': {
      const updated = { ...state.budgets };
      delete updated[action.payload];
      return { ...state, budgets: updated };
    }

    default:
      return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  useEffect(() => {
    saveBudgets(state.budgets);
  }, [state.budgets]);

  return (
    <BudgetContext.Provider value={{ budgets: state.budgets, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}
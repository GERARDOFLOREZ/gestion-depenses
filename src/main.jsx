import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { IncomeProvider } from './context/IncomeContext.jsx';
import { BudgetProvider } from './context/BudgetContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseProvider>
      <IncomeProvider>
        <BudgetProvider>
          <App />
        </BudgetProvider>
      </IncomeProvider>
    </ExpenseProvider>
  </StrictMode>
);
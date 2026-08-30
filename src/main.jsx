import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { IncomeProvider } from './context/IncomeContext.jsx';
import { BudgetProvider } from './context/BudgetContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CurrencyProvider>
        <ExpenseProvider>
          <IncomeProvider>
            <BudgetProvider>
              <App />
            </BudgetProvider>
          </IncomeProvider>
        </ExpenseProvider>
      </CurrencyProvider>
    </AuthProvider>
  </StrictMode>
);
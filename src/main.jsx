import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import { IncomeProvider } from './context/IncomeContext.jsx';
import { BudgetProvider } from './context/BudgetContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { ExtrasProvider } from './context/ExtrasContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ViewProvider } from './context/ViewContext.jsx';
import { SpaceProvider } from './context/SpaceContext.jsx';
import SpaceGate from './components/SpaceGate.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
    <AuthProvider>
      <SpaceProvider>
      <CurrencyProvider>
        <SpaceGate>
        <ExpenseProvider>
          <IncomeProvider>
            <BudgetProvider>
              <ExtrasProvider>
                <ViewProvider>
                  <App />
                </ViewProvider>
              </ExtrasProvider>
            </BudgetProvider>
          </IncomeProvider>
        </ExpenseProvider>
        </SpaceGate>
      </CurrencyProvider>
      </SpaceProvider>
    </AuthProvider>
    </LanguageProvider>
  </StrictMode>
);
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker non enregistré :', err);
    });
  });
}
